<template>
  <div class="login">
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">若依后台管理系统</h3>
      <el-form-item prop="username">
        <el-input
            v-model="loginForm.username"
            type="text"
            size="large"
            auto-complete="off"
            placeholder="账号"
        >
          <template #prefix>
            <svg-icon icon-class="user" class="el-input__icon input-icon"/>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
            v-model="loginForm.password"
            type="password"
            size="large"
            auto-complete="off"
            placeholder="密码"
            @keyup.enter="useVerify"
        >
          <template #prefix>
            <svg-icon icon-class="password" class="el-input__icon input-icon"/>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="tenantTag">
        <el-input
            v-model="loginForm.tenantTag"
            type="text"
            size="large"
            auto-complete="off"
            placeholder="租户标识"
            @keyup.enter="useVerify"
        >
          <template #prefix>
            <svg-icon icon-class="tenant" class="el-input__icon input-icon"/>
          </template>
        </el-input>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
            :loading="loading"
            size="large"
            type="primary"
            style="width:100%;"
            @click.prevent="useVerify"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right;" v-if="register">
          <router-link class="link-type" :to="'/register'">立即注册</router-link>
        </div>
      </el-form-item>
    </el-form>

    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2023 ruoyi.vip All Rights Reserved.</span>
    </div>
  </div>
  <VerifyWidget
      @success="success"
      mode="pop"
      captchaType="blockPuzzle"
      :imgSize="{ width: '330px', height: '155px' }"
      ref="verify"
  ></VerifyWidget>
</template>

<script setup>
import Cookies from "js-cookie";
import {decrypt, encrypt} from "@/utils/jsencrypt";
import Verify from "../components/verifition/Verify";
import {piniaStore} from '@/store/indexStore'

const VerifyWidget = Verify
const router = useRouter();
const {proxy} = getCurrentInstance();
const verify = ref(null);

const loginForm = reactive({
  username: "admin",
  password: "admin123",
  rememberMe: false,
  tenantTag: "system",
  captchaVerification: ""
});

const loginRules = {
  tenantTag: [{required: true, trigger: "blur", message: "请输入您的租户标识"}],
  username: [{required: true, trigger: "blur", message: "请输入您的账号"}],
  password: [{required: true, trigger: "blur", message: "请输入您的密码"}],
};

const loading = ref(false);
// 注册开关
const register = ref(false);
const redirect = ref(undefined);

function useVerify() {
  verify.value.show()
}

function success(params) {
  loginForm.captchaVerification = params.captchaVerification;
  handleLogin()
}

function handleLogin() {
  proxy.$refs.loginRef.validate(valid => {
    if (valid) {
      loading.value = true;
      // 勾选了需要记住密码设置在cookie中设置记住用户明和名命
      if (loginForm.rememberMe) {
        Cookies.set("tenantTag", loginForm.tenantTag, {expires: 30});
        Cookies.set("username", loginForm.username, {expires: 30});
        Cookies.set("password", encrypt(loginForm.password), {expires: 30});
        Cookies.set("rememberMe", loginForm.rememberMe, {expires: 30});
      } else {
        // 否则移除
        Cookies.remove("tenantTag");
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      // 调用action的登录方法
      piniaStore.userStore.login(loginForm).then(() => {
        router.push({path: redirect.value || "/"});
      }).catch(() => {
        loading.value = false;
      });
    }
  });
}

function getCookie() {
  const tenantTag = Cookies.get("tenantTag");
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.tenantTag = tenantTag === undefined ? loginForm.tenantTag : tenantTag
  loginForm.username = username === undefined ? loginForm.username : username;
  loginForm.password = password === undefined ? loginForm.password : decrypt(password);
  loginForm.rememberMe = rememberMe === undefined ? false : Boolean(rememberMe);
}

getCookie();
let tenantTagByPath = proxy.$route.query.tenantTag;
if (tenantTagByPath) {
  loginForm.tenantTag = tenantTagByPath;
}
</script>

<style lang='scss' scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 40px;

    input {
      height: 40px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>
