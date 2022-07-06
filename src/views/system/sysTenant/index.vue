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

    <el-table ref="mainTable" v-loading="loading" :data="sysTenantList"
              @expand-change="getTenantDetails" :row-key="getRowKeys" :expand-row-keys="expands">
      <el-table-column type="expand" align="center">
        <template  #default="props">
          <div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="租户ID" align="center" prop="tenantId" show-overflow-tooltip/>
      <el-table-column label="租户名称" align="center" prop="tenantName"/>
      <el-table-column label="租户标识" align="center" prop="tenantTag"/>
      <el-table-column label="租户后管地址" align="center" prop="tenantManageDomain"  show-overflow-tooltip>
        <template #default="scope">
          <span style="cursor: pointer" v-copyText="scope.row.tenantManageDomain">
            {{scope.row.tenantManageDomain}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="有效时间" align="center" prop="startValidTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startValidTime) }}</span>
          <br>
          <span>至</span>
          <br>
          <span>{{ parseTime(scope.row.endValidTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" key="disableFlag">
        <template #default="scope">
          <el-switch
              v-model="scope.row.disableFlag"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
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
        <el-form-item label="租户Logo" prop="tenantManageLogo">
          <userAvatar :title="'修改头像'" default-image=""/>
        </el-form-item>
        <el-form-item label="状态" v-if="!form.tenantId">
          <el-radio-group v-model="form.disableFlag">
            <el-radio
                v-for="dict in sys_normal_disable"
                :key="dict.value"
                :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有效时间" style="width: 450px" prop="dateRange">
          <el-date-picker
              v-model="form.dateRange"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="[new Date(0,0,0,0,0,0),new Date(0,0,0,23,59,59)]"
          ></el-date-picker>
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
  deleteSysTenantByIdsRequest,
  disableSysTenantRequest,
  editSysTenantRequest,
  getSysTenantDetailsRequest,
  getSysTenantListRequest
} from "@/api/system/sysTenant";
import UserAvatar from "../../../components/ImageCropUpload";

const {proxy} = getCurrentInstance();
const {sys_normal_disable} = proxy.useDict("sys_normal_disable");

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
  expands: [],
  getRowKeys: (expandedRows) => {
    return expandedRows.tenantId
  },
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
    dateRange: [
      {
        required: true, type: "array", message: "有效时间不能为空", trigger: "blur"
      }
    ],
  },
});
const {expands, getRowKeys, queryParams, form, rules} = toRefs(data);

function  getTenantDetails(expandedRows, rowList) {

}

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
    disableFlag: '0',
    tenantName: null,
    tenantTag: null,
    startValidTime: null,
    endValidTime: null,
    dateRange: []
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
  form.value.dateRange = [form.value.startValidTime, form.value.endValidTime]
  open.value = true;
  title.value = "修改系统租户";
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["sysTenantRef"].validate(async valid => {
    if (valid) {
      form.value.startValidTime = form.value.dateRange[0];
      form.value.endValidTime = form.value.dateRange[1];
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
    await deleteSysTenantByIdsRequest(tenantIdList);
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

/** 用户状态修改  */
function handleStatusChange(row) {
  let text = row.disableFlag == "0" ? "启用" : "停用";
  proxy.$modal.confirm('确认要"' + text + '""' + row.tenantName + '"租户吗?').then(function () {
    return disableSysTenantRequest({
      tenantId: row.tenantId,
      disableFlag: row.disableFlag,
    });
  }).then(() => {
    proxy.$modal.msgSuccess(text + "成功");
  }).catch(function () {
    row.disableFlag = row.disableFlag == "0" ? "1" : "0";
  });
}

getList();
</script>
