import request from '@/utils/request'

// 查询在线用户列表
export function list(data) {
    return request({
        url: '/management/sysOnline/list',
        method: 'get',
        params: data
    })
}

// 强退用户
export function forceLogout(tokenId) {
    return request({
        url: '/management/sysOnline/forceLogout',
        method: 'post',
        data: {
            token: tokenId
        }
    })
}
