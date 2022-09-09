import request from '@/utils/request'

// 查询登录日志列表
export function list(data) {
  return request({
    url: '/system/sysLoginInfo/list',
    method: 'post',
    data: data
  })
}

// 删除登录日志
export function delLoginInfo(idList) {
  return request({
    url: '/system/sysLoginInfo/deleteByIdsP',
    method: 'post',
    data:{
      idList:idList
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
