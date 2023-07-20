import request from '@/utils/request'

// 查询菜单列表
export function listMenu(query) {
    return request({
        url: '/management/sysMenu/getSysMenuList',
        method: 'get',
        params: query
    })
}

// 查询菜单详细
export function getMenu(id) {
    return request({
        url: '/management/sysMenu/getSysMenu',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 查询菜单下拉树结构
export function menuTreeSelect() {
    return request({
        url: '/management/sysMenu/getSysMenuTreeList',
        method: 'get'
    })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeSelect(roleId) {
    return request({
        url: '/management/sysMenu/getSysMenuTreeListByRoleId',
        method: 'get',
        params: {
            roleId: roleId
        }
    })
}

// 新增菜单
export function addMenu(data) {
    return request({
        url: '/management/sysMenu/addSysMenu',
        method: 'post',
        data: data
    })
}

// 修改菜单
export function updateMenu(data) {
    return request({
        url: '/management/sysMenu/editSysMenu',
        method: 'post',
        data: data
    })
}

// 删除菜单
export function delMenu(id) {
    return request({
        url: '/management/sysMenu/deleteSysMenu',
        method: 'post',
        data: {
            id: id
        }
    })
}

// 获取路由
export const getRouters = () => {
    return request({
        url: '/management/sysMenu/getRouterList',
        method: 'get'
    })
}

