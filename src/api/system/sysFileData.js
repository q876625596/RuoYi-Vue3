import request from '@/utils/request'

// 查询文件管理列表
export function getSysFileDataListRequest(query) {
    return request({
        url: '/management/sysFileData/getSysFileDataList',
        method: 'get',
        params: query
    })
}

// 新增文件管理
export function addSysFileDataRequest(data) {
    return request({
        url: '/management/sysFileData/addSysFileData',
        method: 'post',
        data: data
    })
}

// 删除文件管理
export function deleteSysFileDataByIdsRequest(idList) {
    return request({
            url: '/management/sysFileData/deleteSysFileData',
        method: 'post',
        data: {
            idList: idList
        }
    })
}

