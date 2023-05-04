<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户端名称" label-width="auto" prop="clientName">
        <el-input
          v-model="queryParams.clientName"
          placeholder="请输入客户端名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户端状态" label-width="auto"  prop="disableFlag">
        <el-select v-model="queryParams.disableFlag" placeholder="请选择客户端状态" clearable>
          <el-option
            v-for="dict in sys_yes_no"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['system:sysClient:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleEdit"
          v-hasPermi="['system:sysClient:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:sysClient:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:sysClient:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table ref="mainTable" v-loading="loading" :data="sysClientList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键id" align="center" prop="id" show-overflow-tooltip />
      <el-table-column label="客户端名称" align="center" prop="clientName" />
      <el-table-column label="客户端appId" align="center" prop="clientAppId" />
      <el-table-column label="客户端appSecret" align="center" prop="clientAppSecret" />
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
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="租户id" align="center" prop="tenantId" show-overflow-tooltip />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleEdit(scope.row)"
            v-hasPermi="['system:sysClient:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:sysClient:remove']"
          >删除</el-button>
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

    <!-- 添加或修改客户端信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="sysClientRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户端名称"  label-width="auto"  prop="clientName">
          <el-input v-model="form.clientName" placeholder="请输入客户端名称" />
        </el-form-item>
        <el-form-item label="客户端appId" label-width="auto"  prop="clientAppId">
          <el-input v-model="form.clientAppId" placeholder="请输入客户端appId" />
        </el-form-item>
        <el-form-item label="客户端appSecret" label-width="auto"  prop="clientAppSecret">
          <el-input v-model="form.clientAppSecret" placeholder="请输入客户端appSecret" />
        </el-form-item>
        <el-form-item label="备注" label-width="auto"  prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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

<script setup name="SysClient">
    import {getSysClientListRequest, getSysClientDetailsRequest, addSysClientRequest, editSysClientRequest, deleteSysClientByIdsRequest,  disableSysClientRequest } from "@/api/system/sysClient";

const { proxy } = getCurrentInstance();
const { sys_yes_no } = proxy.useDict('sys_yes_no');

const sysClientList = ref([]);
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
    clientName: null,
    clientAppId: null,
    clientAppSecret: null,
    disableFlag: null,
  },
  rules: {
    clientName: [
      { required: true, message: "客户端名称不能为空", trigger: "blur" }
    ],
    clientAppId: [
      { required: true, message: "客户端appId不能为空", trigger: "blur" }
    ],
    clientAppSecret: [
      { required: true, message: "客户端appSecret不能为空", trigger: "blur" }
    ],
    disableFlag: [
      { required: true, message: "客户端状态不能为空", trigger: "blur" }
    ],
    createUserId: [
      { required: true, message: "创建者id不能为空", trigger: "blur" }
    ],
    createTime: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ],
    updateUserId: [
      { required: true, message: "更新者id不能为空", trigger: "blur" }
    ],
    updateTime: [
      { required: true, message: "更新时间不能为空", trigger: "blur" }
    ],
  },
});
const { queryParams, form, rules } = toRefs(data);

/** 查询客户端信息列表 */
async function getList() {
  loading.value = true;
  let response = await getSysClientListRequest(queryParams.value)
  sysClientList.value = response.data.list;
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
    id: null,
    clientName: null,
    clientAppId: null,
    clientAppSecret: null,
    disableFlag: null,
    createUserId: null,
    createTime: null,
    updateUserId: null,
    updateTime: null,
    remark: null,
    tenantId: null
  };
  proxy.resetForm("sysClientRef");
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
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加客户端信息";
}

/** 修改按钮操作 */
async function handleEdit(row) {
  reset();
  const id = row.id || ids.value[0]
  let response = await getSysClientDetailsRequest(id);
  form.value = response.data;
  open.value = true;
  title.value = "修改客户端信息";
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["sysClientRef"].validate(async valid => {
    if (valid) {
      if (form.value.id != null) {
        await editSysClientRequest(form.value);
        proxy.$modal.msgSuccess("修改成功");
        open.value = false;
        await getList();
      } else {
        await addSysClientRequest(form.value);
        proxy.$modal.msgSuccess("新增成功");
        open.value = false;
        await getList();
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const idList = row.id ? [row.id] : ids.value;
  proxy.$modal.confirm('是否确认删除客户端信息编号为"' + idList + '"的数据项？').then(async () => {
    await deleteSysClientByIdsRequest(idList);
    await getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 状态修改  */
function handleStatusChange(row) {
    let text = row.disableFlag == "0" ? "启用" : "停用";
    proxy.$modal.confirm('确认要"' + text + '"编号为【' + row.id + '】的项吗?').then(function () {
        return disableSysClientRequest({
    id: row.id,
    disableFlag: row.disableFlag,
})}).then(() => {
    proxy.$modal.msgSuccess(text + "成功");
}).catch(function () {
    row.disableFlag = row.disableFlag == "0" ? "1" : "0";
});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/sysClient/export', {
    ...queryParams.value
  }, `sysClient_${new Date().getTime()}.xlsx`)
}

getList();
</script>
