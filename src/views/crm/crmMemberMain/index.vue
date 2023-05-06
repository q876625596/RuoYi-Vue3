<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="手机号" prop="phoneNumber">
                <el-input
                        v-model="queryParams.phoneNumber"
                        placeholder="手机号"
                        clearable
                        @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickName">
                <el-input
                        v-model="queryParams.nickName"
                        placeholder="请输入用户昵称"
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
                        type="warning"
                        plain
                        icon="Download"
                        @click="handleExport"
                        v-hasPermi="['crm:crmMemberMain:export']"
                >导出
                </el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-table ref="mainTable" v-loading="loading" :data="crmMemberMainList">
            <el-table-column label="主键" align="center" prop="id" show-overflow-tooltip/>
            <el-table-column label="首次生成的三方平台会员主键id" align="center" prop="firstCreateMemberThirdId"/>
            <el-table-column label="手机号" align="center" prop="phoneNumber"/>
            <el-table-column label="昵称" align="center" prop="nickName"/>
            <el-table-column label="头像" align="center" prop="avatar">
                <template #default="scope">
                    <ElAvatar :src-set="scope.row.avatar"></ElAvatar>
                </template>
            </el-table-column>
            <el-table-column label="性别" align="center" prop="gender">
                <template #default="scope">
                    <dict-tag :options="sys_user_sex" :value="scope.row.gender" />
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
                            icon="Warning"
                            @click="handleDetails(scope.row)"
                            v-hasPermi="['crm:crmMemberMain:query']"
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

    </div>
</template>

<script setup name="CrmMemberMain">
import {getCrmMemberMainListRequest,} from "@/api/crm/crmMemberMain";
import {getCurrentInstance, reactive, ref, toRefs} from "vue";
import {parseTime} from "@/utils/ruoyi";
import {useRouter} from "vue-router";

const {proxy} = getCurrentInstance();

const {sys_user_sex} = proxy.useDict("sys_user_sex");
const router = useRouter();
const crmMemberMainList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");


const data = reactive({
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        phoneNumber: null,
        nickName: null
    },
});
const {queryParams} = toRefs(data);

/** 查询正式会员列表 */
async function getList() {
    loading.value = true;
    let response = await getCrmMemberMainListRequest(queryParams.value)
    crmMemberMainList.value = response.data.list;
    total.value = response.data.total;
    loading.value = false;
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

/** 详情按钮操作 */
function handleDetails(row) {
    router.push({
        path: "/crm/crmMemberThird",
        query: {
            memberMainId: row.id,
        },
    });
}

/** 导出按钮操作 */
function handleExport() {
    proxy.download('crm/crmMemberMain/export', {
        ...queryParams.value
    }, `crmMemberMain_${new Date().getTime()}.xlsx`)
}

getList();
</script>
