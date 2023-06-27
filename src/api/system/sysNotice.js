import request from '@/utils/request'

// 查询公告列表
export function listNotice(query) {
    return request({
        url: '/management/sysNotice/getSysNoticeList',
        method: 'get',
        params: query
    })
}

// 查询公告详细
export function getNotice(id) {
    return request({
        url: '/management/sysNotice/getSysNotice',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 新增公告
export function addNotice(data) {
    return request({
        url: '/management/sysNotice/addSysNotice',
        method: 'post',
        data: data
    })
}

// 修改公告
export function updateNotice(data) {
    return request({
        url: '/management/sysNotice/editSysNotice',
        method: 'post',
        data: data
    })
}

// 删除公告
export function delNotice(idList) {
    return request({
        url: '/management/sysNotice/deleteSysNotice',
        method: 'post',
        data: {
            idList: idList
        }
    })
}
