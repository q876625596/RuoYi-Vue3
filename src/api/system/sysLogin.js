import request from '@/utils/request'

// 登录方法
export function sysLogin(data) {
    return request({
        url: '/management/auth/login',
        headers: {
            isToken: false,
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
