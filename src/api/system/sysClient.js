import request from '@/utils/request'

// 查询客户端信息列表
export function getSysClientListRequest(query) {
    return request({
        url: '/management/sysClient/getSysClientList',
        method: 'get',
        params: query
    })
}

// 查询客户端信息详细
export function getSysClientDetailsRequest(id) {
    return request({
        url: '/management/sysClient/getSysClientDetails',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 新增客户端信息
export function addSysClientRequest(data) {
    return request({
        url: '/management/sysClient/addSysClient',
        method: 'post',
        data: data
    })
}

// 修改客户端信息
export function editSysClientRequest(data) {
    return request({
        url: '/management/sysClient/editSysClient',
        method: 'post',
        data: data
    })
}

// 删除客户端信息
export function deleteSysClientByIdsRequest(idList) {
    return request({
            url: '/management/sysClient/deleteSysClientByIdListP',
        method: 'post',
        data: {
            idList: idList
        }
    })
}

// 启用/禁用客户端信息
export function disableSysClientRequest(data) {
    return request({
        url: '/management/sysClient/disableSysClient',
        method: 'post',
        data: data
    })
}
