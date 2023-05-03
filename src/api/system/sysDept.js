import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
    return request({
        url: '/management/sysDept/list',
        method: 'get',
        params: query
    })
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(id) {
    return request({
        url: '/management/sysDept/listExcludeId',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 查询部门详细
export function getDept(id) {
    return request({
        url: '/management/sysDept/getDetails',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 查询部门下拉树结构
export function deptTreeSelect() {
    return request({
        url: '/management/sysDept/deptTreeSelect',
        method: 'get'
    })
}

// 根据角色ID查询部门树结构
export function deptTreeSelectByRoleId(roleId) {
    return request({
        url: '/management/sysDept/deptTreeSelectByRoleId',
        method: 'get',
        params: {
            id: roleId
        }
    })
}

// 新增部门
export function addDept(data) {
    return request({
        url: '/management/sysDept/add',
        method: 'post',
        data: data
    })
}

// 修改部门
export function updateDept(data) {
    return request({
        url: '/management/sysDept/edit',
        method: 'post',
        data: data
    })
}

// 删除部门
export function delDept(id) {
    return request({
        url: '/management/sysDept/deleteByIdL',
        method: 'post',
        data: {
            id: id
        }
    })
}
