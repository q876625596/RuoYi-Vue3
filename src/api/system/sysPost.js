import request from '@/utils/request'

// 查询岗位列表
export function listPost(query) {
    return request({
        url: '/management/sysPost/list',
        method: 'get',
        params: query
    })
}

// 查询岗位详细
export function getPost(id) {
    return request({
        url: '/management/sysPost/getDetails',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 新增岗位
export function addPost(data) {
    return request({
        url: '/management/sysPost/add',
        method: 'post',
        data: data
    })
}

// 修改岗位
export function updatePost(data) {
    return request({
        url: '/management/sysPost/edit',
        method: 'post',
        data: data
    })
}

// 删除岗位
export function delPost(idList) {
    return request({
        url: '/management/sysPost/deleteByIdListP',
        method: 'post',
        data: {
            idList: idList
        }
    })
}
