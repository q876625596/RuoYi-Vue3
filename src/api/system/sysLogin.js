import request from '@/utils/request'
import {piniaStore} from "@/store/indexStore";

// 验证租户标识
export function checkTenantTag(tenantTag) {
    const data = {
        tag: tenantTag
    }
    return request({
        url: '/management/sysTenant/checkTenantTag',
        method: 'post',
        data: data
    })
}

// 验证设备标识
export function checkDevice(deviceId) {
    const data = {
        id: deviceId
    }
    return request({
        url: '/management/sysDevice/checkDevice',
        headers: {
            isToken: false,
            tenantid: piniaStore.userStore.getTenantId,
        },
        method: 'post',
        data: data
    })
}

// 登录方法
export function sysLogin(username, password, captchaVerification) {
    const data = {
        username,
        password,
        captchaVerification
    }
    return request({
        url: '/management/auth/login',
        headers: {
            isToken: false,
            tenantid: piniaStore.userStore.getTenantId,
            // deviceid: piniaStore.userStore.deviceId,
        },
        method: 'post',
        data: data
    })
}

// 注册方法
export function register(data) {
    return request({
        url: '/management/auth/register',
        headers: {
            isToken: false,
            tenantid: piniaStore.userStore.getTenantId,
        },
        method: 'post',
        data: data
    })
}

// 获取用户详细信息
export function getInfo() {
    return request({
        url: '/management/sysUser/getCurrentLoginUser',
        method: 'get'
    })
}

// 退出方法
export function logout() {
    return request({
        url: '/management/auth/logout',
        method: 'post'
    })
}
