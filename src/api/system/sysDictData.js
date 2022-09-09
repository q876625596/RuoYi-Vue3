import request from '@/utils/request'

// 查询字典数据列表
export function listData(data) {
    return request({
        url: '/system/sysDictData/list',
        method: 'post',
        data: data
    })
}

// 查询字典数据详细
export function getData(id) {
    return request({
        url: '/system/sysDictData/getDetails',
        method: 'post',
        data: {
            id: id
        }
    })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
    return request({
        url: '/system/sysDictData/listByDictType',
        method: 'post',
        data: {
            type: dictType
        }
    })
}

// 新增字典数据
export function addData(data) {
    return request({
        url: '/system/sysDictData/add',
        method: 'post',
        data: data
    })
}

// 修改字典数据
export function updateData(data) {
    return request({
        url: '/system/sysDictData/edit',
        method: 'post',
        data: data
    })
}

// 删除字典数据
export function delData(idList) {
    return request({
        url: '/system/sysDictData/deleteByIdListP',
        method: 'post',
        data: {
            idList: idList
        }
    })
}
