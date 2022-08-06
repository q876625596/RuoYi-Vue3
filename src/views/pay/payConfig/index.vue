<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="配置名称" prop="payConfigName">
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
      <el-table-column label="所属支付商户id" align="center" prop="payMerchantId"/>
      <el-table-column label="支付配置参数（json字符串）" align="center" prop="payConfigParams" />
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
        <el-form-item label="配置名称" prop="payConfigName">
          <el-input v-model="form.payConfigName" placeholder="请输入支付配置名称" />
        </el-form-item>
        <el-form-item label="所属商户" prop="payMerchantId">
          <el-select v-model="form.payMerchantId" filterable placeholder="请选择所属支付商户id">
            <el-option
              v-for="merchant in payMerchantList"
              :key="merchant.id"
              :label="merchant.merchantName"
:value="merchant.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付配置参数（json字符串）" prop="payConfigParams">
          <el-input v-model="form.payConfigParams" type="textarea" placeholder="请输入内容" />
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
import {
  getPayConfigListRequest,
  getPayConfigDetailsRequest,
  addPayConfigRequest,
  editPayConfigRequest,
  deletePayConfigByIdsRequest,
  disablePayConfigRequest
} from "@/api/pay/payConfig";
import {getPayMerchantListForSelectRequest} from "@/api/pay/payMerchant";

    const { proxy } = getCurrentInstance();

const payMerchantList = ref([]);
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



    /** 状态修改  */
    function handleStatusChange(row) {
      let text = row.disableFlag == "0" ? "启用" : "停用";
      proxy.$modal.confirm('确认要"' + text + '""' + row.payConfigName + '"配置吗?').then(function () {
        return disablePayConfigRequest({
          id: row.id,
          disableFlag: row.disableFlag,
        });
      }).then(() => {
        proxy.$modal.msgSuccess(text + "成功");
      }).catch(function () {
        row.disableFlag = row.disableFlag == "0" ? "1" : "0";
      });
    }

/** 查询支付配置列表 */
async function getList() {
  loading.value = true;
  let response = await getPayConfigListRequest(queryParams.value)
  payConfigList.value = response.data;
  total.value = response.data.total;
  loading.value = false;
}

/** 查询支付商户列表 */
async function getMerchantList() {
  let response = await getPayMerchantListForSelectRequest()
  payMerchantList.value = response.data;
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
async function handleAdd() {
  reset();
  await getMerchantList();
  open.value = true;
  title.value = "添加支付配置";
}

/** 修改按钮操作 */
async function handleEdit(row) {
  reset();
  const id = row.id || ids.value[0]
  await getMerchantList();
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
