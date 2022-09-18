import request from '@/utils/request'

// 查询全部系统租户列表
export function getAllSysTenantForSelectRequest() {
    return request({
        url: '/system/sysTenant/getAllSysTenantForSelect',
        method: 'get',
    })
}

// 查询系统租户列表
export function getSysTenantListRequest(query) {
    return request({
        url: '/system/sysTenant/getSysTenantList',
        method: 'get',
        params: query
    })
}

// 查询系统租户详细
export function getSysTenantDetailsRequest(tenantId) {
    return request({
        url: '/system/sysTenant/getSysTenantDetails',
        method: 'get',
        params: {
            id: tenantId
        }
    })
}

// 查询租户配置
export function getSysTenantConfigRequest(tenantId) {
    return request({
        url: '/system/sysTenant/getSysTenantConfig',
        method: 'get',
        params: {
            id: tenantId
        }
    })
}

// 初始化租户配置
export function initSysTenantConfigRequest(data) {
    return request({
        url: '/system/sysTenant/initSysTenantConfig',
        method: 'post',
        data: data
    })
}

// 修改租户配置
export function editSysTenantConfigRequest(data) {
    return request({
        url: '/system/sysTenant/editSysTenantConfig',
        method: 'post',
        data: data
    })
}

// 重置超管用户密码
export function resetAdminPwd(tenantId, userId, password) {
    const data = {
        tenantId,
        userId,
        password
    }
    return request({
        url: '/system/sysTenant/resetAdminPwd',
        method: 'post',
        data: data
    })
}

// 新增系统租户
export function addSysTenantRequest(data) {
    return request({
        url: '/system/sysTenant/addSysTenant',
        method: 'post',
        data: data
    })
}

// 修改系统租户
export function editSysTenantRequest(data) {
    return request({
        url: '/system/sysTenant/editSysTenant',
        method: 'post',
        data: data
    })
}

// 启用/禁用系统租户
export function disableSysTenantRequest(data) {
    return request({
        url: '/system/sysTenant/disableSysTenant',
        method: 'post',
        data: data
    })
}

// 删除系统租户
export function deleteSysTenantByIdsRequest(tenantIdList) {
    return request({
        url: '/system/sysTenant/deleteSysTenantByIdListP',
        method: 'post',
        data: {
            idList: tenantIdList
        }
    })
}
