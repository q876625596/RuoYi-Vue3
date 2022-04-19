import request from '@/utils/request'

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
        tenantId: tenantId
    }
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

// 删除系统租户
export function deleteSysTenantByTenantIdsRequest(tenantIds) {
  return request({
    url: '/system/sysTenant/deleteSysTenantByTenantIdsP',
    method: 'post',
    params: {
        tenantIds: tenantIds
    }
  })
}
