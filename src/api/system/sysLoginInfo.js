import request from '@/utils/request'

// 查询登录日志列表
export function list(query) {
    return request({
        url: '/management/sysLoginInfo/list',
        method: 'get',
        params: query
    })
}

// 删除登录日志
export function delLoginInfo(idList) {
    return request({
        url: '/management/sysLoginInfo/deleteByIdsP',
        method: 'post',
        data: {
            idList: idList
        }
    })
}

// 解锁用户登录状态
export function unlockLoginInfo(username) {
    return request({
        url: '/monitor/sysLoginInfo/unlock',
        method: 'post',
        data: {
            username: username
        }
    })
}

// 清空登录日志
export function cleanLoginInfo() {
    return request({
        url: '/management/sysLoginInfo/clean',
        method: 'post'
    })
}
