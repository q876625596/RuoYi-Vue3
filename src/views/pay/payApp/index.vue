<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="应用名称" prop="appName">
        <el-input
            v-model="queryParams.appName"
            placeholder="请输入应用名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="三方应用Id" prop="thirdAppId" label-width="150">
        <el-input
            v-model="queryParams.thirdAppId"
            placeholder="请输入三方应用Id"
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
            v-hasPermi="['pay:payApp:add']"
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
            v-hasPermi="['pay:payApp:edit']"
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
            v-hasPermi="['pay:payApp:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['pay:payApp:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table ref="mainTable" v-loading="loading" :data="payAppList">
      <el-table-column label="主键id" align="center" prop="id" show-overflow-tooltip/>
      <el-table-column label="应用名称" align="center" prop="appName"/>
      <el-table-column label="三方应用Id" align="center" prop="thirdAppId"/>
      <el-table-column label="默认支付配置" align="center" prop="defaultPayConfigName" min-width="200">
        <template #default="scope">
          <el-tag v-if="scope.row.defaultPayConfigId">{{ scope.row.defaultPayConfigName }}</el-tag>
          <div v-else>暂无</div>
        </template>
      </el-table-column>
      <el-table-column label="已绑支付配置" align="center" prop="payAppConfigRelList" min-width="200">
        <template #default="scope">
          <el-tag v-if="scope.row.payAppConfigRelList && scope.row.payAppConfigRelList.length>0" type="success"
                  style="margin-top: 5px;margin-right: 5px" v-for="item in scope.row.payAppConfigRelList">
            {{ item.payConfigName }}
          </el-tag>
          <div v-else>暂无</div>
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
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="handleBindConfig(scope.row)"
              v-hasPermi="['pay:payApp:edit']"
          >绑定支付配置
          </el-button>
          <el-button
              type="text"
              icon="Edit"
              @click="handleEdit(scope.row)"
              v-hasPermi="['pay:payApp:edit']"
          >修改
          </el-button>
          <el-button
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['pay:payApp:remove']"
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

    <!-- 添加或修改支付应用对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="payAppRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="应用名称" prop="appName">
          <el-input v-model="form.appName" placeholder="请输入应用名称"/>
        </el-form-item>
        <el-form-item label="三方应用Id" prop="thirdAppId">
          <el-input v-model="form.thirdAppId" placeholder="请输入三方应用Id"/>
        </el-form-item>
        <el-form-item label="是否禁用">
          <el-radio-group v-model="form.disableFlag">
            <el-radio
                v-for="dict in sys_yes_no"
                :key="dict.value"
                :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
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

    <!-- 绑定支付配置 -->
    <el-dialog :title="titleBind" v-model="openBind" width="500px" append-to-body>
      <el-form ref="payAppBindRef" :model="formBind" :rules="rulesBind" label-width="100px">
        <el-form-item label="应用名称" prop="appName">
          <el-input disabled v-model="formBind.appName" placeholder="请输入应用名称"/>
        </el-form-item>
        <el-form-item label="支付配置" prop="payConfigList">
          <el-select multiple v-model="formBind.payConfigIdList"
                     filterable placeholder="请选择所属支付配置"
                     @change="selectConfigChange">
            <el-option
                v-for="config in payConfigList"
                :key="config.id"
                :label="config.payConfigName"
                :value="config.id"
            ></el-option>

          </el-select>
        </el-form-item>
        <el-form-item label="默认支付配置" prop="defaultPayConfigId">
          <el-select v-model="formBind.defaultPayConfigId" filterable placeholder="请选择所属支付配置">
            <el-option
                v-for="config in payConfigList.filter(it=>formBind.payConfigIdList.indexOf(it.id) != -1)"
                :key="config.id"
                :label="config.payConfigName"
                :value="config.id"
            ></el-option>

          </el-select>
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

<script setup name="PayApp">
import {
  addPayAppRequest,
  bindPayAppConfigRequest,
  deletePayAppByIdsRequest,
  disablePayAppRequest,
  editPayAppRequest,
  getPayAppDetailsRequest,
  getPayAppListRequest
} from "@/api/pay/payApp";
import {getPayConfigListRequest} from "@/api/pay/payConfig";

const {proxy} = getCurrentInstance();
const {sys_yes_no} = proxy.useDict('sys_yes_no');

const payAppList = ref([]);
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


const data = reactive({
  form: {},
  formBind: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    appName: null,
    thirdAppId: null,
    disableFlag: null,
  },
  rules: {
    appName: [
      {required: true, message: "应用名称不能为空", trigger: "blur"}
    ],
    thirdAppId: [
      {required: true, message: "三方应用Id不能为空", trigger: "blur"}
    ],
    disableFlag: [
      {required: true, message: "是否禁用不能为空", trigger: "blur"}
    ],
  },
  rulesBind: {
    payAppId: [
      {required: true, message: "应用id不能为空", trigger: "blur"}
    ],
  },
});
const {queryParams, form, formBind, rules, rulesBind} = toRefs(data);

/** 查询支付应用列表 */
async function getList() {
  loading.value = true;
  let response = await getPayAppListRequest(queryParams.value)
  payAppList.value = response.data.list;
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
    appName: null,
    thirdAppId: null,
    disableFlag: "0",
    remark: null
  };
  proxy.resetForm("payAppRef");
}

// 绑定表单重置
function resetBind() {
  formBind.value = {
    payAppId: null,
    thirdAppId: null,
    appName: null,
    payConfigIdList: null,
    defaultPayConfigId: null,
  };
  proxy.resetForm("payAppBindRef");
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
  title.value = "添加支付应用";
}

/** 修改按钮操作 */
async function handleEdit(row) {
  reset();
  const id = row.id || ids.value[0]
  let response = await getPayAppDetailsRequest(id);
  form.value = response.data;
  open.value = true;
  title.value = "修改支付应用";
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["payAppRef"].validate(async valid => {
    if (valid) {
      if (form.value.id != null) {
        await editPayAppRequest(form.value);
        proxy.$modal.msgSuccess("修改成功");
        open.value = false;
        await getList();
      } else {
        await addPayAppRequest(form.value);
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
  proxy.$modal.confirm('是否确认删除支付应用编号为"' + idList + '"的数据项？').then(async () => {
    await deletePayAppByIdsRequest(idList);
    await getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 状态修改  */
function handleStatusChange(row) {
  let text = row.disableFlag == "0" ? "启用" : "停用";
  proxy.$modal.confirm('确认要"' + text + '"编号为【' + row.id + '】的项吗?').then(function () {
    return disablePayAppRequest({
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
  proxy.download('pay/payApp/export', {
    ...queryParams.value
  }, `payApp_${new Date().getTime()}.xlsx`)
}

async function handleBindConfig(row) {
  resetBind();
  const id = row.id || ids.value[0]
  let response = await getPayAppDetailsRequest(id);
  formBind.value.payAppId = id;
  formBind.value.thirdAppId = response.data.thirdAppId;
  formBind.value.defaultPayConfigId = response.data.defaultPayConfigId;
  formBind.value.appName = response.data.appName;
  await getPayConfigListByAppId();
  let selectConfigIdList = [];
  for (let configRel of response.data.payAppConfigRelList) {
    selectConfigIdList.push(configRel.payConfigId);
  }
  formBind.value.payConfigIdList = selectConfigIdList;
  openBind.value = true;
  titleBind.value = "绑定支付配置";
}

async function getPayConfigListByAppId() {
  let response = await getPayConfigListRequest({thirdAppId: formBind.value.thirdAppId});
  payConfigList.value = response.data;
}

/** 提交按钮 */
function submitFormBind() {
  proxy.$refs["payAppBindRef"].validate(async valid => {
    if (valid) {
      await bindPayAppConfigRequest(formBind.value);
      proxy.$modal.msgSuccess("绑定成功");
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

function selectConfigChange(val) {
  console.log(val);
  if (val.indexOf(formBind.value.defaultPayConfigId) == -1) {
    formBind.value.defaultPayConfigId = null;
  }
}

getList();
</script>
