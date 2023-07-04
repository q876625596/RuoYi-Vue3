import request from '@/utils/request'

// 查询支付配置列表
export function getPayConfigListRequest(query) {
    return request({
        url: '/management/payConfig/getPayConfigList',
        method: 'get',
        params: query
    })
}

// 查询支付配置详细
export function getPayConfigRequest(id) {
    return request({
        url: '/management/payConfig/getPayConfig',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 新增支付配置
export function addPayConfigRequest(data) {
    return request({
        url: '/management/payConfig/addPayConfig',
        method: 'post',
        data: data
    })
}

// 修改支付配置
export function editPayConfigRequest(data) {
    return request({
        url: '/management/payConfig/editPayConfig',
        method: 'post',
        data: data
    })
}

// 删除支付配置
export function deletePayConfigRequest(idList) {
    return request({
        url: '/management/payConfig/deletePayConfig',
        method: 'post',
        data: {
            idList: idList
        }
    })
}

// 启用/禁用支付配置
export function disablePayConfigRequest(data) {
    return request({
        url: '/management/payConfig/disablePayConfig',
        method: 'post',
        data: data
    })
}
