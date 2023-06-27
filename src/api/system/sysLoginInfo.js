import request from '@/utils/request'

// 查询登录日志列表
export function list(query) {
    return request({
        url: '/management/sysLoginInfo/getSysLoginInfoList',
        method: 'get',
        params: query
    })
}

// 删除登录日志
export function delLoginInfo(idList) {
    return request({
        url: '/management/sysLoginInfo/deleteSysLoginInfo',
        method: 'post',
        data: {
            idList: idList
        }
    })
}

// 解锁用户登录状态
export function unlockAccount(username) {
    return request({
        url: '/monitor/sysLoginInfo/unlockAccount',
        method: 'post',
        data: {
            username: username
        }
    })
}

// 清空登录日志
export function cleanLoginInfo() {
    return request({
        url: '/management/sysLoginInfo/cleanSysLoginInfo',
        method: 'post'
    })
}
