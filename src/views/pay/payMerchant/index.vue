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
        >新增</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table ref="mainTable" v-loading="loading" :data="payMerchantList">
      <el-table-column label="主键" align="center" prop="id" show-overflow-tooltip />
      <el-table-column label="支付渠道" align="center" prop="merchantPayChannel">
        <template #default="scope">
          <dict-tag :options="pay_channel" :value="scope.row.merchantPayChannel"/>
        </template>
      </el-table-column>
      <el-table-column label="商户名称" align="center" prop="merchantName" />
      <el-table-column label="商户号" align="center" prop="merchantNumber" />
      <el-table-column label="主商户号" align="center" prop="parentMerchantNumber" />
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleEdit(scope.row)"
            v-hasPermi="['pay:payMerchant:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['pay:payMerchant:remove']"
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
          <el-input v-model="form.merchantName" placeholder="请输入商户名称" />
        </el-form-item>
        <el-form-item label="商户号" prop="merchantNumber">
          <el-input v-model="form.merchantNumber" placeholder="请输入商户号" />
        </el-form-item>
        <el-form-item label="主商户号" prop="parentMerchantNumber">
          <el-input v-model="form.parentMerchantNumber" placeholder="请输入主商户号（如果是主商户，则为自身商户号）" />
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

<script setup name="PayMerchant">
import {
  getPayMerchantListRequest,
  getPayMerchantDetailsRequest,
  addPayMerchantRequest,
  editPayMerchantRequest,
  deletePayMerchantByIdsRequest,
  disablePayMerchantRequest
} from "@/api/pay/payMerchant";

    const { proxy } = getCurrentInstance();
const { pay_channel } = proxy.useDict('pay_channel');

const payMerchantList = ref([]);
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
    merchantPayChannel: null,
    merchantName: null,
  },
  rules: {
    merchantPayChannel: [
      { required: true, message: "商户支付渠道不能为空", trigger: "change" }
    ],
    merchantName: [
      { required: true, message: "商户名称不能为空", trigger: "blur" }
    ],
    merchantNumber: [
      { required: true, message: "商户号不能为空", trigger: "blur" }
    ],
    // parentMerchantNumber: [
    //   { required: true, message: "主商户号（如果是主商户，则为自身商户号）不能为空", trigger: "blur" }
    // ],
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
  const id = row.id || ids.value[0]
  let response = await getPayMerchantDetailsRequest(id);
  form.value = response.data;
  open.value = true;
  title.value = "修改支付商户";
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["payMerchantRef"].validate(async valid => {
    if (valid) {
      if (!form.value.parentMerchantNumber){
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
  const idList = row.id ? [row.id] : ids.value;
  proxy.$modal.confirm('是否确认删除支付商户编号为"' + idList + '"的数据项？').then(async () => {
    await deletePayMerchantByIdsRequest(idList);
    await getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('pay/payMerchant/export', {
    ...queryParams.value
  }, `payMerchant_${new Date().getTime()}.xlsx`)
}

getList();
</script>
