import request from '@/utils/request'

// 查询在线用户列表
export function list(data) {
    return request({
        url: '/system/sysOnline/list',
        method: 'get',
        query: data
    })
}

// 强退用户
export function forceLogout(tokenId) {
    return request({
        url: '/system/sysOnline/forceLogout',
        method: 'post',
        data: {
            token: tokenId
        }
    })
}
