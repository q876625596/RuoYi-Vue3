import request from '@/utils/request'

// 查询outerSign列表
export function getSysOuterSignListRequest(query) {
    return request({
        url: '/management/sysOuterSign/getSysOuterSignList',
        method: 'get',
        params: query
    })
}

// 查询outerSign详细
export function getSysOuterSignDetailsRequest(id) {
    return request({
        url: '/management/sysOuterSign/getSysOuterSign',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 新增outerSign
export function addSysOuterSignRequest(data) {
    return request({
        url: '/management/sysOuterSign/addSysOuterSign',
        method: 'post',
        data: data
    })
}

// 修改outerSign
export function editSysOuterSignRequest(data) {
    return request({
        url: '/management/sysOuterSign/editSysOuterSign',
        method: 'post',
        data: data
    })
}

// 删除outerSign
export function deleteSysOuterSignByIdsRequest(idList) {
    return request({
            url: '/management/sysOuterSign/deleteSysOuterSign',
        method: 'post',
        data: {
            idList: idList
        }
    })
}

// 启用/禁用outerSign
export function disableSysOuterSignRequest(data) {
    return request({
        url: '/management/sysOuterSign/disableSysOuterSign',
        method: 'post',
        data: data
    })
}
