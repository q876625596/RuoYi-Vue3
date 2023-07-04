import request from '@/utils/request'

// 查询子商户列表
export function getPaySubMerchantListRequest(query) {
    return request({
        url: '/management/paySubMerchant/getPaySubMerchantList',
        method: 'get',
        params: query
    })
}

// 查询子商户详细
export function getPaySubMerchantRequest(id) {
    return request({
        url: '/management/paySubMerchant/getPaySubMerchant',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 新增子商户
export function addPaySubMerchantRequest(data) {
    return request({
        url: '/management/paySubMerchant/addPaySubMerchant',
        method: 'post',
        data: data
    })
}

// 修改子商户
export function editPaySubMerchantRequest(data) {
    return request({
        url: '/management/paySubMerchant/editPaySubMerchant',
        method: 'post',
        data: data
    })
}

// 删除子商户
export function deletePaySubMerchantRequest(idList) {
    return request({
        url: '/management/paySubMerchant/deletePaySubMerchant',
        method: 'post',
        data: {
            idList: idList
        }
    })
}

// 启用/禁用子商户
export function disablePaySubMerchantRequest(data) {
    return request({
        url: '/management/paySubMerchant/disablePaySubMerchant',
        method: 'post',
        data: data
    })
}
