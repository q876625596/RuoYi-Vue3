import request from '@/utils/request'

// 查询字典类型列表
export function listType(query) {
    return request({
        url: '/management/sysDictType/getSysDictTypeList',
        method: 'get',
        params: query
    })
}

// 查询字典类型详细
export function getType(id) {
    return request({
        url: '/management/sysDictType/getSysDictType',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 新增字典类型
export function addType(data) {
    return request({
        url: '/management/sysDictType/addSysDictType',
        method: 'post',
        data: data
    })
}

// 修改字典类型
export function updateType(data) {
    return request({
        url: '/management/sysDictType/editSysDictType',
        method: 'post',
        data: data
    })
}

// 删除字典类型
export function delType(idList) {
    return request({
        url: '/management/sysDictType/deleteSysDictType',
        method: 'post',
        data: {
            idList: idList
        }
    })
}

// 刷新字典缓存
export function refreshCache() {
    return request({
        url: '/management/sysDictType/refreshDictCache',
        method: 'post'
    })
}

// 获取字典选择框列表
export function optionSelect() {
    return request({
        url: '/management/sysDictType/getSysDictTypeSelect',
        method: 'get'
    })
}
