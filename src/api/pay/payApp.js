import request from '@/utils/request'

// 查询支付应用列表
export function getPayAppListRequest(query) {
    return request({
        url: '/pay/payApp/getPayAppList',
        method: 'get',
        params: query
    })
}

// 查询支付应用详细
export function getPayAppDetailsRequest(id) {
    return request({
        url: '/pay/payApp/getPayAppDetails',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 绑定支付应用配置
export function bindPayAppConfigRequest(data) {
    return request({
        url: '/pay/payApp/bindPayAppConfig',
        method: 'post',
        data: data
    })
}
// 新增支付应用
export function addPayAppRequest(data) {
    return request({
        url: '/pay/payApp/addPayApp',
        method: 'post',
        data: data
    })
}

// 修改支付应用
export function editPayAppRequest(data) {
    return request({
        url: '/pay/payApp/editPayApp',
        method: 'post',
        data: data
    })
}

// 删除支付应用
export function deletePayAppByIdsRequest(idList) {
    return request({
            url: '/pay/payApp/deletePayAppByIdListP',
        method: 'post',
        data: {
            idList: idList
        }
    })
}

// 启用/禁用支付应用
export function disablePayAppRequest(data) {
    return request({
        url: '/pay/payApp/disablePayApp',
        method: 'post',
        data: data
    })
}
