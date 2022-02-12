/**
 * 字符权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
import {piniaStore} from "@/store/indexStore";

export function checkPermi(value) {
  if (value && value instanceof Array && value.length > 0) {

    const permissionDatas = value
    const all_permission = "*:*:*";

    const hasPermission = piniaStore.userStore.permissions.some(permission => {
      return all_permission === permission || permissionDatas.includes(permission)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like checkPermi="['system:user:add','system:user:edit']"`)
    return false
  }
}

/**
 * 角色权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkRole(value) {
  if (value && value instanceof Array && value.length > 0) {
    const permissionRoles = value
    const super_admin = "admin";

    const hasRole = piniaStore.userStore.roles.some(role => {
      return super_admin === role || permissionRoles.includes(role)
    })

    if (!hasRole) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like checkRole="['admin','editor']"`)
    return false
  }
}
