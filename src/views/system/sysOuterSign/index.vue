<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="外部签名名称" label-width="auto" prop="signName">
        <el-input
            v-model="queryParams.signName"
            placeholder="请输入外部签名名称"
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
            v-hasPermi="['system:sysOuterSign:add']"
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
            v-hasPermi="['system:sysOuterSign:edit']"
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
            v-hasPermi="['system:sysOuterSign:remove']"
        >删除
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table ref="mainTable" v-loading="loading" :data="sysOuterSignList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="外部签名名称" align="center" prop="signName"/>
      <el-table-column label="外部签名id" align="center" prop="signAppId"/>
      <el-table-column label="外部签名密钥" align="center" prop="signSecret"/>
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
      <el-table-column label="有效起始时间" align="center" prop="startValidTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startValidTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效结束时间" align="center" prop="endValidTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endValidTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="handleEdit(scope.row)"
              v-hasPermi="['system:sysOuterSign:edit']"
          >修改
          </el-button>
          <el-button
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:sysOuterSign:remove']"
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

    <!-- 添加或修改outerSign对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="sysOuterSignRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分配租户">
          <el-select v-model="form.tenantId" filterable placeholder="选择租户" clearable>
            <el-option
                v-for="tenant in tenantOptions"
                :key="tenant.tenantId"
                :label="tenant.tenantName"
                :value="tenant.tenantId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="外部签名名称" label-width="auto" prop="signName">
          <el-input v-model="form.signName" placeholder="请输入外部签名名称"/>
        </el-form-item>
        <el-form-item label="外部签名id" label-width="auto" prop="signAppId">
          <el-input v-model="form.signAppId" placeholder="请输入外部签名id"/>
        </el-form-item>
        <el-form-item label="外部签名密钥" label-width="auto" prop="signSecret">
          <el-input v-model="form.signSecret" placeholder="请输入外部签名密钥"/>
        </el-form-item>
        <el-form-item label="有效时间" label-width="auto" prop="dateRange">
          <el-date-picker clearable
                          v-model="form.dateRange"
                          value-format="YYYY-MM-DD HH:mm:ss"
                          type="datetimerange"
                          range-separator="-"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :default-time="[new Date(0,0,0,0,0,0),new Date(0,0,0,23,59,59)]"
          >
          </el-date-picker>
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

  </div>
</template>

<script setup name="SysOuterSign">
import {
  addSysOuterSignRequest,
  deleteSysOuterSignByIdsRequest,
  disableSysOuterSignRequest,
  editSysOuterSignRequest,
  getSysOuterSignDetailsRequest,
  getSysOuterSignListRequest
} from "@/api/system/sysOuterSign";
import {getAllSysTenantForSelectRequest} from "@/api/system/sysTenant";
import {parseTime} from "@/utils/ruoyi";
import {ref} from "@vue/reactivity";

const {proxy} = getCurrentInstance();
const {sys_yes_no} = proxy.useDict('sys_yes_no');

const sysOuterSignList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const tenantOptions = ref([]);


const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    signName: null,
    disableFlag: null,
  },
  rules: {
    tenantId: [
      {required: true, message: "分配的租户不能为空", trigger: "blur"}
    ],
    signName: [
      {required: true, message: "外部签名名称不能为空", trigger: "blur"}
    ],
    signAppId: [
      {required: true, message: "外部签名id不能为空", trigger: "blur"}
    ],
    signSecret: [
      {required: true, message: "外部签名密钥不能为空", trigger: "blur"}
    ],
    dateRange: [
      {
        required: true, type: "array", message: "有效时间不能为空", trigger: "blur"
      }
    ],
  },
});
const {queryParams, form, rules} = toRefs(data);

async function getTenantList() {
  let response = await getAllSysTenantForSelectRequest();
  tenantOptions.value = response.data;
}


/** 查询outerSign列表 */
async function getList() {
  loading.value = true;
  queryParams.value.aaa = {
    "cc": "cac",
    "dd": "ddd",
  }
  let response = await getSysOuterSignListRequest(queryParams.value)
  sysOuterSignList.value = response.data.list;
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
    tenantId: null,
    signName: null,
    signAppId: null,
    signSecret: null,
    remark: null,
    startValidTime: null,
    endValidTime: null,
    dateRange: []
  };
  proxy.resetForm("sysOuterSignRef");
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
  title.value = "添加outerSign";
}

/** 修改按钮操作 */
async function handleEdit(row) {
  reset();
  const id = row.id || ids.value[0]
  let response = await getSysOuterSignDetailsRequest(id);
  form.value = response.data;
  form.value.dateRange = [form.value.startValidTime, form.value.endValidTime]
  open.value = true;
  title.value = "修改outerSign";
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["sysOuterSignRef"].validate(async valid => {
    if (valid) {
      form.value.startValidTime = form.value.dateRange[0];
      form.value.endValidTime = form.value.dateRange[1];
      if (form.value.id != null) {
        await editSysOuterSignRequest(form.value);
        proxy.$modal.msgSuccess("修改成功");
        open.value = false;
        await getList();
      } else {
        await addSysOuterSignRequest(form.value);
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
  proxy.$modal.confirm('是否确认删除outerSign编号为"' + idList + '"的数据项？').then(async () => {
    await deleteSysOuterSignByIdsRequest(idList);
    await getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 状态修改  */
function handleStatusChange(row) {
  let text = row.disableFlag == "0" ? "启用" : "停用";
  proxy.$modal.confirm('确认要"' + text + '"编号为【' + row.id + '】的项吗?').then(function () {
    return disableSysOuterSignRequest({
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
  proxy.download('system/sysOuterSign/exportSysOuterSignList', {
    ...queryParams.value
  }, `sysOuterSign_${new Date().getTime()}.xlsx`)
}

getList();
getTenantList();
</script>
