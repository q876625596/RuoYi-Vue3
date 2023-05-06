<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="正式用户主键id" label-width="auto" prop="memberMainId">
                <el-input
                        v-model="queryParams.memberMainId"
                        placeholder="请输入正式用户主键id"
                        clearable
                        @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="三方平台用户昵称" label-width="auto" prop="nickName">
                <el-input
                        v-model="queryParams.nickName"
                        placeholder="请输入三方平台用户昵称"
                        clearable
                        @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="三方平台用户id" label-width="auto" prop="openId">
                <el-input
                        v-model="queryParams.openId"
                        placeholder="请输入三方平台用户id"
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
                        v-hasPermi="['crm:crmMemberThird:export']"
                >导出
                </el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-table ref="mainTable" v-loading="loading" :data="crmMemberThirdList">
            <el-table-column label="主键id" align="center" prop="id" show-overflow-tooltip/>
            <!--      <el-table-column label="正式用户主键id" align="center" prop="memberMainId" show-overflow-tooltip />-->
            <el-table-column label="三方平台用户昵称" align="center" prop="nickName"/>
            <el-table-column label="三方平台用户头像" align="center" prop="avatar">
                <template #default="scope">
                    <ElAvatar :src-set="scope.row.avatar"></ElAvatar>
                </template>
            </el-table-column>
            <el-table-column label="三方平台用户性别" align="center" prop="gender">
                <template #default="scope">
                    <dict-tag :options="sys_user_sex" :value="scope.row.gender"/>
                </template>
            </el-table-column>
            <el-table-column label="三方平台用户国家" align="center" prop="country"/>
            <el-table-column label="三方平台用户省份" align="center" prop="province"/>
            <el-table-column label="三方平台用户城市" align="center" prop="city"/>
            <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="remark"/>
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

<script setup name="CrmMemberThird">
import {getCrmMemberThirdListRequest,} from "@/api/crm/crmMemberThird";
import {parseTime} from "@/utils/ruoyi";
import {getCurrentInstance, onActivated, reactive, ref, toRefs} from "vue";

const {proxy} = getCurrentInstance();

const {sys_user_sex} = proxy.useDict("sys_user_sex");
const crmMemberThirdList = ref([]);
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
        memberMainId: null,
        nickName: null,
        openId: null,
    },
});
const {queryParams} = toRefs(data);

onActivated(() => {
    if (proxy.$route.query.memberMainId) {
        console.log(proxy.$route.query.memberMainId)
        queryParams.value.memberMainId = proxy.$route.query.memberMainId;
        proxy.$route.query.memberMainId = '';
        getList();
    }
})

/** 查询平台会员列表 */
async function getList() {
    loading.value = true;
    let response = await getCrmMemberThirdListRequest(queryParams.value)
    crmMemberThirdList.value = response.data.list;
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

/** 导出按钮操作 */
function handleExport() {
    proxy.download('management/crmMemberThird/export', {
        ...queryParams.value
    }, `crmMemberThird_${new Date().getTime()}.xlsx`)
}

if (!proxy.$route.query.memberMainId) {
    getList();
}
</script>
