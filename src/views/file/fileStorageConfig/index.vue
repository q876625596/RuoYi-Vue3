<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="存储类型" label-width="auto" prop="storageType">
        <el-select v-model="queryParams.storageType" placeholder="请选择存储类型" clearable>
          <el-option
            v-for="dict in file_storage_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="存储名称" label-width="auto" prop="storageName">
        <el-input
          v-model="queryParams.storageName"
          placeholder="请输入存储名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="桶名称" label-width="auto" prop="bucketName">
        <el-input
          v-model="queryParams.bucketName"
          placeholder="请输入桶名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="存储根路径" label-width="auto" prop="domain">
        <el-input
          v-model="queryParams.domain"
          placeholder="请输入存储根路径"
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
          v-hasPermi="['file:fileStorageConfig:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleEdit"
          v-hasPermi="['file:fileStorageConfig:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['file:fileStorageConfig:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['file:fileStorageConfig:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table ref="mainTable" v-loading="loading" :data="fileStorageConfigList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键id" align="center" prop="id" show-overflow-tooltip />
      <el-table-column label="存储类型" align="center" prop="storageType">
        <template #default="scope">
          <dict-tag :options="file_storage_type" :value="scope.row.storageType"/>
        </template>
      </el-table-column>
      <el-table-column label="存储名称" align="center" prop="storageName" />
      <el-table-column label="桶名称" align="center" prop="bucketName" />
      <el-table-column label="存储根路径" align="center" prop="domain" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="租户id" align="center" prop="tenantId" show-overflow-tooltip />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleEdit(scope.row)"
            v-hasPermi="['file:fileStorageConfig:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['file:fileStorageConfig:remove']"
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

    <!-- 添加或修改文件存储配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="fileStorageConfigRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="存储类型" label-width="auto" prop="storageType">
          <el-select v-model="form.storageType" placeholder="请选择存储类型">
            <el-option
              v-for="dict in file_storage_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="存储名称" label-width="auto" prop="storageName">
          <el-input v-model="form.storageName" placeholder="请输入存储名称" />
        </el-form-item>
        <el-form-item label="桶名称" label-width="auto" prop="bucketName">
          <el-input v-model="form.bucketName" placeholder="请输入桶名称" />
        </el-form-item>
        <el-form-item label="存储根路径" label-width="auto" prop="domain">
          <el-input v-model="form.domain" placeholder="请输入存储根路径" />
        </el-form-item>
        <el-form-item label="备注" label-width="auto" prop="remark">
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

<script setup name="FileStorageConfig">
    import {getFileStorageConfigListRequest, getFileStorageConfigRequest, addFileStorageConfigRequest, editFileStorageConfigRequest, deleteFileStorageConfigRequest, } from "@/api/file/fileStorageConfig";

const { proxy } = getCurrentInstance();
const { file_storage_type } = proxy.useDict('file_storage_type');

const fileStorageConfigList = ref([]);
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
    storageType: null,
    storageName: null,
    bucketName: null,
    domain: null,
  },
  rules: {
    storageType: [
      { required: true, message: "存储类型不能为空", trigger: "change" }
    ],
    storageName: [
      { required: true, message: "存储名称不能为空", trigger: "blur" }
    ],
    bucketName: [
      { required: true, message: "桶名称不能为空", trigger: "blur" }
    ],
    domain: [
      { required: true, message: "存储根路径不能为空", trigger: "blur" }
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

/** 查询文件存储配置列表 */
async function getList() {
  loading.value = true;
  let response = await getFileStorageConfigListRequest(queryParams.value)
  fileStorageConfigList.value = response.data.list;
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
    storageType: null,
    storageName: null,
    bucketName: null,
    domain: null,
    createUserId: null,
    createTime: null,
    updateUserId: null,
    updateTime: null,
    remark: null,
    tenantId: null
  };
  proxy.resetForm("fileStorageConfigRef");
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
  title.value = "添加文件存储配置";
}

/** 修改按钮操作 */
async function handleEdit(row) {
  reset();
  const id = row.id || ids.value[0]
  let response = await getFileStorageConfigRequest(id);
  form.value = response.data;
  open.value = true;
  title.value = "修改文件存储配置";
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fileStorageConfigRef"].validate(async valid => {
    if (valid) {
      if (form.value.id != null) {
        await editFileStorageConfigRequest(form.value);
        proxy.$modal.msgSuccess("修改成功");
        open.value = false;
        await getList();
      } else {
        await addFileStorageConfigRequest(form.value);
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
  proxy.$modal.confirm('是否确认删除文件存储配置编号为"' + idList + '"的数据项？').then(async () => {
    await deleteFileStorageConfigRequest(idList);
    await getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}


/** 导出按钮操作 */
function handleExport() {
  proxy.download('management/fileStorageConfig/export', {
    ...queryParams.value
  }, `fileStorageConfig_${new Date().getTime()}.xlsx`)
}

getList();
</script>
