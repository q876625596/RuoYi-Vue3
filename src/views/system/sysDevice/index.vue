<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="应用id" prop="appId">
                <el-input
                        v-model="queryParams.appId"
                        placeholder="请输入应用id"
                        clearable
                        @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="设备名称" prop="deviceName">
                <el-input
                        v-model="queryParams.deviceName"
                        placeholder="请输入设备名称"
                        clearable
                        @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="设备类型" prop="deviceType">
                <el-select v-model="queryParams.deviceType" placeholder="请选择设备类型" clearable>
                    <el-option
                            v-for="dict in sys_device_type"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="登录账号类型" prop="loginType">
                <el-select v-model="queryParams.loginType" placeholder="请选择账号类型" clearable>
                    <el-option
                            v-for="dict in sys_account_type"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                    />
                </el-select>
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
                        v-hasPermi="['system:sysDevice:add']"
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
                        v-hasPermi="['system:sysDevice:edit']"
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
                        v-hasPermi="['system:sysDevice:remove']"
                >删除
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                        type="warning"
                        plain
                        icon="Download"
                        @click="handleExport"
                        v-hasPermi="['system:sysDevice:export']"
                >导出
                </el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-table ref="mainTable" v-loading="loading" :data="sysDeviceList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="主键id" align="center" prop="id" show-overflow-tooltip/>
            <el-table-column label="应用id" align="center" prop="appId"/>
            <el-table-column label="设备名称" align="center" prop="deviceName"/>
            <el-table-column label="设备类型" align="center" prop="deviceType">
                <template #default="scope">
                    <dict-tag :options="sys_device_type" :value="scope.row.deviceType"/>
                </template>
            </el-table-column>
            <el-table-column label="登录账号类型" align="center" prop="loginType">
                <template #default="scope">
                    <dict-tag :options="sys_account_type" :value="scope.row.loginType"/>
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
                            @click="handleEdit(scope.row)"
                            v-hasPermi="['system:sysDevice:edit']"
                    >修改
                    </el-button>
                    <el-button
                            type="text"
                            icon="Delete"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['system:sysDevice:remove']"
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

        <!-- 添加或修改系统设备对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="sysDeviceRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="应用id" prop="appId">
                    <el-input v-model="form.appId" placeholder="请输入应用id"/>
                </el-form-item>
                <el-form-item label="设备名称" prop="deviceName">
                    <el-input v-model="form.deviceName" placeholder="请输入设备名称"/>
                </el-form-item>
                <el-form-item label="设备类型" prop="deviceType">
                    <el-select v-model="form.deviceType" placeholder="请选择设备类型">
                        <el-option
                                v-for="dict in sys_device_type"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="登录账号类型" label-width="auto" prop="loginType">
                    <el-select v-model="form.loginType" placeholder="请选择登录账号类型">
                        <el-option
                                v-for="dict in sys_account_type"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"
                        ></el-option>
                    </el-select>
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

    </div>
</template>

<script setup name="SysDevice">
import {
    addSysDeviceRequest,
    deleteSysDeviceByIdsRequest,
    disableSysDeviceRequest,
    editSysDeviceRequest,
    getSysDeviceDetailsRequest,
    getSysDeviceListRequest
} from "@/api/system/sysDevice";

const {proxy} = getCurrentInstance();
const {
    sys_device_type,
    sys_account_type,
    sys_yes_no
} = proxy.useDict('sys_device_type', 'sys_account_type', 'sys_yes_no');

const sysDeviceList = ref([]);
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
        appId: null,
        deviceName: null,
        deviceType: null,
        loginType: null,
        disableFlag: null,
    },
    rules: {
        appId: [
            {required: true, message: "应用id不能为空", trigger: "blur"}
        ],
        deviceName: [
            {required: true, message: "设备名称不能为空", trigger: "blur"}
        ],
        deviceType: [
            {required: true, message: "设备类型不能为空", trigger: "change"}
        ],
        loginType: [
            {required: true, message: "登录账号类型不能为空", trigger: "change"}
        ],
    },
});
const {queryParams, form, rules} = toRefs(data);

/** 查询系统设备列表 */
async function getList() {
    loading.value = true;
    let response = await getSysDeviceListRequest(queryParams.value)
    sysDeviceList.value = response.data.list;
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
        appId: null,
        deviceName: null,
        loginType: null,
        deviceType: null,
        disableFlag: null,
        delFlag: null,
        createUserId: null,
        createTime: null,
        updateUserId: null,
        updateTime: null,
        remark: null,
        tenantId: null
    };
    proxy.resetForm("sysDeviceRef");
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
    title.value = "添加系统设备";
}

/** 修改按钮操作 */
async function handleEdit(row) {
    reset();
    const id = row.id || ids.value[0]
    let response = await getSysDeviceDetailsRequest(id);
    form.value = response.data;
    open.value = true;
    title.value = "修改系统设备";
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["sysDeviceRef"].validate(async valid => {
        if (valid) {
            if (form.value.id != null) {
                await editSysDeviceRequest(form.value);
                proxy.$modal.msgSuccess("修改成功");
                open.value = false;
                await getList();
            } else {
                await addSysDeviceRequest(form.value);
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
    proxy.$modal.confirm('是否确认删除系统设备编号为"' + idList + '"的数据项？').then(async () => {
        await deleteSysDeviceByIdsRequest(idList);
        await getList();
        proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {
    });
}

/** 状态修改  */
function handleStatusChange(row) {
    let text = row.disableFlag == "0" ? "启用" : "停用";
    proxy.$modal.confirm('确认要"' + text + '"编号为【' + row.id + '】的项吗?').then(function () {
        return disableSysDeviceRequest({
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
    proxy.download('system/sysDevice/export', {
        ...queryParams.value
    }, `sysDevice_${new Date().getTime()}.xlsx`)
}

getList();
</script>
