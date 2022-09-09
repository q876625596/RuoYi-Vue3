import request from '@/utils/request'

// 查询角色列表
export function listRole(data) {
    return request({
        url: '/system/sysRole/list',
        method: 'post',
        data: data
    })
}

// 查询角色详细
export function getRole(id) {
    return request({
        url: '/system/sysRole/getDetails',
        method: 'post',
        data: {
            id: id
        }
    })
}

// 新增角色
export function addRole(data) {
    return request({
        url: '/system/sysRole/add',
        method: 'post',
        data: data
    })
}

// 修改角色
export function updateRole(data) {
    return request({
        url: '/system/sysRole/edit',
        method: 'post',
        data: data
    })
}

// 角色数据权限
export function dataScope(data) {
    return request({
        url: '/system/sysRole/dataScope',
        method: 'post',
        data: data
    })
}

// 角色状态修改
export function changeRoleStatus(roleId, roleKey, status) {
    const data = {
        roleId,
        roleKey,
        status
    }
    return request({
        url: '/system/sysRole/changeStatus',
        method: 'post',
        data: data
    })
}

// 删除角色
export function delRole(idList) {
    return request({
        url: '/system/sysRole/deleteByIdListL',
        method: 'post',
        data: {
            idList: idList
        }
    })
}

// 查询角色已授权用户列表
export function allocatedUserList(data) {
    return request({
        url: '/system/sysRole/authUser/allocatedList',
        method: 'post',
        data: data
    })
}

// 查询角色未授权用户列表
export function unallocatedUserList(data) {
    return request({
        url: '/system/sysRole/authUser/unallocatedList',
        method: 'post',
        data: data
    })
}

// 取消用户授权角色
export function authUserCancel(data) {
    return request({
        url: '/system/sysRole/authUser/cancel',
        method: 'post',
        data: data
    })
}

// 批量取消用户授权角色
export function authUserCancelAll(data) {
    return request({
        url: '/system/sysRole/authUser/cancelAll',
        method: 'post',
        data: data
    })
}

// 授权用户选择
export function authUserSelectAll(data) {
    return request({
        url: '/system/sysRole/authUser/selectAll',
        method: 'post',
        data: data
    })
}
