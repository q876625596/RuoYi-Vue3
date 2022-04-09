import request from '@/utils/request'

// 查询登录日志列表
export function list(query) {
  return request({
    url: '/system/sysLoginInfo/list',
    method: 'get',
    params: query
  })
}

// 删除登录日志
export function delLoginInfo(ids) {
  return request({
    url: '/system/sysLoginInfo/deleteByIdsP',
    method: 'post',
    params:{
      ids:ids
    }
  })
}

// 清空登录日志
export function cleanLoginInfo() {
  return request({
    url: '/system/sysLoginInfo/clean',
    method: 'post'
  })
}
