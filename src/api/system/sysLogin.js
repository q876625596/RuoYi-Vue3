import request from '@/utils/request'
import {piniaStore} from "@/store/indexStore";

// 登录方法
export function sysLogin(username, password, captchaVerification, tenantId) {
  const data = {
    username,
    password,
    captchaVerification
  }
  return request({
    url: '/auth/login',
    headers: {
      isToken: false,
      tenantid: piniaStore.userStore.getTenantId,
    },
    method: 'post',
    data: data
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/auth/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/system/sysUser/getCurrentLoginUser',
    method: 'post'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/code',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}
