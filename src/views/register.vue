<template>
  <div class="register">
    <el-form ref="registerRef" :model="registerForm" :rules="registerRules" class="register-form">
      <h3 class="title">若依后台管理系统</h3>
      <el-form-item prop="username">
        <el-input
            v-model="registerForm.username"
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
            v-model="registerForm.password"
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
      <el-form-item prop="confirmPassword">
        <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            size="large"
            auto-complete="off"
            placeholder="确认密码"
            @keyup.enter="useVerify"
        >
          <template #prefix>
            <svg-icon icon-class="password" class="el-input__icon input-icon"/>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="tenantTag">
        <el-input
            v-model="registerForm.tenantTag"
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
      <el-form-item style="width:100%;">
        <el-button
            :loading="loading"
            size="large"
            type="primary"
            style="width:100%;"
            @click.prevent="useVerify"
        >
          <span v-if="!loading">注 册</span>
          <span v-else>注 册 中...</span>
        </el-button>
        <div style="float: right;">
          <router-link class="link-type" :to="'/login'">使用已有账户登录</router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-register-footer">
      <span>Copyright © 2018-2023 ruoyi.vip All Rights Reserved.</span>
    </div>
  </div>
  <Verify
      @success="success"
      mode="pop"
      captchaType="blockPuzzle"
      :imgSize="{ width: '330px', height: '155px' }"
      ref="verify"
  ></Verify>
</template>

<script setup>
import {ElMessageBox} from "element-plus";
import {register} from "@/api/system/sysLogin";
import Verify from "../components/verifition/Verify";
import {ref} from "vue";
import {piniaStore} from "@/store/indexStore";

const router = useRouter();
const {proxy} = getCurrentInstance();
const verify = ref(null);

const registerForm = reactive({
  username: "",
  password: "",
  confirmPassword: "",
  tenantTag: "system",
  deviceAppId: piniaStore.userStore.deviceAppId,
  captchaVerification: ""
});

const equalToPassword = (rule, value, callback) => {
  if (registerForm.password !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

const registerRules = {
  username: [
    {required: true, trigger: "blur", message: "请输入您的账号"},
    {min: 2, max: 20, message: "用户账号长度必须介于 2 和 20 之间", trigger: "blur"}
  ],
  password: [
    {required: true, trigger: "blur", message: "请输入您的密码"},
    {min: 5, max: 20, message: "用户密码长度必须介于 5 和 20 之间", trigger: "blur"}
  ],
  confirmPassword: [
    {required: true, trigger: "blur", message: "请再次输入您的密码"},
    {required: true, validator: equalToPassword, trigger: "blur"}
  ],
};

const loading = ref(false);
const captchaOnOff = ref(true);

function useVerify() {
  proxy.$refs.registerRef.validate(valid => {
    if (valid) {
      verify.value.show()
    }
  });
}

function success(params) {
  registerForm.captchaVerification = params.captchaVerification;
  handleRegister()
}

async function handleRegister() {
  loading.value = true;
  await register(registerForm)
      .catch(error => {
        loading.value = false;
        return Promise.reject(error);
      });
  //注册成功
  const username = registerForm.username;
  ElMessageBox.alert("<font color='red'>恭喜你，您的账号 " + username + " 注册成功！</font>", "系统提示", {
    dangerouslyUseHTMLString: true,
    type: "success",
  }).then(() => {
    router.push("/login");
  });
}

</script>

<style lang='scss' scoped>
.register {
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

.register-form {
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

.register-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.register-code {
  width: 33%;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-register-footer {
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

.register-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
