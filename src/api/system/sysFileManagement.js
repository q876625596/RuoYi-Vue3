import request from '@/utils/request'

// 查询文件管理列表
export function getSysFileManagementListRequest(query) {
    return request({
        url: '/management/sysFileManagement/getSysFileManagementList',
        method: 'get',
        params: query
    })
}

// 新增文件管理
export function addSysFileManagementRequest(data) {
    return request({
        url: '/management/sysFileManagement/addSysFileManagement',
        method: 'post',
        data: data
    })
}

// 删除文件管理
export function deleteSysFileManagementByIdsRequest(idList) {
    return request({
            url: '/management/sysFileManagement/deleteSysFileManagementByIdListP',
        method: 'post',
        data: {
            idList: idList
        }
    })
}

