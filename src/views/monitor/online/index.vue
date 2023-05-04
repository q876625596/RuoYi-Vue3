<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item label="登录地址" prop="ipaddr">
        <el-input
            v-model="queryParams.ipaddr"
            placeholder="请输入登录地址"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <el-input
            v-model="queryParams.userName"
            placeholder="请输入用户名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
        v-loading="loading"
        :data="onlineList"
        style="width: 100%;"
    >
      <el-table-column label="序号" width="50" type="index" align="center"/>
      <el-table-column label="设备名称" align="center" prop="deviceName" :show-overflow-tooltip="true"/>
      <el-table-column label="会话编号" align="center" prop="token" :show-overflow-tooltip="true"/>
      <el-table-column label="用户信息" align="center" prop="userName">
        <template #default="scope">
          {{ scope.row.tenantName }}-{{ scope.row.deptName }}-{{ scope.row.userName }}
        </template>
      </el-table-column>
      <!--      <el-table-column label="登录名称" align="center" prop="userName" :show-overflow-tooltip="true"/>-->
      <!--      <el-table-column label="所属部门" align="center" prop="deptName" :show-overflow-tooltip="true"/>-->
      <!--      <el-table-column label="所属租户" align="center" prop="tenantName" :show-overflow-tooltip="true"/>-->
      <el-table-column label="主机" align="center" prop="ipaddr" :show-overflow-tooltip="true"/>
      <el-table-column label="登录地点" align="center" prop="loginLocation" :show-overflow-tooltip="true"/>
      <el-table-column label="操作系统" align="center" prop="os" :show-overflow-tooltip="true"/>
      <el-table-column label="浏览器" align="center" prop="browser" :show-overflow-tooltip="true"/>
      <el-table-column label="登录时间" align="center" prop="loginTime" width="180"/>
      <el-table-column label="最后操作时间" align="center" prop="lastActiveTime" width="180"/>
      <el-table-column label="剩余有效时间" align="center" prop="activeTime" width="130"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Delete"
              @click="handleForceLogout(scope.row)"
              v-hasPermi="['monitor:online:forceLogout']"
          >强退
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
                v-model:limit="queryParams.pageSize"
                @pagination="getList"/>
  </div>
</template>

<script setup name="Online">
import {forceLogout, list as initData} from "@/api/system/sysOnline";

const {proxy} = getCurrentInstance();

const onlineList = ref([]);
const loading = ref(true);
const total = ref(0);

const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  ipaddr: undefined,
  userName: undefined
});

/** 查询登录日志列表 */
function getList() {
  loading.value = true;
  initData(queryParams.value).then(response => {
    onlineList.value = response.data.list;
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
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 强退按钮操作 */
function handleForceLogout(row) {
  proxy.$modal.confirm('是否确认强退名称为"' + row.userName + '"的用户?').then(function () {
    return forceLogout(row.token);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

getList();
</script>
<style lang="scss">
.tokenDataOuter {
  display: flex;
  justify-content: space-between;
}

.tokenDataItem {
  width: 49%;
}
</style>
