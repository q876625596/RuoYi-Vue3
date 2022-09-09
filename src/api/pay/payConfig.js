import request from '@/utils/request'

// 查询支付配置列表
export function getPayConfigListRequest(data) {
    return request({
        url: '/pay/payConfig/getPayConfigList',
        method: 'poast',
        data: data
    })
}

// 查询支付配置详细
export function getPayConfigDetailsRequest(id) {
    return request({
        url: '/pay/payConfig/getPayConfigDetails',
        method: 'post',
        data: {
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
export function deletePayConfigByIdsRequest(idList) {
    return request({
        url: '/pay/payConfig/deletePayConfigByIdsP',
        method: 'post',
        data: {
            idList: idList
        }
    })
}

// 启用/禁用支付配置
export function disablePayConfigRequest(data) {
    return request({
        url: '/pay/payConfig/disablePayConfig',
        method: 'post',
        data: data
    })
}
