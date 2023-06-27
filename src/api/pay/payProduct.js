import request from '@/utils/request'

// 查询支付应用列表
export function getPayProductListRequest(query) {
    return request({
        url: '/management/payProduct/getPayProductList',
        method: 'get',
        params: query
    })
}

// 查询支付应用详细
export function getPayProductDetailsRequest(id) {
    return request({
        url: '/management/payProduct/getPayProduct',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 新增支付应用
export function addPayProductRequest(data) {
    return request({
        url: '/management/payProduct/addPayProduct',
        method: 'post',
        data: data
    })
}

// 修改支付应用
export function editPayProductRequest(data) {
    return request({
        url: '/management/payProduct/editPayProduct',
        method: 'post',
        data: data
    })
}

// 删除支付应用
export function deletePayProductByIdsRequest(idList) {
    return request({
            url: '/management/payProduct/deletePayProduct',
        method: 'post',
        data: {
            idList: idList
        }
    })
}

// 启用/禁用支付应用
export function disablePayProductRequest(data) {
    return request({
        url: '/management/payProduct/disablePayProduct',
        method: 'post',
        data: data
    })
}
