import request from '@/utils/request'

// 查询文件管理列表
export function getFileDataListRequest(query) {
    return request({
        url: '/management/fileData/getFileDataList',
        method: 'get',
        params: query
    })
}

// 新增文件管理
export function addFileDataRequest(data) {
    return request({
        url: '/management/fileData/addFileData',
        method: 'post',
        data: data
    })
}

// 删除文件管理
export function deleteFileDataByIdsRequest(idList) {
    return request({
            url: '/management/fileData/deleteFileData',
        method: 'post',
        data: {
            idList: idList
        }
    })
}

