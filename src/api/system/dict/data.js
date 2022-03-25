import request from '@/utils/request'

// 查询字典数据列表
export function listData(query) {
    return request({
        url: '/system/dict/data/list',
        method: 'get',
        params: query
    })
}

// 查询字典数据详细
export function getData(id) {
    return request({
        url: '/system/dict/data/getDetails',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
    return request({
        url: '/system/dict/data/listByDictType',
        method: 'get',
        params: {
            dictType: dictType
        }
    })
}

// 新增字典数据
export function addData(data) {
    return request({
        url: '/system/dict/data/add',
        method: 'post',
        data: data
    })
}

// 修改字典数据
export function updateData(data) {
    return request({
        url: '/system/dict/data/edit',
        method: 'post',
        data: data
    })
}

// 删除字典数据
export function delData(dictCodes) {
    return request({
        url: '/system/dict/data/deleteByDictCodeP',
        method: 'post',
        params: {
            dictCodes: dictCodes
        }
    })
}
