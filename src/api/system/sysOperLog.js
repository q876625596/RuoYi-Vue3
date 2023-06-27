import request from '@/utils/request'

// 查询操作日志列表
export function list(query) {
  return request({
    url: '/management/sysOperLog/getSysOperLogList',
    method: 'get',
    params: query
  })
}

// 删除操作日志
export function delOperLog(idList) {
  return request({
    url: '/management/sysOperLog/deleteSysOperLog',
    method: 'post',
    data:{
      idList:idList
    }
  })
}

// 清空操作日志
export function cleanSysOperLog() {
  return request({
    url: '/management/sysOperLog/cleanSysOperLog',
    method: 'post'
  })
}
