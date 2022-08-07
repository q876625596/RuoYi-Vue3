<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="支付渠道" prop="merchantPayChannel">
        <el-select v-model="queryParams.merchantPayChannel" placeholder="请选择商户支付渠道" clearable>
          <el-option
              v-for="dict in pay_channel"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="商户名称" prop="merchantName">
        <el-input
            v-model="queryParams.merchantName"
            placeholder="请输入商户名称"
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
            v-hasPermi="['pay:payMerchant:add']"
        >新增
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table ref="mainTable" v-loading="loading" :data="payMerchantList"
              @expand-change="expandMerchant" :row-key="getRowKeys" :expand-row-keys="expands">
      <el-table-column type="expand" align="center">
        <template #default="props" v-loading="loadingConfig">
          <el-card style="margin-top: 10px" shadow="hover" v-for="item in props.row.payConfigList">
            <el-descriptions :title="props.row.merchantName + '【' + item.payConfigName + '】' + '支付配置信息'" :border="true"
                             :column="1">
              <template #extra>
                <el-switch
                    style="margin-right: 20px"
                    v-model="item.disableFlag"
                    active-value="0"
                    inactive-value="1"
                    @change="handleConfigStatusChange(item)"
                ></el-switch>
                <el-button type="success" @click="handleEditConfig(item)">修改支付配置
                </el-button>
                <el-button type="danger" @click="handleDeleteConfig(item)">删除支付配置
                </el-button>
              </template>
              <el-descriptions-item class-name="descriptionContent" align="center" :label="key" span="1"
                                    v-for="(param,key) in getParams(item)">
                {{ param }}

              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </template>


        <!--        <el-table width="200px" ref="mainTable" v-loading="loadingConfig" :data="payConfigList">-->
        <!--          <el-table-column label="支付配置主键" align="center" prop="id" show-overflow-tooltip />-->
        <!--          <el-table-column label="支付配置名称" align="center" prop="payConfigName" />-->
        <!--          <el-table-column label="支付配置参数（json字符串）" align="center" prop="payConfigParams" />-->
        <!--          <el-table-column label="状态" align="center" key="disableFlag">-->
        <!--            <template #default="scope">-->
        <!--              <el-switch-->
        <!--                  v-model="scope.row.disableFlag"-->
        <!--                  active-value="0"-->
        <!--                  inactive-value="1"-->
        <!--                  @change="handleStatusChange(scope.row)"-->
        <!--              ></el-switch>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--          <el-table-column label="创建时间" align="center" prop="createTime" width="180">-->
        <!--            <template #default="scope">-->
        <!--              <span>{{ parseTime(scope.row.createTime) }}</span>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--          <el-table-column label="备注" align="center" prop="remark" />-->
        <!--          <el-table-column label="租户id" align="center" prop="tenantId" show-overflow-tooltip />-->
        <!--          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
        <!--            <template #default="scope">-->
        <!--              <el-button-->
        <!--                  type="text"-->
        <!--                  icon="Edit"-->
        <!--                  @click="handleEdit(scope.row)"-->
        <!--                  v-hasPermi="['pay:payConfig:edit']"-->
        <!--              >修改</el-button>-->
        <!--              <el-button-->
        <!--                  type="text"-->
        <!--                  icon="Delete"-->
        <!--                  @click="handleDelete(scope.row)"-->
        <!--                  v-hasPermi="['pay:payConfig:remove']"-->
        <!--              >删除</el-button>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--        </el-table>-->
      </el-table-column>
      <el-table-column label="主键" align="center" prop="id" show-overflow-tooltip/>
      <el-table-column label="支付渠道" align="center" prop="merchantPayChannel">
        <template #default="scope">
          <dict-tag :options="pay_channel" :value="scope.row.merchantPayChannel"/>
        </template>
      </el-table-column>
      <el-table-column label="商户名称" align="center" prop="merchantName"/>
      <el-table-column label="商户号" align="center" prop="merchantNumber"/>
      <el-table-column label="主商户号" align="center" prop="parentMerchantNumber"/>
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
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="handleEdit(scope.row)"
              v-hasPermi="['pay:payMerchant:edit']"
          >修改
          </el-button>
          <el-button
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['pay:payMerchant:remove']"
          >删除
          </el-button>
          <el-button
              type="text"
              icon="Plus"
              @click="handleAddConfig(scope.row)"
              v-hasPermi="['pay:payConfig:edit']"
          >新增支付配置
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

    <!-- 添加或修改支付商户对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="payMerchantRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="支付渠道" prop="merchantPayChannel">
          <el-select v-model="form.merchantPayChannel" placeholder="请选择商户支付渠道">
            <el-option
                v-for="dict in pay_channel"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户名称" prop="merchantName">
          <el-input v-model="form.merchantName" placeholder="请输入商户名称"/>
        </el-form-item>
        <el-form-item label="商户号" prop="merchantNumber">
          <el-input v-model="form.merchantNumber" placeholder="请输入商户号"/>
        </el-form-item>
        <el-form-item label="主商户号" prop="parentMerchantNumber">
          <el-input v-model="form.parentMerchantNumber" placeholder="请输入主商户号（如果是主商户，则为自身商户号）"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加或修改支付配置对话框 -->
    <el-dialog :title="titleConfig" v-model="openConfig" width="800px" append-to-body>
      <el-form ref="payConfigRef" :model="formConfig" :rules="rulesConfig" label-width="80px">
        <el-form-item label="配置名称" prop="payConfigName">
          <el-input v-model="formConfig.payConfigName" placeholder="请输入支付配置名称"/>
        </el-form-item>
        <el-form-item label="所属商户" prop="payMerchantId">
          <el-select disabled v-model="formConfig.payMerchantId" filterable placeholder="请选择所属支付商户id">
            <el-option disabled
                       v-for="merchant in payMerchantList"
                       :key="merchant.id"
                       :label="merchant.merchantName"
                       :value="merchant.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付配置参数（json字符串）" prop="payConfigParams">
          <el-input :autosize="true" v-model="formConfig.payConfigParams" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formConfig.remark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFormConfig">确 定</el-button>
          <el-button @click="cancelConfig">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="PayMerchant">
import {
  addPayMerchantRequest,
  deletePayMerchantByIdsRequest,
  disablePayMerchantRequest,
  editPayMerchantRequest,
  getPayMerchantDetailsRequest,
  getPayMerchantListForSelectRequest,
  getPayMerchantListRequest
} from "@/api/pay/payMerchant";
import {
  addPayConfigRequest,
  deletePayConfigByIdsRequest,
  disablePayConfigRequest,
  editPayConfigRequest,
  getPayConfigDetailsRequest,
  getPayConfigListRequest
} from "@/api/pay/payConfig";

const {proxy} = getCurrentInstance();
const {pay_channel} = proxy.useDict('pay_channel');

const payMerchantList = ref([]);
const selectPayMerchantList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const tempMerchantId = ref(null);
const openConfig = ref(false);
const loadingConfig = ref(true);
const titleConfig = ref("");
//微信支付参数模板
const tempWxParams = `
{
    "appId" : "填写微信AppId",
    "merchantId" : "填写微信商户号",
    "merchantSerialNumber" : "填写微信商户证书序列号",
    "apiV3Key" : "填写微信apiV3Key",
    "privateKey" : "填写微信privateKey"
}
`
//银联支付参数模板
const tempUnionParams = `
{
    "appId" : "填写银联AppId",
    "appKey" : "填写银联AppKey",
    "appSecret" : "填写银联appSecret",
    "merchantId" : "填写银联商户号",
    "tid" : "填写银联终端号",
    "merchantPrefix" : "填写银联商户前缀"
}
`

const data = reactive({
  form: {},
  formConfig: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    merchantPayChannel: null,
    merchantName: null,
  },
  expands: [],
  getRowKeys: (expandedRows) => {
    return expandedRows.id
  },
  rules: {
    merchantPayChannel: [
      {required: true, message: "商户支付渠道不能为空", trigger: "change"}
    ],
    merchantName: [
      {required: true, message: "商户名称不能为空", trigger: "blur"}
    ],
    merchantNumber: [
      {required: true, message: "商户号不能为空", trigger: "blur"}
    ],
    // parentMerchantNumber: [
    //   { required: true, message: "主商户号（如果是主商户，则为自身商户号）不能为空", trigger: "blur" }
    // ],
    disableFlag: [
      {required: true, message: "是否禁用不能为空", trigger: "blur"}
    ],
    createUserId: [
      {required: true, message: "创建者id不能为空", trigger: "blur"}
    ],
    createTime: [
      {required: true, message: "创建时间不能为空", trigger: "blur"}
    ],
    updateUserId: [
      {required: true, message: "更新者id不能为空", trigger: "blur"}
    ],
    updateTime: [
      {required: true, message: "更新时间不能为空", trigger: "blur"}
    ],
  },
  rulesConfig: {
    payConfigName: [
      {required: true, message: "支付配置名称不能为空", trigger: "blur"}
    ],
    payMerchantId: [
      {required: true, message: "所属支付商户id不能为空", trigger: "blur"}
    ],
    payConfigParams: [
      {required: true, message: "支付配置参数（json字符串）不能为空", trigger: "blur"}
    ],
    disableFlag: [
      {required: true, message: "是否禁用不能为空", trigger: "blur"}
    ],
    createUserId: [
      {required: true, message: "创建者id不能为空", trigger: "blur"}
    ],
    createTime: [
      {required: true, message: "创建时间不能为空", trigger: "blur"}
    ],
    updateUserId: [
      {required: true, message: "更新者id不能为空", trigger: "blur"}
    ],
    updateTime: [
      {required: true, message: "更新时间不能为空", trigger: "blur"}
    ],
  },
});
const {expands, getRowKeys, queryParams, form, formConfig, rules, rulesConfig} = toRefs(data);

/** 状态修改  */
function handleConfigStatusChange(row) {
  let text = row.disableFlag == "0" ? "启用" : "停用";
  proxy.$modal.confirm('确认要"' + text + '""' + row.payConfigName + '"支付配置吗?').then(function () {
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

function getParams(item) {
  try {
    return JSON.parse(item.payConfigParams);
  } catch (e) {
    return {"params": item.payConfigParams};
  }
}

function expandMerchant(expandedRows, rowList) {
  //展开
  if (rowList.indexOf(expandedRows) != -1) {
    getConfigList(expandedRows);
  }
}

/** 查询支付配置列表 */
async function getConfigList(row) {
  loadingConfig.value = true;
  let response = await getPayConfigListRequest({payMerchantId: row.id})
  row.payConfigList = response.data;
  loadingConfig.value = false;
}

/** 查询支付商户列表 */
async function getSelectMerchantList() {
  let response = await getPayMerchantListForSelectRequest()
  selectPayMerchantList.value = response.data;
}


// 表单重置
function resetConfig() {
  formConfig.value = {
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

// 取消按钮
function cancelConfig() {
  openConfig.value = false;
  tempMerchantId.value = null;
  resetConfig();
}

/** 新增按钮操作 */
async function handleAddConfig(row) {
  resetConfig();
  await getSelectMerchantList();
  openConfig.value = true;
  titleConfig.value = "添加支付配置";
  switch (row.merchantPayChannel) {
    case "1":
      formConfig.value.payConfigParams = tempWxParams;
      break
    case "2":
      break
    case "3":
      formConfig.value.payConfigParams = tempUnionParams;
      break
  }
  tempMerchantId.value = row.id;
  formConfig.value.payMerchantId = tempMerchantId.value;
}

/** 修改按钮操作 */
async function handleEditConfig(row) {
  resetConfig();
  const id = row.id
  await getSelectMerchantList();
  let response = await getPayConfigDetailsRequest(id);
  formConfig.value = response.data;
  openConfig.value = true;
  titleConfig.value = "修改支付配置";
  tempMerchantId.value = row.payMerchantId;
}


/** 删除按钮操作 */
function handleDeleteConfig(row) {
  const idList = [row.id];
  let payMerchant = payMerchantList.value.find(item => item.id == row.payMerchantId);
  proxy.$modal.confirm('是否确认删除支付配置编号为"' + idList + '"的数据项？').then(async () => {
    await deletePayConfigByIdsRequest(idList);
    await getConfigList(payMerchant);
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 提交按钮 */
function submitFormConfig() {
  proxy.$refs["payConfigRef"].validate(async valid => {
    if (valid) {
      let payMerchant = payMerchantList.value.find(item => item.id == tempMerchantId.value);
      if (formConfig.value.id != null) {
        await editPayConfigRequest(formConfig.value);
        proxy.$modal.msgSuccess("修改成功");
        openConfig.value = false;
        await getConfigList(payMerchant);
      } else {
        await addPayConfigRequest(formConfig.value);
        proxy.$modal.msgSuccess("新增成功");
        openConfig.value = false;
        await getConfigList(payMerchant);
      }
    }
  });
}

/** 状态修改  */
function handleStatusChange(row) {
  let text = row.disableFlag == "0" ? "启用" : "停用";
  proxy.$modal.confirm('确认要"' + text + '""' + row.merchantName + '"商户吗?').then(function () {
    return disablePayMerchantRequest({
      id: row.id,
      disableFlag: row.disableFlag,
    });
  }).then(() => {
    proxy.$modal.msgSuccess(text + "成功");
  }).catch(function () {
    row.disableFlag = row.disableFlag == "0" ? "1" : "0";
  });
}

/** 查询支付商户列表 */
async function getList() {
  loading.value = true;
  let response = await getPayMerchantListRequest(queryParams.value)
  payMerchantList.value = response.data.list;
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
    merchantPayChannel: null,
    merchantName: null,
    merchantNumber: null,
    parentMerchantNumber: null,
    disableFlag: "0",
    createUserId: null,
    createTime: null,
    updateUserId: null,
    updateTime: null,
    remark: null,
    tenantId: null
  };
  proxy.resetForm("payMerchantRef");
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
  title.value = "添加支付商户";
}

/** 修改按钮操作 */
async function handleEdit(row) {
  reset();
  const id = row.id
  let response = await getPayMerchantDetailsRequest(id);
  form.value = response.data;
  open.value = true;
  title.value = "修改支付商户";
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["payMerchantRef"].validate(async valid => {
    if (valid) {
      if (!form.value.parentMerchantNumber) {
        form.value.parentMerchantNumber = form.value.merchantNumber;
      }
      if (form.value.id != null) {
        await editPayMerchantRequest(form.value);
        proxy.$modal.msgSuccess("修改成功");
        open.value = false;
        await getList();
      } else {
        await addPayMerchantRequest(form.value);
        proxy.$modal.msgSuccess("新增成功");
        open.value = false;
        await getList();
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const idList = [row.id];
  proxy.$modal.confirm('是否确认删除支付商户编号为"' + idList + '"的数据项？').then(async () => {
    await deletePayMerchantByIdsRequest(idList);
    await getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('pay/payMerchant/export', {
    ...queryParams.value
  }, `payMerchant_${new Date().getTime()}.xlsx`)
}

getList();
</script>
<style scoped>
/deep/ .descriptionContent {
  overflow: hidden;
  max-width: 400px;
}
</style>
