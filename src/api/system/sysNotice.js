import request from '@/utils/request'

// 查询公告列表
export function listNotice(query) {
    return request({
        url: '/system/sysNotice/list',
        method: 'get',
        params: query
    })
}

// 查询公告详细
export function getNotice(id) {
    return request({
        url: '/system/sysNotice/getDetails',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 新增公告
export function addNotice(data) {
    return request({
        url: '/system/sysNotice/add',
        method: 'post',
        data: data
    })
}

// 修改公告
export function updateNotice(data) {
    return request({
        url: '/system/sysNotice/edit',
        method: 'post',
        data: data
    })
}

// 删除公告
export function delNotice(ids) {
    return request({
        url: '/system/sysNotice/deleteByIdsP',
        method: 'post',
        params: {
            ids: ids
        }
    })
}
