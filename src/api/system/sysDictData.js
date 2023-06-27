import request from '@/utils/request'

// 查询字典数据列表
export function listData(query) {
    return request({
        url: '/management/sysDictData/getSysDictDataList',
        method: 'get',
        params: query
    })
}

// 查询字典数据详细
export function getData(id) {
    return request({
        url: '/management/sysDictData/getSysDictData',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
    return request({
        url: '/management/sysDictData/getSysDictDataListByDictType',
        method: 'get',
        params: {
            type: dictType
        }
    })
}

// 新增字典数据
export function addData(data) {
    return request({
        url: '/management/sysDictData/addSysDictData',
        method: 'post',
        data: data
    })
}

// 修改字典数据
export function updateData(data) {
    return request({
        url: '/management/sysDictData/editSysDictData',
        method: 'post',
        data: data
    })
}

// 删除字典数据
export function delData(idList) {
    return request({
        url: '/management/sysDictData/deleteSysDictData',
        method: 'post',
        data: {
            idList: idList
        }
    })
}
