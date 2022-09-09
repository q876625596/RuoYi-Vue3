import request from '@/utils/request'

// 查询用户列表
export function listUser(data) {
    return request({
        url: '/system/sysUser/list',
        method: 'post',
        data: data
    })
}

// 查询用户详细
export function getUser(userId) {
    return request({
        url: '/system/sysUser/getUserInfoById',
        method: 'post',
        data: {
            id: userId
        }
    })
}

// 新增用户
export function addUser(data) {
    return request({
        url: '/system/sysUser/add',
        method: 'post',
        data: data
    })
}

// 修改用户
export function updateUser(data) {
    return request({
        url: '/system/sysUser/edit',
        method: 'post',
        data: data
    })
}

// 删除用户
export function delUser(userIdList) {
    return request({
        url: '/system/sysUser/deleteByIdListL',
        method: 'post',
        data: {
            idList: userIdList
        }
    })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
    const data = {
        userId,
        password
    }
    return request({
        url: '/system/sysUser/resetPwd',
        method: 'post',
        data: data
    })
}

// 用户状态修改
export function changeUserStatus(userId, disableFlag) {
    const data = {
        userId: userId,
        status: disableFlag
    }
    return request({
        url: '/system/sysUser/changeStatus',
        method: 'post',
        data: data
    })
}

// 查询用户个人信息
export function getUserProfile() {
    return request({
        url: '/system/sysUserProfile/getProfile',
        method: 'post'
    })
}

// 修改用户个人信息
export function updateUserProfile(data) {
    return request({
        url: '/system/sysUserProfile/editProfile',
        method: 'post',
        data: data
    })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
    const data = {
        oldPassword,
        newPassword
    }
    return request({
        url: '/system/sysUserProfile/updatePwd',
        method: 'post',
        data: data
    })
}

// 用户头像上传
export function uploadAvatar(data) {
    return request({
        url: '/system/sysUserProfile/avatar',
        method: 'post',
        data: data
    })
}

// 查询授权角色
export function getAuthRole(userId) {
    return request({
        url: '/system/sysUser/getAuthRoleByUserId',
        method: 'post',
        data: {
            id: userId
        }
    })
}

// 保存授权角色
export function updateAuthRole(data) {
    return request({
        url: '/system/sysUser/setAuthRole',
        method: 'post',
        data: data
    })
}
