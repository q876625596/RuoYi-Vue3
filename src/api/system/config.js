import request from '@/utils/request'

// 查询参数列表
export function listConfig(query) {
    return request({
        url: '/system/config/list',
        method: 'get',
        params: query
    })
}

// 查询参数详细
export function getConfig(configId) {
    return request({
        url: '/system/config/getDetails',
        method: 'get',
        params: {
            configId: configId
        }
    })
}

// 根据参数键名查询参数值
export function getConfigKey(configKey) {
    return request({
        url: '/system/config/getConfigValueByConfigKey',
        method: 'get',
        params: {
            configKey: configKey
        }
    })
}

// 新增参数配置
export function addConfig(data) {
    return request({
        url: '/system/config/add',
        method: 'post',
        data: data
    })
}

// 修改参数配置
export function updateConfig(data) {
    return request({
        url: '/system/config/edit',
        method: 'post',
        data: data
    })
}

// 删除参数配置
export function delConfig(ids) {
    return request({
        url: '/system/config/deleteP',
        method: 'post',
        params: {
            ids: ids
        }
    })
}

// 刷新参数缓存
export function refreshCache() {
    return request({
        url: '/system/config/refreshCache',
        method: 'post'
    })
}
