<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="产品名称" prop="productName">
        <el-input
            v-model="queryParams.productName"
            placeholder="请输入产品名称"
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
            v-hasPermi="['pay:payProduct:add']"
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
            v-hasPermi="['pay:payProduct:edit']"
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
            v-hasPermi="['pay:payProduct:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['pay:payProduct:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table ref="mainTable" v-loading="loading" :data="payProductList">
      <!--      <el-table-column label="主键id" align="center" prop="id" show-overflow-tooltip/>-->
      <el-table-column label="产品名称" align="center" prop="productName"/>
      <el-table-column label="支付结果回调地址" align="center" prop="payNotifyAddress" show-overflow-tooltip/>
      <el-table-column label="退款结果回调地址" align="center" prop="refundNotifyAddress" show-overflow-tooltip/>
      <el-table-column label="支付宝渠道" align="center" prop="aliPay">
        <el-table-column label="支付宝App" align="center" prop="aliAppPayConfigId">
          <template #default="scope">
            <el-icon size="40" :color="scope.row.aliAppPayConfig?.id ? 'limegreen' : 'darkgray'"
                     @click="handleBindConfig(ali,aliApp,scope.row.aliAppPayConfig,scope.row)">
              <CircleCheckFilled class="payEnableConfigIcon"
                                 v-if="scope.row.aliAppPayConfig?.id && scope.row.aliAppPayConfig?.disableFlag == 0"/>
              <CircleCloseFilled class="payDisableConfigIcon"
                                 v-else-if="scope.row.aliAppPayConfig?.id && scope.row.aliAppPayConfig?.disableFlag == 1"/>
              <CirclePlusFilled class="payAddConfigIcon" v-else/>
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column label="支付宝小程序" align="center" prop="aliAppletPayConfigId">
          <template #default="scope">
            <el-icon size="40" :color="scope.row.aliAppletPayConfig?.id ? 'limegreen' : 'darkgray'"
                     @click="handleBindConfig(ali,aliApplet,scope.row.aliAppletPayConfig,scope.row)">
              <CircleCheckFilled class="payEnableConfigIcon"
                                 v-if="scope.row.aliAppletPayConfig?.id && scope.row.aliAppletPayConfig?.disableFlag == 0"/>
              <CircleCloseFilled class="payDisableConfigIcon"
                                 v-else-if="scope.row.aliAppletPayConfig?.id && scope.row.aliAppletPayConfig?.disableFlag == 1"/>
              <CirclePlusFilled class="payAddConfigIcon" v-else/>
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column label="支付宝PC网页" align="center" prop="aliPcPayConfigId">
          <template #default="scope">
            <el-icon size="40" :color="scope.row.aliPCPayConfig?.id ? 'limegreen' : 'darkgray'"
                     @click="handleBindConfig(ali,aliPC,scope.row.aliPCPayConfig,scope.row)">
              <CircleCheckFilled class="payEnableConfigIcon"
                                 v-if="scope.row.aliPCPayConfig?.id && scope.row.aliPCPayConfig?.disableFlag == 0"/>
              <CircleCloseFilled class="payDisableConfigIcon"
                                 v-else-if="scope.row.aliPCPayConfig?.id && scope.row.aliPCPayConfig?.disableFlag == 1"/>
              <CirclePlusFilled class="payAddConfigIcon" v-else/>
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column label="支付宝WAP网页" align="center" prop="aliWapPayConfigId">
          <template #default="scope">
            <el-icon size="40" :color="scope.row.aliWapPayConfig?.id ? 'limegreen' : 'darkgray'"
                     @click="handleBindConfig(ali,aliWap,scope.row.aliWapPayConfig,scope.row)">
              <CircleCheckFilled class="payEnableConfigIcon"
                                 v-if="scope.row.aliWapPayConfig?.id && scope.row.aliWapPayConfig?.disableFlag == 0"/>
              <CircleCloseFilled class="payDisableConfigIcon"
                                 v-else-if="scope.row.aliWapPayConfig?.id && scope.row.aliWapPayConfig?.disableFlag == 1"/>
              <CirclePlusFilled class="payAddConfigIcon" v-else/>
            </el-icon>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="微信渠道" align="center" prop="wxPay">
        <el-table-column label="微信App" align="center" prop="wxAppPayConfigId">
          <template #default="scope">
            <el-icon size="40" :color="scope.row.wxAppPayConfig?.id ? 'limegreen' : 'darkgray'"
                     @click="handleBindConfig(wx,wxApp,scope.row.wxAppPayConfig,scope.row)">
              <CircleCheckFilled class="payEnableConfigIcon"
                                 v-if="scope.row.wxAppPayConfig?.id && scope.row.wxAppPayConfig?.disableFlag == 0"/>
              <CircleCloseFilled class="payDisableConfigIcon"
                                 v-else-if="scope.row.wxAppPayConfig?.id && scope.row.wxAppPayConfig?.disableFlag == 1"/>
              <CirclePlusFilled class="payAddConfigIcon" v-else/>
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column label="微信小程序" align="center" prop="wxAppletPayConfigId">
          <template #default="scope">
            <el-icon size="40" :color="scope.row.wxAppletPayConfig?.id ? 'limegreen' : 'darkgray'"
                     @click="handleBindConfig(wx,wxApplet,scope.row.wxAppletPayConfig,scope.row)">
              <CircleCheckFilled class="payEnableConfigIcon"
                                 v-if="scope.row.wxAppletPayConfig?.id && scope.row.wxAppletPayConfig?.disableFlag == 0"/>
              <CircleCloseFilled class="payDisableConfigIcon"
                                 v-else-if="scope.row.wxAppletPayConfig?.id && scope.row.wxAppletPayConfig?.disableFlag == 1"/>
              <CirclePlusFilled class="payAddConfigIcon" v-else/>
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column label="微信PC网页" align="center" prop="wxPCPayConfigId">
          <template #default="scope">
            <el-icon size="40" :color="scope.row.wxPCPayConfig?.id ? 'limegreen' : 'darkgray'"
                     @click="handleBindConfig(wx,wxPC,scope.row.wxPCPayConfig,scope.row)">
              <CircleCheckFilled class="payEnableConfigIcon"
                                 v-if="scope.row.wxPCPayConfig?.id && scope.row.wxPCPayConfig?.disableFlag == 0"/>
              <CircleCloseFilled class="payDisableConfigIcon"
                                 v-else-if="scope.row.wxPCPayConfig?.id && scope.row.wxPCPayConfig?.disableFlag == 1"/>
              <CirclePlusFilled class="payAddConfigIcon" v-else/>
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column label="微信H5网页" align="center" prop="wxH5PayConfigId">
          <template #default="scope">
            <el-icon size="40" :color="scope.row.wxH5PayConfig?.id ? 'limegreen' : 'darkgray'"
                     @click="handleBindConfig(wx,wxH5,scope.row.wxH5PayConfig,scope.row)">
              <CircleCheckFilled class="payEnableConfigIcon"
                                 v-if="scope.row.wxH5PayConfig?.id && scope.row.wxH5PayConfig?.disableFlag == 0"/>
              <CircleCloseFilled class="payDisableConfigIcon"
                                 v-else-if="scope.row.wxH5PayConfig?.id && scope.row.wxH5PayConfig?.disableFlag == 1"/>
              <CirclePlusFilled class="payAddConfigIcon" v-else/>
            </el-icon>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="银联商务渠道" align="center" prop="wxPay">
        <el-table-column label="银联商务App" align="center" prop="wxAppPayConfigId">
          <template #default="scope">
            <el-icon size="40" :color="scope.row.unionUmsAppPayConfig?.id ? 'limegreen' : 'darkgray'"
                     @click="handleBindConfig(unionUms,unionUmsApp,scope.row.unionUmsAppPayConfig,scope.row)">
              <CircleCheckFilled class="payEnableConfigIcon"
                                 v-if="scope.row.unionUmsAppPayConfig?.id && scope.row.unionUmsAppPayConfig?.disableFlag == 0"/>
              <CircleCloseFilled class="payDisableConfigIcon"
                                 v-else-if="scope.row.unionUmsAppPayConfig?.id && scope.row.unionUmsAppPayConfig?.disableFlag == 1"/>
              <CirclePlusFilled class="payAddConfigIcon" v-else/>
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column label="银联商务小程序" align="center" prop="wxAppletPayConfigId">
          <template #default="scope">
            <el-icon size="40" :color="scope.row.unionUmsAppletPayConfig?.id ? 'limegreen' : 'darkgray'"
                     @click="handleBindConfig(unionUms,unionUmsApplet,scope.row.unionUmsAppletPayConfig,scope.row)">
              <CircleCheckFilled class="payEnableConfigIcon"
                                 v-if="scope.row.unionUmsAppletPayConfig?.id && scope.row.unionUmsAppletPayConfig?.disableFlag == 0"/>
              <CircleCloseFilled class="payDisableConfigIcon"
                                 v-else-if="scope.row.unionUmsAppletPayConfig?.id && scope.row.unionUmsAppletPayConfig?.disableFlag == 1"/>
              <CirclePlusFilled class="payAddConfigIcon" v-else/>
            </el-icon>
          </template>
        </el-table-column>
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
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="handleEdit(scope.row)"
              v-hasPermi="['pay:payProduct:edit']"
          >修改
          </el-button>
          <el-button
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['pay:payProduct:remove']"
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

    <!-- 添加或修改支付产品对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="payProductRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="产品名称" label-width="auto" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入产品名称"/>
        </el-form-item>
        <el-form-item label="支付结果回调地址" label-width="auto" prop="payNotifyAddress">
          <el-input v-model="form.payNotifyAddress" placeholder="支付结果回调地址"/>
        </el-form-item>
        <el-form-item label="退款结果回调地址" label-width="auto" prop="refundNotifyAddress">
          <el-input v-model="form.refundNotifyAddress" placeholder="退款结果回调地址"/>
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
        <el-form-item label="备注" label-width="auto" prop="remark">
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

    <!-- 绑定支付配置 -->
    <el-dialog :title="titleBind" v-model="openBind" width="500px" append-to-body>
      <el-form ref="payProductBindConfigRef" :model="formBind" :rules="rulesBind" label-width="110px">
        <el-form-item label="产品名称" label-width="auto" prop="productName">
          <el-input disabled v-model="formBind.productName" placeholder="请输入产品名称"/>
        </el-form-item>
        <el-form-item label="支付商户类型" label-width="auto">
          <el-select disabled v-model="formBind.payMerchantType" filterable placeholder="请选择支付商户类型">
            <el-option disabled
                       v-for="config in pay_merchant_type"
                       :key="config.value"
                       :label="config.label"
                       :value="config.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付配置类型" label-width="auto">
          <el-select disabled v-model="formBind.payConfigType" filterable placeholder="请选择支付配置类型">
            <el-option disabled
                       v-for="config in pay_config_type"
                       :key="config.value"
                       :label="config.label"
                       :value="config.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三方AppId" label-width="auto" prop="thirdAppId">
          <el-input v-model="formBind.thirdAppId" placeholder="请输入三方AppId"/>
        </el-form-item>
        <el-form-item label="支付主商户号" prop="merchantNumber">
          <el-input v-model="formBind.merchantNumber" placeholder="请输入支付主商户号"/>
        </el-form-item>
        <!--        微信所需参数     -->
        <el-form-item label="微信商户证书序列号" label-width="auto" prop="wxMerchantSerialNumber" v-if="showItem(wx)">
          <el-input v-model="formBind.wxMerchantSerialNumber" placeholder="请输入微信商户证书序列号"/>
        </el-form-item>
        <el-form-item label="微信apiV3Key" label-width="auto" prop="wxApiV3Key" v-if="showItem(wx)">
          <el-input v-model="formBind.wxApiV3Key" placeholder="请输入微信apiV3Key"/>
        </el-form-item>
        <el-form-item label="微信privateKey" label-width="auto" prop="wxPrivateKey" v-if="showItem(wx)">
          <el-input type="textarea" v-model="formBind.wxPrivateKey" placeholder="请输入微信privateKey"/>
        </el-form-item>
        <!--        支付宝所需参数     -->
        <!--        银联所需参数     -->
        <el-form-item label="银联商务AppId" label-width="auto" prop="unionUmsAppId" v-if="showItem(unionUms)">
          <el-input v-model="formBind.unionUmsAppId" placeholder="请输入银联商务AppId"/>
        </el-form-item>
        <el-form-item label="银联商务AppKey" label-width="auto" prop="unionUmsAppKey" v-if="showItem(unionUms)">
          <el-input v-model="formBind.unionUmsAppKey" placeholder="请输入银联商务AppKey"/>
        </el-form-item>
        <el-form-item label="银联商务appSecret" label-width="auto" prop="unionUmsAppSecret" v-if="showItem(unionUms)">
          <el-input v-model="formBind.unionUmsAppSecret" placeholder="请输入银联商务appSecret"/>
        </el-form-item>
        <el-form-item label="银联商务终端号" label-width="auto" prop="unionUmsTid" v-if="showItem(unionUms)">
          <el-input v-model="formBind.unionUmsTid" placeholder="请输入银联商务终端号"/>
        </el-form-item>
        <el-form-item label="银联商务商户前缀" label-width="auto" prop="unionUmsMerchantPrefix"
                      v-if="showItem(unionUms)">
          <el-input v-model="formBind.unionUmsMerchantPrefix" placeholder="请输入银联商务商户前缀"/>
        </el-form-item>
        <el-form-item label="是否禁用">
          <el-radio-group v-model="formBind.disableFlag">
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
          <el-button type="primary" @click="submitFormBind">确 定</el-button>
          <el-button @click="cancelBind">取 消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="PayProduct">
import {
  addPayProductRequest,
  deletePayProductByIdsRequest,
  disablePayProductRequest,
  editPayProductRequest,
  getPayProductDetailsRequest,
  getPayProductListRequest
} from "@/api/pay/payProduct";
import {
  addPayConfigRequest,
  editPayConfigRequest,
  getPayConfigDetailsRequest,
  getPayConfigListRequest
} from "@/api/pay/payConfig";

const {proxy} = getCurrentInstance();
const {sys_yes_no} = proxy.useDict('sys_yes_no');
const {pay_merchant_type} = proxy.useDict('pay_merchant_type');
const {pay_config_type} = proxy.useDict('pay_config_type');

const payProductList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");


const openBind = ref(false);
const titleBind = ref("");
const payConfigList = ref([]);

// 支付商户类型
const wx = "wx"
const ali = "ali"
const unionUms = "union_ums"

//支付配置类型
const wxApp = "wx_app"
const wxApplet = "wx_applet"
const wxPC = "wx_pc"
const wxH5 = "wx_h5"
const aliApp = "ali_app"
const aliApplet = "ali_applet"
const aliPC = "ali_pc"
const aliWap = "ali_wap"
const unionUmsApp = "union_ums_app"
const unionUmsApplet = "union_ums_applet"

const data = reactive({
  form: {},
  formBind: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    productName: null,
    disableFlag: null,
  },
  rules: {
    productName: [
      {required: true, message: "产品名称不能为空", trigger: "blur"}
    ],
    payNotifyAddress: [
      {required: true, message: "支付结果回调地址不能为空", trigger: "blur"}
    ],
    refundNotifyAddress: [
      {required: true, message: "退款结果回调地址不能为空", trigger: "blur"}
    ],
    disableFlag: [
      {required: true, message: "是否禁用不能为空", trigger: "blur"}
    ],
  },
  rulesBind: {
    payProductId: [
      {required: true, message: "产品id不能为空", trigger: "blur"}
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
});
const {queryParams, form, formBind, rules, rulesBind} = toRefs(data);

/** 查询支付产品列表 */
async function getList() {
  loading.value = true;
  let response = await getPayProductListRequest(queryParams.value)
  payProductList.value = response.data.list;
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
    productName: null,
    payNotifyAddress: null,
    refundNotifyAddress: null,
    disableFlag: "0",
    remark: null
  };
  proxy.resetForm("payProductRef");
}

// 绑定表单重置
function resetBind() {
  formBind.value = {
    id: null,
    payProductId: null,
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
  proxy.resetForm("payProductBindConfigRef");
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
  title.value = "添加支付产品";
}

/** 修改按钮操作 */
async function handleEdit(row) {
  reset();
  const id = row.id || ids.value[0]
  let response = await getPayProductDetailsRequest(id);
  form.value = response.data;
  open.value = true;
  title.value = "修改支付产品";
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["payProductRef"].validate(async valid => {
    if (valid) {
      if (form.value.id != null) {
        await editPayProductRequest(form.value);
        proxy.$modal.msgSuccess("修改成功");
        open.value = false;
        await getList();
      } else {
        await addPayProductRequest(form.value);
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
  proxy.$modal.confirm('是否确认删除支付产品编号为"' + idList + '"的数据项？').then(async () => {
    await deletePayProductByIdsRequest(idList);
    await getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 状态修改  */
function handleStatusChange(row) {
  let text = row.disableFlag == "0" ? "启用" : "停用";
  proxy.$modal.confirm('确认要"' + text + '"编号为【' + row.id + '】的项吗?').then(function () {
    return disablePayProductRequest({
      id: row.id,
      disableFlag: row.disableFlag,
    })
  }).then(() => {
    proxy.$modal.msgSuccess(text + "成功");
  }).catch(function () {
    row.disableFlag = row.disableFlag == "0" ? "1" : "0";
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('pay/payProduct/export', {
    ...queryParams.value
  }, `payProduct_${new Date().getTime()}.xlsx`)
}

function showItem(payMerchantType) {
  return formBind.value.payMerchantType == payMerchantType;
}

async function handleBindConfig(payMerchantType, payConfigType, payConfig, payProduct) {
  resetBind();
  formBind.value.id = payConfig?.id;
  formBind.value.payMerchantType = payMerchantType;
  formBind.value.payConfigType = payConfigType;
  formBind.value.payProductId = payProduct.id;
  if (payConfig?.id) {
    let response = await getPayConfigDetailsRequest(payConfig?.id);
    formBind.value.thirdAppId = response.data.thirdAppId;
    formBind.value.merchantNumber = response.data.merchantNumber;
    formBind.value.disableFlag = response.data.disableFlag;
    let payConfigParams = JSON.parse(response.data.payConfigParams);
    switch (formBind.value.payMerchantType) {
      case wx:
        formBind.value.wxMerchantSerialNumber = payConfigParams.wxMerchantSerialNumber;
        formBind.value.wxApiV3Key = payConfigParams.wxApiV3Key;
        formBind.value.wxPrivateKey = payConfigParams.wxPrivateKey;
        break;
      case ali:
        break;
      case unionUms:
        formBind.value.unionUmsAppId = payConfigParams.unionUmsAppId;
        formBind.value.unionUmsAppKey = payConfigParams.unionUmsAppKey;
        formBind.value.unionUmsAppSecret = payConfigParams.unionUmsAppSecret;
        formBind.value.unionUmsTid = payConfigParams.unionUmsTid;
        formBind.value.unionUmsMerchantPrefix = payConfigParams.unionUmsMerchantPrefix;
        break;
    }
  }
  formBind.value.productName = payProduct.productName;
  openBind.value = true;
  titleBind.value = "绑定支付配置";
}

async function getPayConfigListByAppId() {
  let response = await getPayConfigListRequest({thirdAppId: formBind.value.thirdAppId});
  payConfigList.value = response.data;
}

/** 提交按钮 */
function submitFormBind() {
  proxy.$refs["payProductBindConfigRef"].validate(async valid => {
    if (valid) {
      switch (formBind.value.payMerchantType) {
        case wx:
          let wxParams = {
            "wxAppId": formBind.value.thirdAppId,
            "wxMerchantId": formBind.value.merchantNumber,
            "wxMerchantSerialNumber": formBind.value.wxMerchantSerialNumber,
            "wxApiV3Key": formBind.value.wxApiV3Key,
            "wxPrivateKey": formBind.value.wxPrivateKey
          }
          formBind.value.payConfigParams = JSON.stringify(wxParams);
          break;
        case ali:
          break;
        case unionUms:
          let unionUmsParams = {
            "unionUmsAppId": formBind.value.unionUmsAppId,
            "unionUmsAppKey": formBind.value.unionUmsAppKey,
            "unionUmsAppSecret": formBind.value.unionUmsAppSecret,
            "unionUmsMerchantNumber": formBind.value.merchantNumber,
            "unionUmsTid": formBind.value.unionUmsTid,
            "unionUmsMerchantPrefix": formBind.value.unionUmsMerchantPrefix
          }
          formBind.value.payConfigParams = JSON.stringify(unionUmsParams);
          break;
      }
      if (formBind.value.id) {
        await editPayConfigRequest(formBind.value);
        proxy.$modal.msgSuccess("修改成功");
      } else {
        await addPayConfigRequest(formBind.value);
        proxy.$modal.msgSuccess("绑定成功");
      }
      openBind.value = false;
      await getList();
    }
  });
}

// 取消按钮
function cancelBind() {
  openBind.value = false;
  resetBind();
}

getList();
</script>

<style lang="scss" scoped>

.payAddConfigIcon {
  cursor: pointer;
  color: darkgray;

  :hover {
    color: deepskyblue;
  }
}

.payDisableConfigIcon {
  cursor: pointer;
  color: red;

  :hover {
    color: darkred;
  }
}

.payEnableConfigIcon {
  cursor: pointer;
  color: limegreen;

  :hover {
    color: darkgreen;
  }
}
</style>
