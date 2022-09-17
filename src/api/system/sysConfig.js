import request from '@/utils/request'

// 查询参数列表
export function listConfig(query) {
    return request({
        url: '/system/sysConfig/list',
        method: 'get',
        params: query
    })
}

// 查询参数详细
export function getConfig(configId) {
    return request({
        url: '/system/sysConfig/getDetails',
        method: 'get',
        params: {
            id: configId
        }
    })
}

// 新增参数配置
export function addConfig(data) {
    return request({
        url: '/system/sysConfig/add',
        method: 'post',
        data: data
    })
}

// 修改参数配置
export function updateConfig(data) {
    return request({
        url: '/system/sysConfig/edit',
        method: 'post',
        data: data
    })
}

// 删除参数配置
export function delConfig(idList) {
    return request({
        url: '/system/sysConfig/deleteByIdListP',
        method: 'post',
        data: {
            idList: idList
        }
    })
}

// 刷新参数缓存
export function refreshCache() {
    return request({
        url: '/system/sysConfig/refreshCache',
        method: 'post'
    })
}
