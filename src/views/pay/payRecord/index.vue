<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商户号" label-width="auto" prop="merchantNumber">
        <el-input
            v-model="queryParams.merchantNumber"
            placeholder="请输入商户号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="原始商户订单号" label-width="auto" prop="originalMerPayOrderId">
        <el-input
            v-model="queryParams.originalMerPayOrderId"
            placeholder="请输入原始商户订单号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商户支付订单号" label-width="auto" prop="merPayOrderId">
        <el-input
            v-model="queryParams.merPayOrderId"
            placeholder="请输入商户支付订单号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="交易流水号" label-width="auto" prop="transactionId">
        <el-input
            v-model="queryParams.transactionId"
            placeholder="请输入交易流水号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="记录状态" label-width="auto" prop="recordStatus">
        <el-select v-model="queryParams.recordStatus" placeholder="请选择记录状态" clearable>
          <el-option
              v-for="dict in pay_record_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="支付商户类型" label-width="auto" prop="payMerchantType">
        <el-select v-model="queryParams.payMerchantType" placeholder="请选择支付商户类型" clearable>
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
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['pay:payRecord:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table ref="mainTable" v-loading="loading" :data="payRecordList">
      <el-table-column label="商户号" align="center" prop="merchantNumber"/>
      <!--      <el-table-column label="原始商户订单号" align="center" prop="originalMerPayOrderId" />-->
      <el-table-column label="商户支付订单号" align="center" prop="merPayOrderId"/>
      <el-table-column label="交易流水号" align="center" prop="transactionId"/>
      <el-table-column label="记录状态" align="center" prop="recordStatus">
        <template #default="scope">
          <dict-tag :options="pay_record_status" :value="scope.row.recordStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="订单总金额(元)" align="center" prop="transactionAmount"/>
      <el-table-column label="主商户金额(元)" align="center" prop="mainMerchantAmount"/>
      <el-table-column label="已退款金额(元)" align="center" prop="refundAmount">
        <template #default="scope">
          <el-button
              type="text"
              icon="View"
              @click="getRefundRecordList(scope.row)"
          >{{ scope.row.refundAmount ?? '0' }}
          </el-button>
        </template>
      </el-table-column>
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
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付完成时间" align="center" prop="completeTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.completeTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Document"
              @click="getDetails(scope.row)"
              v-hasPermi="['pay:payRecord:query']"
          >详情
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

    <el-drawer
        v-loading="loadingDetails"
        v-model="openDetailsDrawer"
        title="支付记录详情"
        size="40%"
        :direction="'rtl'"
        @close="closeDetailsDrawer"
    >
      <el-descriptions border :column="1">
        <el-descriptions-item align="center" label="主键">
          {{ currentPayRecordDetails.id }}
        </el-descriptions-item>
        <el-descriptions-item align="center" label="商户号">
          {{ currentPayRecordDetails.merchantNumber }}
        </el-descriptions-item>
        <el-descriptions-item align="center" label="原始商户订单号">
          {{ currentPayRecordDetails.originalMerPayOrderId }}
        </el-descriptions-item>
        <el-descriptions-item align="center" label="商户订单号">
          {{ currentPayRecordDetails.merPayOrderId }}
        </el-descriptions-item>
        <el-descriptions-item align="center" label="交易流水号">
          {{ currentPayRecordDetails.transactionId }}
        </el-descriptions-item>
        <el-descriptions-item align="center" label="交易状态">
          <dict-tag :options="pay_record_status" :value="currentPayRecordDetails.recordStatus"/>
        </el-descriptions-item>
        <el-descriptions-item align="center" label="支付金额(元)">
          {{ currentPayRecordDetails.transactionAmount }}
        </el-descriptions-item>
        <el-descriptions-item align="center" label="主商户收款金额(元)">
          {{ currentPayRecordDetails.mainMerchantAmount }}
        </el-descriptions-item>
        <el-descriptions-item align="center" label="已退款金额(元)">
          {{ currentPayRecordDetails.refundAmount }}
        </el-descriptions-item>
        <el-descriptions-item align="center" label="支付商户类型">
          <dict-tag :options="pay_merchant_type" :value="currentPayRecordDetails.payMerchantType"/>
        </el-descriptions-item>
        <el-descriptions-item align="center" label="支付配置类型">
          <dict-tag :options="pay_config_type" :value="currentPayRecordDetails.payConfigType"/>
        </el-descriptions-item>
        <el-descriptions-item align="center" label="三方appId">
          {{ currentPayRecordDetails.thirdAppId }}
        </el-descriptions-item>
        <el-descriptions-item align="center" label="创建时间">
          {{ currentPayRecordDetails.createTime }}
        </el-descriptions-item>
        <el-descriptions-item align="center" label="交易完成时间">
          {{ currentPayRecordDetails.completeTime }}
        </el-descriptions-item>
        <el-descriptions-item align="center" label="查询历史记录">
          {{ currentPayRecordDetails.payRecordExInfo.queryHistory ?? '暂无' }}
        </el-descriptions-item>
        <el-descriptions-item align="center" label="回调历史记录">
          {{ currentPayRecordDetails.payRecordExInfo.notifyHistory ?? '暂无' }}
        </el-descriptions-item>
        <el-descriptions-item align="center" label="请求地址">
          {{ currentPayRecordDetails.payRecordExInfo.requestUrl }}
        </el-descriptions-item>
        <el-descriptions-item align="center" label="回调地址">
          {{ currentPayRecordDetails.payRecordExInfo.notifyUrl ?? '暂无' }}
        </el-descriptions-item>
        <el-descriptions-item align="center" label="请求时间">
          {{ currentPayRecordDetails.requestTime }}
        </el-descriptions-item>
        <el-descriptions-item align="center" label="请求体">
          {{ currentPayRecordDetails.payRecordExInfo.requestBody ?? '暂无' }}
        </el-descriptions-item>
        <el-descriptions-item align="center" label="响应时间">
          {{ currentPayRecordDetails.responseTime }}
        </el-descriptions-item>
        <el-descriptions-item align="center" label="响应体">
          {{ currentPayRecordDetails.payRecordExInfo.responseBody ?? '暂无' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-drawer>

    <el-drawer
        v-loading="loadingDetails"
        v-model="openRefundRecordListDrawer"
        size="40%"
        :title="'退款记录：共【' + currentRefundRecordList.length +'】条'"
        :direction="'rtl'"
        @closed="closeRefundRecordListDrawer"
    >
      <el-card style="margin-bottom: 20px" v-for="(item,index) in currentRefundRecordList">
        <el-descriptions border :column="1" :title="'第【' +(index+1)+'】条退款'">
          <el-descriptions-item align="center" label="主键">
            {{ item.id }}
          </el-descriptions-item>
          <el-descriptions-item align="center" label="商户号">
            {{ item.merchantNumber }}
          </el-descriptions-item>
          <el-descriptions-item align="center" label="原始商户订单号">
            {{ item.originalMerPayOrderId }}
          </el-descriptions-item>
          <el-descriptions-item align="center" label="商户订单号">
            {{ item.merPayOrderId }}
          </el-descriptions-item>
          <el-descriptions-item align="center" label="交易流水号">
            {{ item.transactionId }}
          </el-descriptions-item>
          <el-descriptions-item align="center" label="原始商户退款订单号">
            {{ item.originalMerRefundOrderId }}
          </el-descriptions-item>
          <el-descriptions-item align="center" label="商户退款订单号">
            {{ item.merRefundOrderId }}
          </el-descriptions-item>
          <el-descriptions-item align="center" label="退款流水号">
            {{ item.refundId }}
          </el-descriptions-item>
          <el-descriptions-item align="center" label="退款状态">
            <dict-tag :options="pay_record_status" :value="item.recordStatus"/>
          </el-descriptions-item>
          <el-descriptions-item align="center" label="退款金额(元)">
            {{ item.transactionAmount }}
          </el-descriptions-item>
          <el-descriptions-item align="center" label="主商户退款金额(元)">
            {{ item.mainMerchantAmount }}
          </el-descriptions-item>
          <el-descriptions-item align="center" label="支付商户类型">
            <dict-tag :options="pay_merchant_type" :value="item.payMerchantType"/>
          </el-descriptions-item>
          <el-descriptions-item align="center" label="支付配置类型">
            <dict-tag :options="pay_config_type" :value="item.payConfigType"/>
          </el-descriptions-item>
          <el-descriptions-item align="center" label="三方appId">
            {{ item.thirdAppId }}
          </el-descriptions-item>
          <el-descriptions-item align="center" label="请求时间">
            {{ item.requestTime }}
          </el-descriptions-item>
          <el-descriptions-item align="center" label="响应时间">
            {{ item.responseTime }}
          </el-descriptions-item>
          <el-descriptions-item align="center" label="创建时间">
            {{ item.createTime }}
          </el-descriptions-item>
          <el-descriptions-item align="center" label="退款完成时间">
            {{ item.completeTime }}
          </el-descriptions-item>
          <el-descriptions-item align="center" label="查询历史记录">
            {{ item.refundRecordExInfo.queryHistory ?? '暂无' }}
          </el-descriptions-item>
          <el-descriptions-item align="center" label="回调历史记录">
            {{ item.refundRecordExInfo.notifyHistory ?? '暂无' }}
          </el-descriptions-item>
          <el-descriptions-item align="center" label="请求地址">
            {{ item.refundRecordExInfo.requestUrl }}
          </el-descriptions-item>
          <el-descriptions-item align="center" label="回调地址">
            {{ item.refundRecordExInfo.notifyUrl ?? '暂无' }}
          </el-descriptions-item>
          <el-descriptions-item align="center" label="请求体">
            {{ item.refundRecordExInfo.requestBody ?? '暂无' }}
          </el-descriptions-item>
          <el-descriptions-item align="center" label="响应体">
            {{ item.refundRecordExInfo.responseBody ?? '暂无' }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-drawer>
  </div>
</template>

<script setup name="PayRecord">
import {
  getPayRecordListRequest,
  getPayRecordRequest,
  getRefundRecordListByPayRecordIdRequest,
} from "@/api/pay/payRecord";
import {getCurrentInstance, ref, toRefs} from "vue";
import {reactive} from "@vue/reactivity";

const {proxy} = getCurrentInstance();
const {
  pay_config_type,
  pay_merchant_type,
  pay_record_status
} = proxy.useDict('pay_config_type', 'pay_merchant_type', 'pay_record_status');

const payRecordList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);

const openDetailsDrawer = ref(false)
const loadingDetails = ref(false);
const currentPayRecordDetails = ref(null);

const loadingRefundRecordList = ref(false);
const openRefundRecordListDrawer = ref(false)
const currentRefundRecordList = ref([]);


const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    merchantNumber: null,
    originalMerPayOrderId: null,
    merPayOrderId: null,
    transactionId: null,
    recordStatus: null,
    payMerchantType: null,
    payConfigType: null,
  },
});
const {queryParams} = toRefs(data);

/** 查询支付记录列表 */
async function getList() {
  loading.value = true;
  let response = await getPayRecordListRequest(queryParams.value)
  payRecordList.value = response.data.list;
  total.value = response.data.total;
  loading.value = false;
}

/** 查询支付记录详情 */
async function getDetails(row) {
  let payRecordResponse = await getPayRecordRequest(row.id);
  let payRecord = payRecordResponse.data;
  loadingDetails.value = true;
  let refundRecordListResponse = await getRefundRecordListByPayRecordIdRequest(row.id)
  payRecord.refundRecordList = refundRecordListResponse.data;
  currentPayRecordDetails.value = payRecord;
  loadingDetails.value = false;
  openDetailsDrawer.value = true;
}

function closeDetailsDrawer() {
  currentPayRecordDetails.value = null;
}

/** 查询退款记录列表 */
async function getRefundRecordList(row) {
  loadingRefundRecordList.value = true;
  let refundRecordListResponse = await getRefundRecordListByPayRecordIdRequest(row.id)
  currentRefundRecordList.value = refundRecordListResponse.data;
  loadingRefundRecordList.value = false;
  openRefundRecordListDrawer.value = true;
}

function closeRefundRecordListDrawer() {
  currentRefundRecordList.value = [];
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

/** 导出按钮操作 */
function handleExport() {
  proxy.download('management/payRecord/export', {
    ...queryParams.value
  }, `payRecord_${new Date().getTime()}.xlsx`)
}

getList();
</script>
