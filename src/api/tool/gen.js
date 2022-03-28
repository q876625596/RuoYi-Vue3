import request from '@/utils/request'

// 查询生成表数据
export function listTable(query) {
    return request({
        url: '/code/gen/list',
        method: 'get',
        params: query
    })
}

// 查询db数据库列表
export function listDbTable(query) {
    return request({
        url: '/code/gen/db/list',
        method: 'get',
        params: query
    })
}

// 查询表详细信息
export function getGenTable(tableId) {
    return request({
        url: '/code/gen/getInfo',
        method: 'get',
        params: {
            tableId: tableId
        }
    })
}

// 修改代码生成信息
export function updateGenTable(data) {
    return request({
        url: '/code/gen/editSave',
        method: 'post',
        data: data
    })
}

// 导入表
export function importTable(data) {
    return request({
        url: '/code/gen/importTable',
        method: 'post',
        data: data
    })
}

// 预览生成代码
export function previewTable(tableId) {
    return request({
        url: '/code/gen/preview',
        method: 'get',
        params: {
            tableId: tableId
        }
    })
}

// 删除表数据
export function delTable(tableIds) {
    return request({
        url: '/code/gen/physicalDelete',
        method: 'post',
        data: tableIds
    })
}

// 生成代码（自定义路径）
export function genCode(tableId) {
    return request({
        url: '/code/gen/genCode',
        method: 'get',
        params:{
            tableId : tableId
        }
    })
}

// 同步数据库
export function syncDb(databaseName, tableName) {
    return request({
        url: '/code/gen/syncDb',
        method: 'get',
        params: {
            databaseName: databaseName,
            tableName: tableName
        }
    })
}
