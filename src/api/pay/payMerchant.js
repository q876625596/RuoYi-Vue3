import request from '@/utils/request'

// 查询支付商户列表
export function getPayMerchantListRequest(query) {
  return request({
    url: '/pay/payMerchant/getPayMerchantList',
    method: 'get',
    params: query
  })
}
// 查询全部支付商户列表
export function getPayMerchantListForSelectRequest() {
  return request({
    url: '/pay/payMerchant/getPayMerchantListForSelect',
    method: 'get'
  })
}

// 查询支付商户详细
export function getPayMerchantDetailsRequest(id) {
  return request({
    url: '/pay/payMerchant/getPayMerchantDetails',
    method: 'get',
    params: {
        id: id
    }
  })
}

// 新增支付商户
export function addPayMerchantRequest(data) {
  return request({
    url: '/pay/payMerchant/addPayMerchant',
    method: 'post',
    data: data
  })
}

// 修改支付商户
export function editPayMerchantRequest(data) {
  return request({
    url: '/pay/payMerchant/editPayMerchant',
    method: 'post',
    data: data
  })
}

// 删除支付商户
export function deletePayMerchantByIdsRequest(ids) {
  return request({
    url: '/pay/payMerchant/deletePayMerchantByIdsP',
    method: 'post',
    params: {
        ids: ids
    }
  })
}

// 修改支付商户状态
export function disablePayMerchantRequest(data) {
  return request({
    url: '/pay/payMerchant/disablePayMerchant',
    method: 'post',
    params: data
  })
}
