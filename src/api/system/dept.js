import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
    return request({
        url: '/system/dept/list',
        method: 'get',
        params: query
    })
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(id) {
    return request({
        url: '/system/dept/listExcludeId',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 查询部门详细
export function getDept(deptId) {
    return request({
        url: '/system/dept/' + deptId,
        method: 'get'
    })
}

// 查询部门下拉树结构
export function treeSelect() {
    return request({
        url: '/system/dept/treeSelect',
        method: 'get'
    })
}

// 根据角色ID查询部门树结构
export function roleDeptTreeSelect(roleId) {
    return request({
        url: '/system/dept/roleDeptTreeSelect',
        method: 'get',
        params: {
            roleId: roleId
        }
    })
}

// 新增部门
export function addDept(data) {
    return request({
        url: '/system/dept/add',
        method: 'post',
        data: data
    })
}

// 修改部门
export function updateDept(data) {
    return request({
        url: '/system/dept/edit',
        method: 'post',
        data: data
    })
}

// 删除部门
export function delDept(deptId) {
    return request({
        url: '/system/dept/' + deptId,
        method: 'post'
    })
}
