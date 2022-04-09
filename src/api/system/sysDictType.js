import request from '@/utils/request'

// 查询字典类型列表
export function listType(query) {
    return request({
        url: '/system/sysDictType/list',
        method: 'get',
        params: query
    })
}

// 查询字典类型详细
export function getType(id) {
    return request({
        url: '/system/sysDictType/getDetails',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 新增字典类型
export function addType(data) {
    return request({
        url: '/system/sysDictType/add',
        method: 'post',
        data: data
    })
}

// 修改字典类型
export function updateType(data) {
    return request({
        url: '/system/sysDictType/edit',
        method: 'post',
        data: data
    })
}

// 删除字典类型
export function delType(ids) {
    return request({
        url: '/system/sysDictType/deleteByIdsP',
        method: 'post',
        params: {
            ids: ids
        }
    })
}

// 刷新字典缓存
export function refreshCache() {
    return request({
        url: '/system/sysDictType/refreshCache',
        method: 'post'
    })
}

// 获取字典选择框列表
export function optionSelect() {
    return request({
        url: '/system/sysDictType/optionSelect',
        method: 'get'
    })
}
