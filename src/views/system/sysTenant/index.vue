<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="租户名称" prop="tenantName">
        <el-input
            v-model="queryParams.tenantName"
            placeholder="请输入租户名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="租户标识" prop="tenantTag">
        <el-input
            v-model="queryParams.tenantTag"
            placeholder="请输入租户标识"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['system:sysTenant:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleEdit"
            v-hasPermi="['system:sysTenant:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:sysTenant:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['system:sysTenant:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table ref="mainTable" v-loading="loading" :data="sysTenantList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="租户ID" align="center" prop="tenantId" show-overflow-tooltip/>
      <el-table-column label="租户名称" align="center" prop="tenantName"/>
      <el-table-column label="租户标识" align="center" prop="tenantTag"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="handleEdit(scope.row)"
              v-hasPermi="['system:sysTenant:edit']"
          >修改
          </el-button>
          <el-button
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:sysTenant:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改系统租户对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="sysTenantRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="租户名称" prop="tenantName">
          <el-input v-model="form.tenantName" placeholder="请输入租户名称"/>
        </el-form-item>
        <el-form-item label="租户标识" prop="tenantTag">
          <el-input v-model="form.tenantTag" placeholder="请输入租户标识"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="SysTenant">
import {
  addSysTenantRequest,
  deleteSysTenantByTenantIdsRequest,
  editSysTenantRequest,
  getSysTenantDetailsRequest,
  getSysTenantListRequest
} from "@/api/system/sysTenant";

const {proxy} = getCurrentInstance();

const sysTenantList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");


const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    tenantName: null,
    tenantTag: null,
  },
  rules: {
    tenantName: [
      {required: true, message: "租户名称不能为空", trigger: "blur"}
    ],
    tenantTag: [
      {required: true, message: "租户标识不能为空", trigger: "blur"}
    ],
  },
});
const {queryParams, form, rules} = toRefs(data);

/** 查询系统租户列表 */
async function getList() {
  loading.value = true;
  let response = await getSysTenantListRequest(queryParams.value)
  sysTenantList.value = response.data.list;
  total.value = response.data.total;
  loading.value = false;
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    tenantId: null,
    tenantName: null,
    tenantTag: null,
    createUserId: null,
    updateUserId: null,
    createTime: null,
    updateTime: null
  };
  proxy.resetForm("sysTenantRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.tenantId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加系统租户";
}

/** 修改按钮操作 */
async function handleEdit(row) {
  reset();
  const tenantId = row.tenantId || ids.value[0]
  let response = await getSysTenantDetailsRequest(tenantId);
  form.value = response.data;
  open.value = true;
  title.value = "修改系统租户";
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["sysTenantRef"].validate(async valid => {
    if (valid) {
      if (form.value.tenantId != null) {
        await editSysTenantRequest(form.value);
        proxy.$modal.msgSuccess("修改成功");
        open.value = false;
        await getList();
      } else {
        await addSysTenantRequest(form.value);
        proxy.$modal.msgSuccess("新增成功");
        open.value = false;
        await getList();
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const tenantIdList = row.tenantId ? [row.tenantId] : ids.value;
  proxy.$modal.confirm('是否确认删除系统租户编号为"' + tenantIdList + '"的数据项？').then(async () => {
    await deleteSysTenantByTenantIdsRequest(tenantIdList);
    await getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/sysTenant/export', {
    ...queryParams.value
  }, `sysTenant_${new Date().getTime()}.xlsx`)
}

getList();
</script>
