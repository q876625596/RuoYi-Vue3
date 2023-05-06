import request from '@/utils/request'

// 查询平台会员列表
export function getCrmMemberThirdListRequest(query) {
    return request({
        url: '/management/crmMemberThird/getCrmMemberThirdList',
        method: 'get',
        params: query
    })
}

// 查询平台会员详细
export function getCrmMemberThirdDetailsRequest(id) {
    return request({
        url: '/management/crmMemberThird/getCrmMemberThirdDetails',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 新增平台会员
export function addCrmMemberThirdRequest(data) {
    return request({
        url: '/management/crmMemberThird/addCrmMemberThird',
        method: 'post',
        data: data
    })
}

// 修改平台会员
export function editCrmMemberThirdRequest(data) {
    return request({
        url: '/management/crmMemberThird/editCrmMemberThird',
        method: 'post',
        data: data
    })
}

// 删除平台会员
export function deleteCrmMemberThirdByIdsRequest(idList) {
    return request({
            url: '/management/crmMemberThird/deleteCrmMemberThirdByIdListP',
        method: 'post',
        data: {
            idList: idList
        }
    })
}

