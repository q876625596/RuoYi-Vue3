import request from '@/utils/request'

// 查询支付记录列表
export function getPayRecordListRequest(query) {
    return request({
        url: '/management/payRecord/getPayRecordList',
        method: 'get',
        params: query
    })
}

// 查询支付记录详细
export function getPayRecordRequest(id) {
    return request({
        url: '/management/payRecord/getPayRecord',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 查询退款记录列表
export function getRefundRecordListByPayRecordIdRequest(payRecordId) {
    return request({
        url: '/management/payRecord/getRefundRecordListByPayRecordId',
        method: 'get',
        params: {
            payRecordId: payRecordId
        }
    })
}


