<template>
  <div class="image-info-head" @click="editCropper()"><img :src="options.cropImage ?? logo" :title="'点击' + title"
                                                           :class="displayImageCircle?'img-circle img-lg' : 'img-lg'"/>
  </div>
  <el-dialog :title="title" v-model="open" width="800px" append-to-body @opened="modalOpened" @close="closeDialog">
    <el-row>
      <el-col :xs="24" :md="12" :style="{height: '350px'}">
        <vue-cropper
            ref="cropper"
            :img="options.cropImage ?? logo"
            :info="true"
            :center-box="true"
            :autoCrop="options.autoCrop"
            :autoCropWidth="options.autoCropWidth"
            :autoCropHeight="options.autoCropHeight"
            :infoTrue="true"
            :fixedBox="true"
            :fixed="true"
            :full="true"
            :output-size="0.6"
            output-type="png"
            :fixed-number="options.fixedNumber"
            @realTime="realTime"
            v-if="visible"
        />
      </el-col>
      <el-col :xs="24" :md="12" :style="{height: '350px'}">
        <div class="image-upload-preview">
          <div :style="{'width': options.previews.w + 'px', 'height': options.previews.h + 'px',   'box-shadow': '0 0 4px #ccc', 'overflow' : 'hidden',
          'border-radius': displayImageCircle ? '50%' : '100%'}">
            <img :src="options.previews.url" :style="options.previews.img"/>
          </div>
        </div>
      </el-col>
    </el-row>
    <br/>
    <el-row>
      <el-col :lg="2" :md="2">
        <el-upload action="#" :http-request="requestUpload" :show-file-list="false" :before-upload="beforeUpload">
          <el-button>
            选择
            <el-icon class="el-icon--right">
              <upload/>
            </el-icon>
          </el-button>
        </el-upload>
      </el-col>
      <el-col class="el-icon--right" :lg="{span: 1, offset: 2}" :md="2">
        <el-button icon="Plus" @click="changeScale(1)"></el-button>
      </el-col>
      <el-col :lg="{span: 1, offset: 1}" :md="2">
        <el-button icon="Minus" @click="changeScale(-1)"></el-button>
      </el-col>
      <el-col :lg="{span: 1, offset: 1}" :md="2">
        <el-button icon="RefreshLeft" @click="rotateLeft()"></el-button>
      </el-col>
      <el-col :lg="{span: 1, offset: 1}" :md="2">
        <el-button icon="RefreshRight" @click="rotateRight()"></el-button>
      </el-col>
      <el-col :lg="{span: 2, offset: 6}" :md="2">
        <el-button type="primary" @click="uploadImg()">提 交</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script setup name="ImageCropUpload">
import "vue-cropper/dist/index.css";
import {VueCropper} from "vue-cropper";
import {reactive} from "@vue/reactivity";
import {Upload} from "@element-plus/icons-vue";
import {computed, onActivated, ref} from "vue";

import logo from '@/assets/logo/logo.png'

const {proxy} = getCurrentInstance();

const props = defineProps({
  uploadImage: {
    type: Function,
    required: true
  },
  title: {
    type: String,
    default: "上传图片"
  },
  displayImageCircle: {
    type: Boolean,
    default: true
  },
  displayImageWidth: {
    type: String,
    default: '120px'
  },
  displayImageHeight: {
    type: String,
    default: '120px'
  },
  oldImage: {
    type: String,
    default: null
  },
  cropImage: {
    type: Object,
    default: null,
  },
  autoCrop: {
    type: Boolean,
    default: true
  },
  fixedNumber: {
    type: Array,
    required: true
  },
});

onActivated(() => {
  options.cropImage = props.oldImage;
})

const open = ref(false);
const visible = ref(false);
const previewStyle = reactive({})
//图片裁剪数据
const options = reactive({
  cropImage: props.oldImage, // 裁剪图片的地址
  autoCrop: props.autoCrop ?? true, // 是否默认生成截图框
  autoCropWidth: props.fixedNumber ? props.fixedNumber[0] : 200, // 默认生成截图框宽度
  autoCropHeight: props.fixedNumber ? props.fixedNumber[1] : 200, // 默认生成截图框高度
  fixedBox: true, // 固定截图框大小 不允许改变
  centerBox: true,// 截图框是否被限制在图片里面
  fixedNumber: props.fixedNumber ?? [1, 1],// 截图框宽高比
  previews: {} //预览数据
})

const displayFontSize = computed(() => {
  let height = Number.parseInt(props.displayImageHeight);
  return height / 4 + props.displayImageHeight.replace(height.toString(), "");
});

/** 编辑头像 */
function editCropper() {
  open.value = true;
}

/** 打开弹出层结束时的回调 */
function modalOpened() {
  visible.value = true;
}

/** 覆盖默认上传行为 */
function requestUpload() {
}

/** 向左旋转 */
function rotateLeft() {
  proxy.$refs.cropper.rotateLeft();
}

/** 向右旋转 */
function rotateRight() {
  proxy.$refs.cropper.rotateRight();
}

/** 图片缩放 */
function changeScale(num) {
  num = num || 1;
  proxy.$refs.cropper.changeScale(num);
}

/** 上传预处理 */
function beforeUpload(file) {
  if (file.type.indexOf("image/") == -1) {
    proxy.$modal.msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
  } else {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      options.cropImage = reader.result;
    };
  }
}

/** 上传图片 */
function uploadImg() {
  proxy.$refs.cropper.getCropBlob(async data => {
    let image = await props.uploadImage(data)
    open.value = false;
    options.cropImage = image;
    visible.value = false;
  });
}

/** 实时预览 */
function realTime(data) {
  let previews = data
  let h = 0.5
  let w = 0.2

  previewStyle.value = {
    width: previews.w + "px",
    height: previews.h + "px",
    overflow: "hidden",
    margin: "0",
    zoom: h
  }

  options.previews = data;
}

/** 关闭窗口 */
function closeDialog() {
  options.cropImage = props.oldImage;
  visible.value = false;
}
</script>

<style lang='scss' scoped>

.img-lg {
  width: v-bind(displayImageWidth);
  height: v-bind(displayImageHeight);
}

.image-info-head {
  position: relative;
  display: inline-block;
  height: v-bind(displayImageHeight);
}

.image-info-head:hover:after {
  content: "+";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #eee;
  background: rgba(0, 0, 0, 0.5);
  font-size: v-bind(displayFontSize);
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: pointer;
  height: v-bind(displayImageHeight);
  border-radius: v-bind("displayImageCircle ? '50%' : '100%'");
}

.image-upload-preview-circle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 350px;
  width: 350px;
  overflow: hidden;
  margin: 5px;
  border-radius: 50%;
}

.image-upload-preview {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 350px;
  width: 350px;
  overflow: hidden;
  margin: 5px;
}

</style>
