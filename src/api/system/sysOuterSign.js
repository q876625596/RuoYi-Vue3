import request from '@/utils/request'

// 查询outerSign列表
export function getSysOuterSignListRequest(query) {
    return request({
        url: '/system/sysOuterSign/getSysOuterSignList',
        method: 'get',
        params: query
    })
}

// 查询outerSign详细
export function getSysOuterSignDetailsRequest(id) {
    return request({
        url: '/system/sysOuterSign/getSysOuterSignDetails',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 新增outerSign
export function addSysOuterSignRequest(data) {
    return request({
        url: '/system/sysOuterSign/addSysOuterSign',
        method: 'post',
        data: data
    })
}

// 修改outerSign
export function editSysOuterSignRequest(data) {
    return request({
        url: '/system/sysOuterSign/editSysOuterSign',
        method: 'post',
        data: data
    })
}

// 删除outerSign
export function deleteSysOuterSignByIdsRequest(idList) {
    return request({
            url: '/system/sysOuterSign/deleteSysOuterSignByIdListL',
        method: 'post',
        data: {
            idList: idList
        }
    })
}

// 启用/禁用outerSign
export function disableSysOuterSignRequest(data) {
    return request({
        url: '/system/sysOuterSign/disableSysOuterSign',
        method: 'post',
        data: data
    })
}
