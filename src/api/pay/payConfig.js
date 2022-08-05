import request from '@/utils/request'

// 查询支付配置列表
export function getPayConfigListRequest(query) {
  return request({
    url: '/pay/payConfig/getPayConfigList',
    method: 'get',
    params: query
  })
}

// 查询支付配置详细
export function getPayConfigDetailsRequest(id) {
  return request({
    url: '/pay/payConfig/getPayConfigDetails',
    method: 'get',
    params: {
        id: id
    }
  })
}

// 新增支付配置
export function addPayConfigRequest(data) {
  return request({
    url: '/pay/payConfig/addPayConfig',
    method: 'post',
    data: data
  })
}

// 修改支付配置
export function editPayConfigRequest(data) {
  return request({
    url: '/pay/payConfig/editPayConfig',
    method: 'post',
    data: data
  })
}

// 删除支付配置
export function deletePayConfigByIdsRequest(ids) {
  return request({
    url: '/pay/payConfig/deletePayConfigByIdsP',
    method: 'post',
    params: {
        ids: ids
    }
  })
}
