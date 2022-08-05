<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="支付配置名称" prop="payConfigName">
        <el-input
          v-model="queryParams.payConfigName"
          placeholder="请输入支付配置名称"
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
          v-hasPermi="['pay:payConfig:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleEdit"
          v-hasPermi="['pay:payConfig:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['pay:payConfig:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['pay:payConfig:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table ref="mainTable" v-loading="loading" :data="payConfigList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="支付配置主键" align="center" prop="id" show-overflow-tooltip />
      <el-table-column label="支付配置名称" align="center" prop="payConfigName" />
      <el-table-column label="所属支付商户id" align="center" prop="payMerchantId">
        <template #default="scope">
          <dict-tag :options="pay_channel" :value="scope.row.payMerchantId"/>
        </template>
      </el-table-column>
      <el-table-column label="支付配置参数（json字符串）" align="center" prop="payConfigParams" />
      <el-table-column label="是否禁用" align="center" prop="disableFlag">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.disableFlag"/>
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
            v-hasPermi="['pay:payConfig:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['pay:payConfig:remove']"
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

    <!-- 添加或修改支付配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="payConfigRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="支付配置名称" prop="payConfigName">
          <el-input v-model="form.payConfigName" placeholder="请输入支付配置名称" />
        </el-form-item>
        <el-form-item label="所属支付商户id" prop="payMerchantId">
          <el-select v-model="form.payMerchantId" placeholder="请选择所属支付商户id">
            <el-option
              v-for="dict in pay_channel"
              :key="dict.value"
              :label="dict.label"
:value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付配置参数（json字符串）" prop="payConfigParams">
          <el-input v-model="form.payConfigParams" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否禁用">
          <el-radio-group v-model="form.disableFlag">
            <el-radio
              v-for="dict in sys_yes_no"
              :key="dict.value"
:label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
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

<script setup name="PayConfig">
    import {getPayConfigListRequest, getPayConfigDetailsRequest, addPayConfigRequest, editPayConfigRequest, deletePayConfigByIdsRequest} from "@/api/pay/payConfig";

    const { proxy } = getCurrentInstance();
const { pay_channel, sys_yes_no } = proxy.useDict('pay_channel', 'sys_yes_no');

const payConfigList = ref([]);
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
    payConfigName: null,
  },
  rules: {
    payConfigName: [
      { required: true, message: "支付配置名称不能为空", trigger: "blur" }
    ],
    payMerchantId: [
      { required: true, message: "所属支付商户id不能为空", trigger: "change" }
    ],
    payConfigParams: [
      { required: true, message: "支付配置参数（json字符串）不能为空", trigger: "blur" }
    ],
    disableFlag: [
      { required: true, message: "是否禁用不能为空", trigger: "blur" }
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

/** 查询支付配置列表 */
async function getList() {
  loading.value = true;
  let response = await getPayConfigListRequest(queryParams.value)
  payConfigList.value = response.data.list;
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
    payConfigName: null,
    payMerchantId: null,
    payConfigParams: null,
    disableFlag: "0",
    createUserId: null,
    createTime: null,
    updateUserId: null,
    updateTime: null,
    remark: null,
    tenantId: null
  };
  proxy.resetForm("payConfigRef");
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
  title.value = "添加支付配置";
}

/** 修改按钮操作 */
async function handleEdit(row) {
  reset();
  const id = row.id || ids.value[0]
  let response = await getPayConfigDetailsRequest(id);
  form.value = response.data;
  open.value = true;
  title.value = "修改支付配置";
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["payConfigRef"].validate(async valid => {
    if (valid) {
      if (form.value.id != null) {
        await editPayConfigRequest(form.value);
        proxy.$modal.msgSuccess("修改成功");
        open.value = false;
        await getList();
      } else {
        await addPayConfigRequest(form.value);
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
  proxy.$modal.confirm('是否确认删除支付配置编号为"' + idList + '"的数据项？').then(async () => {
    await deletePayConfigByIdsRequest(idList);
    await getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('pay/payConfig/export', {
    ...queryParams.value
  }, `payConfig_${new Date().getTime()}.xlsx`)
}

getList();
</script>
