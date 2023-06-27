import request from '@/utils/request'

// 查询岗位列表
export function listPost(query) {
    return request({
        url: '/management/sysPost/getSysPostList',
        method: 'get',
        params: query
    })
}

// 查询岗位详细
export function getPost(id) {
    return request({
        url: '/management/sysPost/getSysPost',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 新增岗位
export function addPost(data) {
    return request({
        url: '/management/sysPost/addSysPost',
        method: 'post',
        data: data
    })
}

// 修改岗位
export function updatePost(data) {
    return request({
        url: '/management/sysPost/editSysPost',
        method: 'post',
        data: data
    })
}

// 删除岗位
export function delPost(idList) {
    return request({
        url: '/management/sysPost/deleteSysPost',
        method: 'post',
        data: {
            idList: idList
        }
    })
}
