<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="支付配置名称" label-width="auto" prop="payConfigName">
        <el-input
            v-model="queryParams.payConfigName"
            placeholder="请输入支付配置名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="支付商户类型" label-width="auto" prop="payMerchantType">
        <el-select @change="queryParams.payConfigType = null" v-model="queryParams.payMerchantType"
                   placeholder="请选择支付商户类型" clearable>
          <el-option
              v-for="dict in pay_merchant_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="支付配置类型" label-width="auto" prop="payConfigType">
        <el-select v-model="queryParams.payConfigType" placeholder="请选择支付配置类型" clearable>
          <el-option
              v-for="dict in pay_config_type.filter(it=>it.value.startsWith(queryParams.payMerchantType))"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="支付主商户号" label-width="auto" prop="merchantNumber">
        <el-input
            v-model="queryParams.merchantNumber"
            placeholder="请输入支付主商户号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="三方应用id" label-width="auto" prop="thirdAppId">
        <el-input
            v-model="queryParams.thirdAppId"
            placeholder="请输入三方应用id"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否禁用" prop="disableFlag">
        <el-select v-model="queryParams.disableFlag" placeholder="请选择是否禁用" clearable>
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
            v-hasPermi="['pay:payConfig:add']"
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
            v-hasPermi="['pay:payConfig:edit']"
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
            v-hasPermi="['pay:payConfig:remove']"
        >删除
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table ref="mainTable" v-loading="loading" :data="payConfigList"
              @expand-change="expandChange" :row-key="getRowKeys" :expand-row-keys="expands">
      <el-table-column type="expand" align="center">
        <template #default="scope" v-loading="loadingSubMerchant">
          <el-card style="margin-left: 30px;margin-right: 30px">
            <el-container>
              <el-aside width="500px" style="background: #00000000">
                <el-card>
                  <el-descriptions border :column="1" title="支付配置参数">
                    <el-descriptions-item align="center" :label="getParamsName(key)" v-for="(value,key) in scope.row.payConfigParams">
                      {{ value }}
                    </el-descriptions-item>
                  </el-descriptions>
                </el-card>
              </el-aside>
              <el-main>
                <el-row :gutter="10" class="mb8">
                  <el-col :span="1.5">
                    <el-button
                        type="primary"
                        plain
                        icon="Plus"
                        @click="handleAddSubMerchant(scope.row)"
                        v-hasPermi="['pay:payConfig:add']"
                    >新增子商户
                    </el-button>
                  </el-col>
                </el-row>
                <el-empty v-if="scope.row.subMerchantList == null || scope.row.subMerchantList.length == 0"
                          description="暂无子商户"/>
                <div v-else style="height: 300px;overflow-y: scroll">
                  <el-card style="margin-top: 20px" v-for="item in scope.row.subMerchantList">
                    <el-descriptions border :column="1" :title="item.merchantName">
                      <template #extra>
                        <el-button type="success" @click="handleEditSubMerchant(item)">修改子商户
                        </el-button>
                        <el-button type="danger" @click="handleDeleteSubMerchant(item)">删除子商户
                        </el-button>
                      </template>
                      <el-descriptions-item align="center" label="子商户号">
                        {{ item.merchantNumber }}
                      </el-descriptions-item>
                      <el-descriptions-item align="center" label="主商户抽成比例(%)">
                        {{ item.percentage }}
                      </el-descriptions-item>
                      <el-descriptions-item label="状态" align="center">
                        <el-switch
                            v-model="item.disableFlag"
                            active-value="0"
                            inactive-value="1"
                            @change="handleStatusChangeSubMerchant(item)"
                        ></el-switch>
                      </el-descriptions-item>
                    </el-descriptions>
                  </el-card>
                </div>
              </el-main>
            </el-container>
          </el-card>
        </template>
      </el-table-column>
      <el-table-column label="支付配置主键" align="center" prop="id" show-overflow-tooltip/>
      <el-table-column label="支付配置名称" align="center" prop="payConfigName"/>
      <el-table-column label="支付商户类型" align="center" prop="payMerchantType">
        <template #default="scope">
          <dict-tag :options="pay_merchant_type" :value="scope.row.payMerchantType"/>
        </template>
      </el-table-column>
      <el-table-column label="支付配置类型" align="center" prop="payConfigType">
        <template #default="scope">
          <dict-tag :options="pay_config_type" :value="scope.row.payConfigType"/>
        </template>
      </el-table-column>
      <el-table-column label="支付主商户号" align="center" prop="merchantNumber"/>
      <el-table-column label="三方应用id" align="center" prop="thirdAppId"/>
      <!--      <el-table-column label="支付配置参数" align="center" width="500" prop="wxMerchantSerialNumber">-->
      <!--        <template #default="scope">-->
      <!--          <el-card shadow="hover">-->
      <!--            <el-descriptions border-->
      <!--                             :column="1">-->
      <!--              <el-descriptions-item align="center" :label="key"-->
      <!--                                    v-for="(value,key) in scope.row.payConfigParams">-->
      <!--                {{ value }}-->
      <!--              </el-descriptions-item>-->
      <!--            </el-descriptions>-->
      <!--          </el-card>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
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
              v-hasPermi="['pay:payConfig:edit']"
          >修改
          </el-button>
          <el-button
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['pay:payConfig:remove']"
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

    <!-- 支付配置 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="payConfigRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="支付配置名称" label-width="auto" prop="payConfigName">
          <el-input v-model="form.payConfigName" placeholder="请输入支付配置名称"/>
        </el-form-item>
        <el-form-item label="支付商户类型" label-width="auto">
          <el-select @change="form.payConfigType = null" v-model="form.payMerchantType" filterable
                     placeholder="请选择支付商户类型">
            <el-option
                v-for="config in pay_merchant_type"
                :key="config.value"
                :label="config.label"
                :value="config.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付配置类型" label-width="auto">
          <el-select v-model="form.payConfigType" filterable placeholder="请选择支付配置类型">
            <el-option
                v-for="config in pay_config_type.filter(it=>it.value.startsWith(form.payMerchantType))"
                :key="config.value"
                :label="config.label"
                :value="config.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三方AppId" label-width="auto" prop="thirdAppId">
          <el-input v-model="form.thirdAppId" placeholder="请输入三方AppId"/>
        </el-form-item>
        <el-form-item label="支付主商户号" prop="merchantNumber">
          <el-input v-model="form.merchantNumber" placeholder="请输入支付主商户号"/>
        </el-form-item>
        <!--        微信所需参数     -->
        <el-form-item label="微信商户证书序列号" label-width="auto" prop="wxMerchantSerialNumber" v-if="showItem(wx)">
          <el-input v-model="form.wxMerchantSerialNumber" placeholder="请输入微信商户证书序列号"/>
        </el-form-item>
        <el-form-item label="微信apiV3Key" label-width="auto" prop="wxApiV3Key" v-if="showItem(wx)">
          <el-input v-model="form.wxApiV3Key" placeholder="请输入微信apiV3Key"/>
        </el-form-item>
        <el-form-item label="微信privateKey" label-width="auto" prop="wxPrivateKey" v-if="showItem(wx)">
          <el-input type="textarea" v-model="form.wxPrivateKey" placeholder="请输入微信privateKey"/>
        </el-form-item>
        <!--        支付宝所需参数     -->
        <!--        银联所需参数     -->
        <el-form-item label="银联商务AppId" label-width="auto" prop="unionUmsAppId" v-if="showItem(unionUms)">
          <el-input v-model="form.unionUmsAppId" placeholder="请输入银联商务AppId"/>
        </el-form-item>
        <el-form-item label="银联商务AppKey" label-width="auto" prop="unionUmsAppKey" v-if="showItem(unionUms)">
          <el-input v-model="form.unionUmsAppKey" placeholder="请输入银联商务AppKey"/>
        </el-form-item>
        <el-form-item label="银联商务appSecret" label-width="auto" prop="unionUmsAppSecret" v-if="showItem(unionUms)">
          <el-input v-model="form.unionUmsAppSecret" placeholder="请输入银联商务appSecret"/>
        </el-form-item>
        <el-form-item label="银联商务终端号" label-width="auto" prop="unionUmsTid" v-if="showItem(unionUms)">
          <el-input v-model="form.unionUmsTid" placeholder="请输入银联商务终端号"/>
        </el-form-item>
        <el-form-item label="银联商务商户前缀" label-width="auto" prop="unionUmsMerchantPrefix"
                      v-if="showItem(unionUms)">
          <el-input v-model="form.unionUmsMerchantPrefix" placeholder="请输入银联商务商户前缀"/>
        </el-form-item>
        <el-form-item label="是否禁用" label-width="auto">
          <el-radio-group v-model="form.disableFlag">
            <el-radio
                v-for="dict in sys_yes_no"
                :key="dict.value"
                :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加或修改子商户对话框 -->
    <el-dialog :title="titleSubMerchant" v-model="openSubMerchant" width="500px" append-to-body>
      <el-form ref="paySubMerchantRef" :model="formSubMerchant" :rules="rulesSubMerchant" label-width="80px">
        <el-form-item label="主商户配置" label-width="auto" prop="payConfigName">
          <el-input disabled v-model="formSubMerchant.payConfigName"/>
        </el-form-item>
        <el-form-item label="子商户名称" label-width="auto" prop="merchantName">
          <el-input v-model="formSubMerchant.merchantName" placeholder="请输入子商户名称"/>
        </el-form-item>
        <el-form-item label="子商户号" label-width="auto" prop="merchantNumber">
          <el-input v-model="formSubMerchant.merchantNumber" placeholder="请输入子商户号"/>
        </el-form-item>
        <el-form-item label="主商户抽成比例" label-width="auto" prop="percentage">
          <el-input v-model="formSubMerchant.percentage" placeholder="请输入主商户抽成比例"/>
        </el-form-item>
        <el-form-item label="是否禁用" label-width="auto" prop="disableFlag">
          <el-radio-group v-model="formSubMerchant.disableFlag">
            <el-radio
                v-for="dict in sys_yes_no"
                :key="dict.value"
                :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" label-width="auto" prop="remark">
          <el-input v-model="formSubMerchant.remark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFormSubMerchant">确 定</el-button>
          <el-button @click="cancelSubMerchant">取 消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="PayConfig">
import {
  addPayConfigRequest,
  deletePayConfigRequest,
  disablePayConfigRequest,
  editPayConfigRequest,
  getPayConfigListRequest,
  getPayConfigRequest
} from "@/api/pay/payConfig";
import {
  addPaySubMerchantRequest,
  deletePaySubMerchantRequest,
  disablePaySubMerchantRequest,
  editPaySubMerchantRequest,
  getPaySubMerchantListRequest,
  getPaySubMerchantRequest
} from "@/api/pay/paySubMerchant";
import {reactive} from "@vue/reactivity";
import {ref} from "vue";

const {proxy} = getCurrentInstance();
const {
  pay_config_type,
  pay_merchant_type,
  sys_yes_no
} = proxy.useDict('pay_config_type', 'pay_merchant_type', 'sys_yes_no');

const payConfigList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const titleSubMerchant = ref("");
const openSubMerchant = ref(false);
const loadingSubMerchant = ref(false);

// 支付商户类型
const wx = "wx"
const ali = "ali"
const unionUms = "union_ums"

// //支付配置类型
// const wxApp = "wx_app"
// const wxApplet = "wx_applet"
// const wxPC = "wx_pc"
// const wxH5 = "wx_h5"
// const aliApp = "ali_app"
// const aliApplet = "ali_applet"
// const aliPC = "ali_pc"
// const aliWap = "ali_wap"
// const unionUmsWxApp = "union_ums_wx_app"
// const unionUmsAliApp = "union_ums_ali_app"
// const unionUmsWxApplet = "union_ums_wx_applet"
// const unionUmsAliApplet = "union_ums_ali_applet"

const data = reactive({
  expands: [],
  getRowKeys: (expandedRows) => {
    return expandedRows.id
  },
  form: {},
  formSubMerchant: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    payConfigName: null,
    payMerchantType: null,
    payConfigType: null,
    merchantNumber: null,
    thirdAppId: null,
    disableFlag: null,
  },
  rules: {
    payConfigName: [
      {required: true, message: "支付配置名称不能为空", trigger: "blur"}
    ],
    payMerchantType: [
      {required: true, message: "支付商户类型不能为空", trigger: "blur"}
    ],
    payConfigType: [
      {required: true, message: "支付配置类型不能为空", trigger: "blur"}
    ],
    merchantNumber: [
      {required: true, message: "支付主商户号不能为空", trigger: "blur"}
    ],
    thirdAppId: [
      {required: true, message: "三方AppId不能为空", trigger: "blur"}
    ],
    wxMerchantSerialNumber: [
      {required: true, message: "微信商户证书序列号不能为空", trigger: "blur"}
    ],
    wxApiV3Key: [
      {required: true, message: "微信apiV3Key不能为空", trigger: "blur"}
    ],
    wxPrivateKey: [
      {required: true, message: "微信privateKey不能为空", trigger: "blur"}
    ],
    unionUmsAppId: [
      {required: true, message: "银联商务AppId不能为空", trigger: "blur"}
    ],
    unionUmsAppKey: [
      {required: true, message: "银联商务AppKey不能为空", trigger: "blur"}
    ],
    unionUmsAppSecret: [
      {required: true, message: "银联商务appSecret不能为空", trigger: "blur"}
    ],
    unionUmsTid: [
      {required: true, message: "银联商务终端号不能为空", trigger: "blur"}
    ],
    unionUmsMerchantPrefix: [
      {required: true, message: "银联商务商户前缀不能为空", trigger: "blur"}
    ],
    disableFlag: [
      {required: true, message: "是否禁用不能为空", trigger: "blur"}
    ],
  },
  rulesSubMerchant: {
    payConfigId: [
      {required: true, message: "主商户配置id不能为空", trigger: "blur"}
    ],
    merchantName: [
      {required: true, message: "子商户名称不能为空", trigger: "blur"}
    ],
    merchantNumber: [
      {required: true, message: "子商户号不能为空", trigger: "blur"}
    ],
    percentage: [
      {required: true, message: "主商户抽成比例不能为空", trigger: "blur"}
    ],
    disableFlag: [
      {required: true, message: "是否禁用不能为空", trigger: "change"}
    ],
  },
});
const {expands, getRowKeys, queryParams, form, formSubMerchant, rules, rulesSubMerchant} = toRefs(data);


function showItem(payMerchantType) {
  return form.value.payMerchantType == payMerchantType;
}

function getParamsName(params) {
  let paramsName;
  switch (params) {
    case 'wxAppId':
      paramsName = '微信AppId';
      break;
    case 'wxMerchantId':
      paramsName = '微信商户号';
      break;
    case 'wxMerchantSerialNumber':
      paramsName = '微信商户证书序列号';
      break;
    case 'wxApiV3Key':
      paramsName = '微信apiV3Key';
      break;
    case 'wxPrivateKey':
      paramsName = '微信privateKey';
      break;
    case 'unionUmsAppId':
      paramsName = '银联商务AppId';
      break;
    case 'unionUmsMerchantNumber':
      paramsName = '银联商务商户号';
      break;
    case 'unionUmsAppKey':
      paramsName = '银联商务AppKey';
      break;
    case 'unionUmsAppSecret':
      paramsName = '银联商务AppSecret';
      break;
    case 'unionUmsTid':
      paramsName = '银联商务终端号';
      break;
    case 'unionUmsMerchantPrefix':
      paramsName = '银联商务商户前缀';
      break;
  }
  return paramsName;
}

/** 查询支付配置列表 */
async function getList() {
  loading.value = true;
  let response = await getPayConfigListRequest(queryParams.value)
  response.data.list.forEach(item => {
    item.payConfigParams = JSON.parse(item.payConfigParams)
  })
  payConfigList.value = response.data.list;
  total.value = response.data.total;
  loading.value = false;
}

async function expandChange(expandedRows, rowList) {
  //展开
  if (rowList.indexOf(expandedRows) != -1) {
    await getSubMerchantList(expandedRows)
  }
}

async function getSubMerchantList(row) {
  loadingSubMerchant.value = true;
  let response = await getPaySubMerchantListRequest({payConfigId: row.id})
  row.subMerchantList = response.data;
  loadingSubMerchant.value = false;
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
    payMerchantType: null,
    payConfigType: null,
    merchantNumber: null,
    thirdAppId: null,
    productName: null,
    payConfigParams: null,
    //微信所需参数
    wxMerchantSerialNumber: null,//微信商户证书序列号
    wxApiV3Key: null,//微信apiV3Key
    wxPrivateKey: null,//微信privateKey
    //TODO 支付宝所需参数
    //银联商务所需参数
    unionUmsAppId: null,//银联商务AppId
    unionUmsAppKey: null,//银联商务AppKey
    unionUmsAppSecret: null,//银联商务appSecret
    unionUmsTid: null,//银联商务终端号
    unionUmsMerchantPrefix: null,//银联商务商户前缀
    disableFlag: '0',
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
  let response = await getPayConfigRequest(id);
  form.value = response.data;
  form.value.thirdAppId = response.data.thirdAppId;
  form.value.merchantNumber = response.data.merchantNumber;
  form.value.disableFlag = response.data.disableFlag;
  let payConfigParams = JSON.parse(response.data.payConfigParams);
  switch (form.value.payMerchantType) {
    case wx:
      form.value.wxMerchantSerialNumber = payConfigParams.wxMerchantSerialNumber;
      form.value.wxApiV3Key = payConfigParams.wxApiV3Key;
      form.value.wxPrivateKey = payConfigParams.wxPrivateKey;
      break;
    case ali:
      break;
    case unionUms:
      form.value.unionUmsAppId = payConfigParams.unionUmsAppId;
      form.value.unionUmsAppKey = payConfigParams.unionUmsAppKey;
      form.value.unionUmsAppSecret = payConfigParams.unionUmsAppSecret;
      form.value.unionUmsTid = payConfigParams.unionUmsTid;
      form.value.unionUmsMerchantPrefix = payConfigParams.unionUmsMerchantPrefix;
      break;
  }
  open.value = true;
  title.value = "修改支付配置";
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["payConfigRef"].validate(async valid => {
    if (valid) {
      switch (form.value.payMerchantType) {
        case wx:
          let wxParams = {
            "wxAppId": form.value.thirdAppId,
            "wxMerchantId": form.value.merchantNumber,
            "wxMerchantSerialNumber": form.value.wxMerchantSerialNumber,
            "wxApiV3Key": form.value.wxApiV3Key,
            "wxPrivateKey": form.value.wxPrivateKey
          }
          form.value.payConfigParams = JSON.stringify(wxParams);
          break;
        case ali:
          break;
        case unionUms:
          let unionUmsParams = {
            "unionUmsAppId": form.value.unionUmsAppId,
            "unionUmsAppKey": form.value.unionUmsAppKey,
            "unionUmsAppSecret": form.value.unionUmsAppSecret,
            "unionUmsMerchantNumber": form.value.merchantNumber,
            "unionUmsTid": form.value.unionUmsTid,
            "unionUmsMerchantPrefix": form.value.unionUmsMerchantPrefix
          }
          form.value.payConfigParams = JSON.stringify(unionUmsParams);
          break;
      }
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
    await deletePayConfigRequest(idList);
    await getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 状态修改  */
function handleStatusChange(row) {
  let text = row.disableFlag == "0" ? "启用" : "停用";
  proxy.$modal.confirm('确认要"' + text + '"编号为【' + row.id + '】的项吗?').then(function () {
    return disablePayConfigRequest({
      id: row.id,
      disableFlag: row.disableFlag,
    })
  }).then(() => {
    proxy.$modal.msgSuccess(text + "成功");
  }).catch(function () {
    row.disableFlag = row.disableFlag == "0" ? "1" : "0";
  });
}


// 取消按钮
function cancelSubMerchant() {
  openSubMerchant.value = false;
  resetSubMerchant();
}

// 表单重置
function resetSubMerchant() {
  formSubMerchant.value = {
    id: null,
    payConfigId: null,
    merchantName: null,
    merchantNumber: null,
    percentage: null,
    disableFlag: '0',
    remark: null
  };
  proxy.resetForm("paySubMerchantRef");
}


/** 新增按钮操作 */
function handleAddSubMerchant(row) {
  resetSubMerchant();
  formSubMerchant.value.payConfigId = row.id;
  formSubMerchant.value.payConfigName = row.payConfigName;
  openSubMerchant.value = true;
  titleSubMerchant.value = "添加子商户";
}

/** 修改按钮操作 */
async function handleEditSubMerchant(row) {
  resetSubMerchant();
  const id = row.id || ids.value[0]
  let response = await getPaySubMerchantRequest(id);
  formSubMerchant.value = response.data;
  formSubMerchant.value.payConfigId = row.id;
  formSubMerchant.value.payConfigName = row.payConfigName;
  openSubMerchant.value = true;
  titleSubMerchant.value = "修改子商户";
}

/** 提交按钮 */
function submitFormSubMerchant() {
  proxy.$refs["paySubMerchantRef"].validate(async valid => {
    if (valid) {
      if (formSubMerchant.value.id != null) {
        await editPaySubMerchantRequest(formSubMerchant.value);
        proxy.$modal.msgSuccess("修改成功");
        openSubMerchant.value = false;
        let payConfig = payConfigList.value.find(it => it.id == formSubMerchant.value.payConfigId);
        await getSubMerchantList(payConfig);
      } else {
        await addPaySubMerchantRequest(formSubMerchant.value);
        proxy.$modal.msgSuccess("新增成功");
        openSubMerchant.value = false;
        let payConfig = payConfigList.value.find(it => it.id == formSubMerchant.value.payConfigId);
        await getSubMerchantList(payConfig);
      }
    }
  });
}

/** 删除按钮操作 */
function handleDeleteSubMerchant(row) {
  const idList = row.id ? [row.id] : ids.value;
  proxy.$modal.confirm('是否确认删除子商户编号为"' + idList + '"的数据项？').then(async () => {
    await deletePaySubMerchantRequest(idList);
    let payConfig = payConfigList.value.find(it => it.id == row.payConfigId);
    await getSubMerchantList(payConfig);
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 状态修改  */
function handleStatusChangeSubMerchant(row) {
  let text = row.disableFlag == "0" ? "启用" : "停用";
  proxy.$modal.confirm('确认要"' + text + '"编号为【' + row.id + '】的项吗?').then(function () {
    return disablePaySubMerchantRequest({
      id: row.id,
      disableFlag: row.disableFlag,
    })
  }).then(() => {
    proxy.$modal.msgSuccess(text + "成功");
  }).catch(function () {
    row.disableFlag = row.disableFlag == "0" ? "1" : "0";
  });
}


getList();
</script>
