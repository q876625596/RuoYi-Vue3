import request from '@/utils/request'

// 查询角色列表
export function listRole(query) {
    return request({
        url: '/management/sysRole/list',
        method: 'get',
        params: query
    })
}

// 查询角色详细
export function getRole(id) {
    return request({
        url: '/management/sysRole/getDetails',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 新增角色
export function addRole(data) {
    return request({
        url: '/management/sysRole/add',
        method: 'post',
        data: data
    })
}

// 修改角色
export function updateRole(data) {
    return request({
        url: '/management/sysRole/edit',
        method: 'post',
        data: data
    })
}

// 角色数据权限
export function dataScope(data) {
    return request({
        url: '/management/sysRole/dataScope',
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
        url: '/management/sysRole/changeStatus',
        method: 'post',
        data: data
    })
}

// 删除角色
export function delRole(idList) {
    return request({
        url: '/management/sysRole/deleteByIdListL',
        method: 'post',
        data: {
            idList: idList
        }
    })
}

// 查询角色已授权用户列表
export function allocatedUserList(query) {
    return request({
        url: '/management/sysRole/authUser/allocatedList',
        method: 'get',
        params: query
    })
}

// 查询角色未授权用户列表
export function unallocatedUserList(query) {
    return request({
        url: '/management/sysRole/authUser/unallocatedList',
        method: 'get',
        params: query
    })
}

// 取消用户授权角色
export function authUserCancel(data) {
    return request({
        url: '/management/sysRole/authUser/cancel',
        method: 'post',
        data: data
    })
}

// 批量取消用户授权角色
export function authUserCancelAll(data) {
    return request({
        url: '/management/sysRole/authUser/cancelAll',
        method: 'post',
        data: data
    })
}

// 授权用户选择
export function authUserSelectAll(data) {
    return request({
        url: '/management/sysRole/authUser/selectAll',
        method: 'post',
        data: data
    })
}
