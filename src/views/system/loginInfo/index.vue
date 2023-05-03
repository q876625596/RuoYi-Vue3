<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
         <el-form-item label="登录地址" prop="ipaddr">
            <el-input
               v-model="queryParams.ipaddr"
               placeholder="请输入登录地址"
               clearable
               style="width: 240px;"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item label="用户名称" prop="userName">
            <el-input
               v-model="queryParams.userName"
               placeholder="请输入用户名称"
               clearable
               style="width: 240px;"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item label="登录类型" prop="loginType">
            <el-select
               v-model="queryParams.loginType"
               placeholder="登录类型"
               clearable
               style="width: 240px"
            >
               <el-option
                  v-for="dict in sys_account_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
               />
            </el-select>
         </el-form-item>
         <el-form-item label="登录设备" prop="loginDevice">
            <el-select
               v-model="queryParams.loginDevice"
               placeholder="登录设备"
               clearable
               style="width: 240px"
            >
               <el-option
                  v-for="dict in sys_device_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
               />
            </el-select>
         </el-form-item>
         <el-form-item label="状态" prop="successFlag">
            <el-select
               v-model="queryParams.successFlag"
               placeholder="登录状态"
               clearable
               style="width: 240px"
            >
               <el-option
                  v-for="dict in sys_common_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
               />
            </el-select>
         </el-form-item>
         <el-form-item label="登录时间" style="width: 308px">
            <el-date-picker
               v-model="dateRange"
               value-format="YYYY-MM-DD HH:mm:ss"
               type="datetimerange"
               range-separator="-"
               start-placeholder="开始日期"
               end-placeholder="结束日期"
               :default-time="[new Date(0,0,0,0,0,0),new Date(0,0,0,23,59,59)]"
            ></el-date-picker>
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               icon="Delete"
               :disabled="multiple"
               @click="handleDelete"
               v-hasPermi="['system:loginInfo:remove']"
            >删除</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               icon="Delete"
               @click="handleClean"
               v-hasPermi="['system:loginInfo:remove']"
            >清空</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="warning"
               plain
               icon="Download"
               @click="handleExport"
               v-hasPermi="['system:loginInfo:export']"
            >导出</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table ref="loginInfoRef" v-loading="loading" :data="loginInfoList" @selection-change="handleSelectionChange" :default-sort="defaultSort" @sort-change="handleSortChange">
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="访问编号" align="center" prop="id" />
         <el-table-column label="登录类型" align="center" prop="loginType" >
           <template #default="scope">
             <dict-tag :options="sys_account_type" :value="scope.row.loginType" />
           </template>
         </el-table-column>
         <el-table-column label="登录设备" align="center" prop="loginDevice" >
           <template #default="scope">
             <dict-tag :options="sys_device_type" :value="scope.row.loginDevice" />
           </template>
         </el-table-column>
         <el-table-column label="用户名称" align="center" prop="userName" :show-overflow-tooltip="true" sortable="custom" :sort-orders="['descending', 'ascending']" />
         <el-table-column label="地址" align="center" prop="ipaddr" :show-overflow-tooltip="true" />
         <el-table-column label="登录地点" align="center" prop="loginLocation" :show-overflow-tooltip="true" />
         <el-table-column label="操作系统" align="center" prop="os" :show-overflow-tooltip="true" />
         <el-table-column label="浏览器" align="center" prop="browser" :show-overflow-tooltip="true" />
         <el-table-column label="登录状态" align="center" prop="successFlag">
            <template #default="scope">
               <dict-tag :options="sys_common_status" :value="scope.row.successFlag" />
            </template>
         </el-table-column>
         <el-table-column label="描述" align="center" prop="msg" show-overflow-tooltip/>
         <el-table-column label="访问时间" align="center" prop="accessTime" sortable="custom" :sort-orders="['descending', 'ascending']" width="180"/>
      </el-table>

      <pagination
         v-show="total > 0"
         :total="total"
         v-model:page="queryParams.pageNum"
         v-model:limit="queryParams.pageSize"
         @pagination="getList"
      />
   </div>
</template>

<script setup name="LoginInfo">
import {list, delLoginInfo, cleanLoginInfo, unlockLoginInfo} from "@/api/system/sysLoginInfo";

const { proxy } = getCurrentInstance();
const { sys_common_status } = proxy.useDict("sys_common_status");
const { sys_account_type } = proxy.useDict("sys_account_type");
const { sys_device_type } = proxy.useDict("sys_device_type");

const loginInfoList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const selectName = ref("");
const total = ref(0);
const dateRange = ref([]);
const defaultSort = ref({ prop: "accessTime", order: "descending" });

// 查询参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  ipaddr: undefined,
  userName: undefined,
  successFlag: undefined,
  loginType: undefined,
  loginDevice: undefined,
  orderByColumn: undefined,
  isAsc: undefined
});

/** 查询登录日志列表 */
function getList() {
  loading.value = true;
  list(proxy.addDateRange(queryParams.value, dateRange.value)).then(response => {
    loginInfoList.value = response.data.list;
    total.value = response.data.total;
    loading.value = false;
  });
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  queryParams.value.pageNum = 1;
  proxy.$refs["loginInfoRef"].sort(defaultSort.value.prop, defaultSort.value.order);
  handleQuery();
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  multiple.value = !selection.length;
  single.value = selection.length != 1;
  selectName.value = selection.map(item => item.userName);
}
/** 排序触发事件 */
function handleSortChange(column, prop, order) {
  queryParams.value.orderByColumn = column.prop;
  queryParams.value.isAsc = column.order;
  getList();
}
/** 删除按钮操作 */
function handleDelete(row) {
  const infoIds = row.id ? [row.id] : ids.value;
  proxy.$modal.confirm('是否确认删除访问编号为"' + infoIds + '"的数据项?').then(function () {
    return delLoginInfo(infoIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}
/** 清空按钮操作 */
function handleClean() {
  proxy.$modal.confirm("是否确认清空所有登录日志数据项?").then(function () {
    return cleanLoginInfo();
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("清空成功");
  }).catch(() => {});
}
/** 解锁按钮操作 */
function handleUnlock() {
  const username = selectName.value;
  proxy.$modal.confirm('是否确认解锁用户"' + username + '"数据项?').then(function () {
    return unlockLoginInfo(username);
  }).then(() => {
    proxy.$modal.msgSuccess("用户" + username + "解锁成功");
  }).catch(() => {});
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download("system/sysLoginInfo/export", {
    ...queryParams.value,
  }, `config_${new Date().getTime()}.xlsx`);
}

getList();
</script>
