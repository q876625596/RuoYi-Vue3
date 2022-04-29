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
export function getSysTenantDetailsRequest(id) {
  return request({
    url: '/system/sysTenant/getSysTenantDetails',
    method: 'get',
    params: {
        id: id
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
export function deleteSysTenantByIdsRequest(ids) {
  return request({
    url: '/system/sysTenant/deleteSysTenantByIdsP',
    method: 'post',
    params: {
        ids: ids
    }
  })
}
