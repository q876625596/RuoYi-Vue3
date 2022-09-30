import request from '@/utils/request'

// 查询系统设备列表
export function getSysDeviceListRequest(query) {
    return request({
        url: '/system/sysDevice/getSysDeviceList',
        method: 'get',
        params: query
    })
}

// 查询系统设备详细
export function getSysDeviceDetailsRequest(id) {
    return request({
        url: '/system/sysDevice/getSysDeviceDetails',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 新增系统设备
export function addSysDeviceRequest(data) {
    return request({
        url: '/system/sysDevice/addSysDevice',
        method: 'post',
        data: data
    })
}

// 修改系统设备
export function editSysDeviceRequest(data) {
    return request({
        url: '/system/sysDevice/editSysDevice',
        method: 'post',
        data: data
    })
}

// 删除系统设备
export function deleteSysDeviceByIdsRequest(idList) {
    return request({
            url: '/system/sysDevice/deleteSysDeviceByIdListL',
        method: 'post',
        data: {
            idList: idList
        }
    })
}

// 启用/禁用系统设备
export function disableSysDeviceRequest(data) {
    return request({
        url: '/system/sysDevice/disableSysDevice',
        method: 'post',
        data: data
    })
}
