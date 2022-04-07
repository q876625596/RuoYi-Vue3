<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="测试名称" prop="testName">
        <el-input
          v-model="queryParams.testName"
          placeholder="请输入测试名称"
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
          v-hasPermi="['system:testMain:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleEdit"
          v-hasPermi="['system:testMain:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:testMain:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:testMain:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table ref="mainTable" v-loading="loading" :data="testMainList" @selection-change="handleSelectionChange"
              :row-key="getRowKeys"
              :expand-row-keys="expandRowKeys"
              @expand-change="handleExpandTestSubList">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="expand" align="center">
            <!-- 展开子列表 -->
            <template #default="mainScope">
                <el-table size="small" :border="true" v-loading="testSubLoading" :data="mainScope.row.testSubList">
                            <el-table-column label="测试子表主键" align="center" prop="id" show-overflow-tooltip />
                            <el-table-column label="测试主表外键" align="center" prop="testMainId" />
                            <el-table-column label="测试子表名称" align="center" prop="testSubName" />
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template #default="subScope">
                            <el-button
                                    size="small"
                                    type="text"
                                    icon="Edit"
                                    @click="handleEditTestSub(subScope.row)"
                                    v-hasPermi="['system:${testSub}:edit']"
                            >编辑</el-button>
                            <el-button
                                    size="small"
                                    type="text"
                                    icon="Delete"
                                    @click="handleDeleteTestSub(subScope.row)"
                                    v-hasPermi="['system:${testSub}:remove']"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </el-table-column>
      <el-table-column label="测试主键" align="center" prop="id" show-overflow-tooltip />
      <el-table-column label="测试名称" align="center" prop="testName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Plus"
            @click="handleAddTestSub(scope.row)"
            v-hasPermi="['system:testSub:add']"
          >新增测试子表</el-button>
          <el-button
            type="text"
            icon="Edit"
            @click="handleEdit(scope.row)"
            v-hasPermi="['system:testMain:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:testMain:remove']"
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

    <!-- 添加或修改测试对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="testMainRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="测试名称" prop="testName">
          <el-input v-model="form.testName" placeholder="请输入测试名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

      <!-- 添加或修改测试子表对话框 -->
      <el-dialog :title="testSubTitle" v-model="openTestSub" width="500px" append-to-body>
          <el-form ref="testSubRef" :model="testSubForm" :rules="testSubRules" label-width="80px">
            <el-form-item label="测试子表名称" prop="testSubName">
                <el-input v-model="testSubForm.testSubName" placeholder="请输入测试子表名称" />
            </el-form-item>

          </el-form>
          <template #footer>
              <div class="dialog-footer">
                  <el-button type="primary" @click="submitTestSubForm">确 定</el-button>
                  <el-button @click="cancelTestSub">取 消</el-button>
              </div>
          </template>
      </el-dialog>
  </div>
</template>

<script setup name="TestMain">
    import {getTestMainListRequest, getTestMainDetailsRequest, addTestMainRequest, editTestMainRequest, deleteTestMainByIdsRequest} from "@/api/system/testMain";
    import {getTestSubListRequest, getTestSubDetailsRequest, addTestSubRequest, editTestSubRequest, deleteTestSubByIdsRequest} from "@/api/system/testSub";

    const { proxy } = getCurrentInstance();

const testMainList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const openTestSub = ref(false);
const testSubTitle = ref("");
const testSubList = ref([]);
const testSubLoading = ref(false);


const data = reactive({
  form: {},
  testSubForm: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    testName: null,
  },
  /** 表格row-key */
  getRowKeys: (expandedRows) => {
      return expandedRows.id
  },
  expandRowKeys: [],
  rules: {
    createTime: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ],
    createUserId: [
      { required: true, message: "创建人id不能为空", trigger: "blur" }
    ],
    updateTime: [
      { required: true, message: "更新时间不能为空", trigger: "blur" }
    ],
    updateUserId: [
      { required: true, message: "更新人id不能为空", trigger: "blur" }
    ]
  },
  testSubRules: {
                  testMainId: [
                  { required: true, message: "测试主表外键不能为空", trigger: "blur" }
              ],
  }
});
const { queryParams, getRowKeys, expandRowKeys, form, testSubForm, rules, testSubRules } = toRefs(data);

/** 查询测试列表 */
async function getList() {
  loading.value = true;
  let response = await getTestMainListRequest(queryParams.value)
  testMainList.value = response.data.list;
    let mainTable = proxy.$refs["mainTable"];
    if (mainTable) {
        for (let key of expandRowKeys.value) {
            mainTable.toggleRowExpansion({id: key}, false)
        }
    }
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
    testName: null,
    createTime: null,
    createUserId: null,
    updateTime: null,
    updateUserId: null
  };
  proxy.resetForm("testMainRef");
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
  title.value = "添加测试";
}

/** 修改按钮操作 */
async function handleEdit(row) {
  reset();
  const id = row.id || ids.value[0]
  let response = await getTestMainDetailsRequest(id);
  form.value = response.data;
          testSubList.value = response.data.testSubList;
  open.value = true;
  title.value = "修改测试";
}

/** 提交按钮 */
async function submitForm() {
  proxy.$refs["testMainRef"].validate(async valid => {
    if (valid) {
      form.value.testSubList = testSubList.value;
      if (form.value.id != null) {
        await editTestMainRequest(form.value);
        proxy.$modal.msgSuccess("修改成功");
        open.value = false;
        await getList();
      } else {
        await addTestMainRequest(form.value);
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
  proxy.$modal.confirm('是否确认删除测试编号为"' + idList + '"的数据项？').then(async function() {
    await deleteTestMainByIdsRequest(idList);
    await getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}


/** 子表单重置 */
function resetTestSub() {
    testSubForm.value = {
      id: null,
      testMainId: null,
      testSubName: null,
    };
    proxy.resetForm("testSubRef");
}

/** 点击展开事件触发 */
function handleExpandTestSubList(data, rowList) {
    if (!data || data === '') return;
    if (rowList && rowList.length > 0) { // 外层表格有展开行数据时，才请求接口
        const { id } = data;
        getTestSubList(id)
    }
}

async function getTestSubList(testMainId) {
    testSubLoading.value = true;
    let res = await getTestSubListRequest({ testMainId: testMainId }).catch(err => {
        console.error(err)
    })
    const { code, data } = res;
    if (code === 200) {
        testMainList.value.forEach((item, index) => {
            if (item.id === testMainId) {
                testMainList.value[index].testSubList = data; // 更新[] => 当前展开行请求到的列表数据
            }
        })
        testSubLoading.value = false;
    }
}

/** 测试子表添加按钮操作 */
function handleAddTestSub(row) {
    testSubForm.value = {
        testMainId: row.id
    }
    openTestSub.value = true;
    testSubTitle.value = "新增测试子表";
}


/** 测试子表删除按钮操作 */
function handleDeleteTestSub(row) {
    if(!row) return;
    const { id, testMainId } = row;
    proxy.$modal.confirm('是否确认删除测试子表编号为"' + id + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    }).then(() => {
        return deleteTestSubByIdsRequest([id]);
    }).then(() => {
        handleExpandTestSubList({id: testMainId}, [{id: testMainId}])
        this.msgSuccess("删除成功");
    }).catch(() => {
    });
}

// 编辑测试子表数据
async function handleEditTestSub(row) {
    if(!row) return;
    const { id } = row;
    let response = await getTestSubDetailsRequest(id);
    testSubForm.value = response.data;
    openTestSub.value = true;
    testSubTitle.value = "编辑测试子表";
}

// 提交测试子表数据
function submitTestSubForm() {
    proxy.$refs["testSubRef"].validate(async valid => {
        if (valid) {
            if (testSubForm.value.id != null) {
                await editTestSubRequest(testSubForm.value);
                proxy.$modal.msgSuccess("修改成功");
                openTestSub.value = false;
                await getTestSubList(testSubForm.value.testMainId);
            } else {
                await addTestSubRequest(testSubForm.value);
                proxy.$modal.msgSuccess("新增成功");
                openTestSub.value = false;
                await getTestSubList(testSubForm.value.testMainId);
            }
        }
    });
}

function cancelTestSub() {
    openTestSub.value = false;
    resetTestSub();
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/testMain/export', {
    ...queryParams.value
  }, `testMain_${new Date().getTime()}.xlsx`)
}

getList();
</script>
