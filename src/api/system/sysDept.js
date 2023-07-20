import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
    return request({
        url: '/management/sysDept/getSysDeptList',
        method: 'get',
        params: query
    })
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(id) {
    return request({
        url: '/management/sysDept/getSysDeptListExcludeId',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 查询部门详细
export function getDept(id) {
    return request({
        url: '/management/sysDept/getSysDept',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 查询部门下拉树结构
export function deptTreeSelect() {
    return request({
        url: '/management/sysDept/getSysDeptTreeList',
        method: 'get'
    })
}

// 根据角色ID查询部门树结构
export function deptTreeSelectByRoleId(roleId) {
    return request({
        url: '/management/sysDept/getSysDeptTreeListByRoleId',
        method: 'get',
        params: {
            roleId: roleId
        }
    })
}

// 新增部门
export function addDept(data) {
    return request({
        url: '/management/sysDept/addSysDept',
        method: 'post',
        data: data
    })
}

// 修改部门
export function updateDept(data) {
    return request({
        url: '/management/sysDept/editSysDept',
        method: 'post',
        data: data
    })
}

// 删除部门
export function delDept(id) {
    return request({
        url: '/management/sysDept/deleteSysDept',
        method: 'post',
        data: {
            id: id
        }
    })
}
