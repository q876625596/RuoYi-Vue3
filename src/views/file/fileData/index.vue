<template>
  <div class="app-container">

    <el-row :gutter="20">
      <el-col :span="8">
        <el-form ref="uploadRef" :model="upload" label-position="left" :rules="rules" label-width="80px">
          <el-form-item label="存储类型" label-width="100" prop="storageType">
            <el-select v-model="upload.storageType" placeholder="请选择存储类型"
                       @change="typeSelectChange">
              <el-option
                  v-for="dict in file_storage_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件桶" label-width="100" prop="bucketName">
            <el-select v-model="upload.bucketName" placeholder="请选择文件桶">
              <el-option
                  v-for="bucket in [{id:'0',storageName:'默认',bucketName:''},...fileStorageConfigList.filter(it=>it.storageType == upload.storageType)]"
                  :key="bucket.id"
                  :label="bucket.storageName"
                  :value="bucket.bucketName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span="16">
        <file-upload :drag="true" :custom-upload-file-url="uploadFileUrl" :data="upload" :success-clear-all="true"
                     :is-show-tip="true"
                     :on-success="onFileUploadSuccess"></file-upload>
      </el-col>

    </el-row>

    <el-divider/>

    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="桶名称" label-width="auto" prop="bucketName">
        <el-input
            v-model="queryParams.bucketName"
            placeholder="请输入桶名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="对象存储类型" label-width="auto" prop="storageType">
        <el-select v-model="queryParams.storageType" placeholder="请选择对象存储类型" clearable>
          <el-option
              v-for="dict in file_storage_type"
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
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:fileData:remove']"
        >删除
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table ref="mainTable" v-loading="loading" :data="fileDataList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键id" align="center" prop="id" show-overflow-tooltip/>
      <el-table-column label="文件根路径" align="center" prop="netFileRootPath" show-overflow-tooltip/>
      <el-table-column label="文件名称" align="center" prop="netFileName" show-overflow-tooltip/>
      <el-table-column label="原始文件名" align="center" prop="originalFileName" show-overflow-tooltip/>
      <el-table-column label="桶名称" align="center" prop="bucketName" show-overflow-tooltip/>
      <el-table-column label="对象存储类型" align="center" prop="storageType">
        <template #default="scope">
          <dict-tag :options="file_storage_type" :value="scope.row.storageType"/>
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
                  v-show="enablePreviewImage(scope.row)"
                  type="text"
                  icon="View">预览(图片)
              </el-button>
            </template>
          </el-popover>
          <el-button
              type="text"
              icon="Link"
              v-copyText="scope.row.netFileFullPath"
          >复制链接
          </el-button>
          <el-button
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:fileData:remove']"
          >删除
          </el-button>
          <el-button
              type="text"
              v-show="enablePreview(scope.row)"
              icon="Promotion"
              @click="previewFile(scope.row)"
          >预览
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

<script setup name="FileData">
import {deleteFileDataByIdsRequest, getFileDataListRequest,} from "@/api/file/fileData";
import {getFileStorageConfigSelectRequest,} from "@/api/file/fileStorageConfig";
import {parseTime} from "@/utils/ruoyi";
import {getCurrentInstance, reactive, ref, toRefs} from "vue";
import FileUpload from "@/components/FileUpload/index.vue";
import {Base64} from "js-base64";
import {piniaStore} from "@/store/indexStore";

const {proxy} = getCurrentInstance();
const {file_storage_type} = proxy.useDict('file_storage_type');

const fileDataList = ref([]);
const fileStorageConfigList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const uploadFileUrl = ref(import.meta.env.VITE_APP_BASE_API + "/file/fileUpload/uploadCustom");


const data = reactive({
  upload: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    bucketName: null,
    storageType: null,
    fileSuffix: null,
    fileMinSize: null,
    fileMaxSize: null,
  },
});
const {queryParams, upload, rules} = toRefs(data);

/** 查询文件管理列表 */
async function getList() {
  loading.value = true;
  let response = await getFileDataListRequest(queryParams.value)
  fileDataList.value = response.data.list;
  total.value = response.data.total;
  loading.value = false;
}

/** 查询文件管理列表 */
async function getFileStorageConfigList() {
  let response = await getFileStorageConfigSelectRequest()
  fileStorageConfigList.value = response.data;
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
    await deleteFileDataByIdsRequest(idList);
    await getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

function onFileUploadSuccess(s) {
  proxy.$modal.msgSuccess("上传成功");
  getList();
}


function typeSelectChange() {
  upload.value.bucketName = '';
}

function previewFile(row) {
  let url = row.netFileFullPath;

  if (!url.endsWith(row.fileSuffix)) {
    url = url + '?fullfilename=test' + row.netFileName + '.' + row.fileSuffix
  }
  console.log(url);
  window.open('http://127.0.0.1:8012/onlinePreview?url=' + encodeURIComponent(Base64.encode(url)));
}

function enablePreview(row) {
  return piniaStore.fileStore.suffixList.indexOf(row.fileSuffix) !== -1;
}
function enablePreviewImage(row) {
  return piniaStore.fileStore.imageSuffixList.indexOf(row.fileSuffix) !== -1;
}

getList();
getFileStorageConfigList();
</script>
