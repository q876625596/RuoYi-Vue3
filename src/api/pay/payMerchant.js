import request from '@/utils/request'

// 查询主支付商户列表
export function getMainPayMerchantListRequest(query) {
    return request({
        url: '/pay/payMerchant/getMainPayMerchantList',
        method: 'get',
        params: query
    })
}
// 查询子支付商户列表
export function getSubPayMerchantListRequest(query) {
    return request({
        url: '/pay/payMerchant/getSubPayMerchantList',
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
export function deletePayMerchantByIdsRequest(idList) {
    return request({
        url: '/pay/payMerchant/deletePayMerchantByIdListP',
        method: 'post',
        data: {
            idList: idList
        }
    })
}

// 修改支付商户状态
export function disablePayMerchantRequest(data) {
    return request({
        url: '/pay/payMerchant/disablePayMerchant',
        method: 'post',
        data: data
    })
}

// 支付商户适用范围
export function bindPayMerchantScopeRequest(data) {
    return request({
        url: '/pay/payMerchant/bindPayMerchantScope',
        method: 'post',
        data: data
    })
}
