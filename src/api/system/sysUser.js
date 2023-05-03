import request from '@/utils/request'

// 查询用户列表
export function listUser(query) {
    return request({
        url: '/management/sysUser/list',
        method: 'get',
        params: query
    })
}

// 查询用户详细
export function getUser(userId) {
    return request({
        url: '/management/sysUser/getUserInfoById',
        method: 'get',
        params: {
            id: userId
        }
    })
}

// 新增用户
export function addUser(data) {
    return request({
        url: '/management/sysUser/add',
        method: 'post',
        data: data
    })
}

// 修改用户
export function updateUser(data) {
    return request({
        url: '/management/sysUser/edit',
        method: 'post',
        data: data
    })
}

// 删除用户
export function delUser(userIdList) {
    return request({
        url: '/management/sysUser/deleteByIdListL',
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
        url: '/management/sysUser/resetPwd',
        method: 'post',
        data: data
    })
}

// 用户状态修改
export function changeUserStatus(userId, disableFlag) {
    const data = {
        id: userId,
        disableFlag: disableFlag
    }
    return request({
        url: '/management/sysUser/changeStatus',
        method: 'post',
        data: data
    })
}

// 查询用户个人信息
export function getUserProfile() {
    return request({
        url: '/management/sysUserProfile/getProfile',
        method: 'get'
    })
}

// 修改用户个人信息
export function updateUserProfile(data) {
    return request({
        url: '/management/sysUserProfile/editProfile',
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
        url: '/management/sysUserProfile/updatePwd',
        method: 'post',
        data: data
    })
}

// 用户头像上传
export function uploadAvatar(data) {
    return request({
        url: '/management/sysUserProfile/avatar',
        method: 'post',
        data: data
    })
}

// 查询授权角色
export function getAuthRole(userId) {
    return request({
        url: '/management/sysUser/getAuthRoleByUserId',
        method: 'post',
        data: {
            id: userId
        }
    })
}

// 保存授权角色
export function updateAuthRole(data) {
    return request({
        url: '/management/sysUser/setAuthRole',
        method: 'post',
        data: data
    })
}
