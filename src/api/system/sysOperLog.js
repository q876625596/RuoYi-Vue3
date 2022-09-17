import request from '@/utils/request'

// 查询操作日志列表
export function list(query) {
  return request({
    url: '/system/sysOperLog/list',
    method: 'get',
    params: query
  })
}

// 删除操作日志
export function delOperLog(idList) {
  return request({
    url: '/system/sysOperLog/deleteByIdListP',
    method: 'post',
    data:{
      idList:idList
    }
  })
}

// 清空操作日志
export function clean() {
  return request({
    url: '/system/sysOperLog/clean',
    method: 'post'
  })
}
