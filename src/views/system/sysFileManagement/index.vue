<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="桶名称" label-width="auto" prop="bucketName">
                <el-input
                        v-model="queryParams.bucketName"
                        placeholder="请输入桶名称"
                        clearable
                        @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="对象存储类型" label-width="auto" prop="ossType">
                <el-select v-model="queryParams.ossType" placeholder="请选择对象存储类型" clearable>
                    <el-option
                            v-for="dict in sys_file_oss_type"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="文件后缀名" label-width="auto" prop="fileSuffix">
                <el-input
                        v-model="queryParams.fileSuffix"
                        placeholder="请输入文件后缀名"
                        clearable
                        @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="文件大小" label-width="auto" prop="fileSize">
                <el-input
                        style="width: 210px"
                        v-model="queryParams.fileMinSize"
                        placeholder="请输入最小值"
                        clearable
                        type="number"
                        @keyup.enter="handleQuery"
                >
                    <template #append>Byte</template>
                </el-input>
                <span>&nbsp至&nbsp</span>
                <el-input
                        style="width: 210px"
                        v-model="queryParams.fileMaxSize"
                        placeholder="请输入最大值"
                        clearable
                        type="number"
                        @keyup.enter="handleQuery"
                >
                    <template #append>Byte</template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <file-upload :success-clear-all="true" :is-show-tip="false" button-text="上传文件" :on-success="onFileUploadSuccess"></file-upload>
            </el-col>
            <el-col :span="1.5">
                <el-button
                        type="danger"
                        plain
                        icon="Delete"
                        :disabled="multiple"
                        @click="handleDelete"
                        v-hasPermi="['system:sysFileManagement:remove']"
                >删除
                </el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-table ref="mainTable" v-loading="loading" :data="sysFileManagementList"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="主键id" align="center" prop="id" show-overflow-tooltip/>
            <el-table-column label="文件根路径" align="center" prop="netFileRootPath" show-overflow-tooltip/>
            <el-table-column label="文件名称" align="center" prop="netFileName" show-overflow-tooltip/>
            <el-table-column label="原始文件名" align="center" prop="originalFileName" show-overflow-tooltip/>
            <el-table-column label="桶名称" align="center" prop="bucketName" show-overflow-tooltip/>
            <el-table-column label="对象存储类型" align="center" prop="ossType">
                <template #default="scope">
                    <dict-tag :options="sys_file_oss_type" :value="scope.row.ossType"/>
                </template>
            </el-table-column>
            <el-table-column label="文件后缀名" align="center" prop="fileSuffix"/>
            <el-table-column label="文件大小：Byte" align="center" prop="fileSize"/>
            <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-popover
                            placement="left"
                            width="500"
                            trigger="click"
                    >
                        <img style="width: 100%" :src="scope.row.netFileRootPath + scope.row.netFileName">
                        <template #reference>
                            <el-button
                                    ref="buttonRef"
                                    type="text"
                                    icon="View">预览
                            </el-button>
                        </template>
                    </el-popover>
                    <el-button
                            type="text"
                            icon="Download"
                            v-copyText="scope.row.netFileRootPath + scope.row.netFileName"
                    >复制链接
                    </el-button>
                    <el-button
                            type="text"
                            icon="Delete"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['system:sysFileManagement:remove']"
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
    </div>
</template>

<script setup name="SysFileManagement">
import {deleteSysFileManagementByIdsRequest, getSysFileManagementListRequest,} from "@/api/system/sysFileManagement";
import {parseTime} from "@/utils/ruoyi";
import {getCurrentInstance, reactive, ref, toRefs} from "vue";
import FileUpload from "@/components/FileUpload/index.vue";

const {proxy} = getCurrentInstance();
const {sys_file_oss_type} = proxy.useDict('sys_file_oss_type');

const sysFileManagementList = ref([]);
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
        bucketName: null,
        ossType: null,
        fileSuffix: null,
        fileMinSize: null,
        fileMaxSize: null,
    },
    rules: {
        bucketName: [
            {required: true, message: "桶名称，本地文件则为路径不能为空", trigger: "blur"}
        ],
        ossType: [
            {required: true, message: "对象存储类型不能为空", trigger: "change"}
        ],
    },
});
const {queryParams, form, rules} = toRefs(data);

/** 查询文件管理列表 */
async function getList() {
    loading.value = true;
    let response = await getSysFileManagementListRequest(queryParams.value)
    sysFileManagementList.value = response.data.list;
    total.value = response.data.total;
    loading.value = false;
}


// 表单重置
function reset() {
    form.value = {
        bucketName: null,
        ossType: null,
    };
    proxy.resetForm("sysFileManagementRef");
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

/** 删除按钮操作 */
function handleDelete(row) {
    const idList = row.id ? [row.id] : ids.value;
    proxy.$modal.confirm('是否确认删除文件管理编号为"' + idList + '"的数据项？').then(async () => {
        await deleteSysFileManagementByIdsRequest(idList);
        await getList();
        proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {
    });
}

function onFileUploadSuccess(s){
    proxy.$modal.msgSuccess("上传成功");
    getList();
}

getList();
</script>
