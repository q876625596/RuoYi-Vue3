import request from '@/utils/request'

// 查询正式会员列表
export function getCrmMemberMainListRequest(query) {
    return request({
        url: '/management/crmMemberMain/getCrmMemberMainList',
        method: 'get',
        params: query
    })
}

// 查询正式会员详细
export function getCrmMemberMainDetailsRequest(id) {
    return request({
        url: '/management/crmMemberMain/getCrmMemberMainDetails',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 新增正式会员
export function addCrmMemberMainRequest(data) {
    return request({
        url: '/management/crmMemberMain/addCrmMemberMain',
        method: 'post',
        data: data
    })
}

// 修改正式会员
export function editCrmMemberMainRequest(data) {
    return request({
        url: '/management/crmMemberMain/editCrmMemberMain',
        method: 'post',
        data: data
    })
}

// 删除正式会员
export function deleteCrmMemberMainByIdsRequest(idList) {
    return request({
            url: '/management/crmMemberMain/deleteCrmMemberMainByIdListP',
        method: 'post',
        data: {
            idList: idList
        }
    })
}

