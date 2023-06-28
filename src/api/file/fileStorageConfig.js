import request from '@/utils/request'

// 查询文件存储配置列表
export function getFileStorageConfigListRequest(query) {
    return request({
        url: '/management/fileStorageConfig/getFileStorageConfigList',
        method: 'get',
        params: query
    })
}

// 查询文件存储配置列表
export function getFileStorageConfigSelectRequest() {
    return request({
        url: '/management/fileStorageConfig/getFileStorageConfigSelect',
        method: 'get'
    })
}

// 查询文件存储配置详细
export function getFileStorageConfigRequest(id) {
    return request({
        url: '/management/fileStorageConfig/getFileStorageConfig',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 新增文件存储配置
export function addFileStorageConfigRequest(data) {
    return request({
        url: '/management/fileStorageConfig/addFileStorageConfig',
        method: 'post',
        data: data
    })
}

// 修改文件存储配置
export function editFileStorageConfigRequest(data) {
    return request({
        url: '/management/fileStorageConfig/editFileStorageConfig',
        method: 'post',
        data: data
    })
}

// 删除文件存储配置
export function deleteFileStorageConfigRequest(idList) {
    return request({
        url: '/management/fileStorageConfig/deleteFileStorageConfig',
        method: 'post',
        data: {
            idList: idList
        }
    })
}

