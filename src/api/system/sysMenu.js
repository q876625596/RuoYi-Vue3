import request from '@/utils/request'

// 查询菜单列表
export function listMenu(query) {
    return request({
        url: '/system/sysMenu/list',
        method: 'get',
        params: query
    })
}

// 查询菜单详细
export function getMenu(id) {
    return request({
        url: '/system/sysMenu/getDetails',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 查询菜单下拉树结构
export function menuTreeSelect() {
    return request({
        url: '/system/sysMenu/treeSelect',
        method: 'get'
    })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeSelect(roleId) {
    return request({
        url: '/system/sysMenu/roleMenuTreeSelect',
        method: 'get',
        params: {
            roleId: roleId
        }
    })
}

// 新增菜单
export function addMenu(data) {
    return request({
        url: '/system/sysMenu/add',
        method: 'post',
        data: data
    })
}

// 修改菜单
export function updateMenu(data) {
    return request({
        url: '/system/sysMenu/edit',
        method: 'post',
        data: data
    })
}

// 删除菜单
export function delMenu(id) {
    return request({
        url: '/system/sysMenu/deleteP',
        method: 'post',
        params: {
            id: id
        }
    })
}

// 获取路由
export const getRouters = () => {
    return request({
        url: '/system/sysMenu/getRouters',
        method: 'get'
    })
}

