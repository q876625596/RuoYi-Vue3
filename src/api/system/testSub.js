import request from '@/utils/request'

// 查询测试子表列表
export function getTestSubListRequest(query) {
  return request({
    url: '/system/testSub/getTestSubList',
    method: 'get',
    params: query
  })
}

// 查询测试子表详细
export function getTestSubDetailsRequest(id) {
  return request({
    url: '/system/testSub/getTestSubDetails',
    method: 'get',
    params: {
        id: id
    }
  })
}

// 新增测试子表
export function addTestSubRequest(data) {
  return request({
    url: '/system/testSub/addTestSub',
    method: 'post',
    data: data
  })
}

// 修改测试子表
export function editTestSubRequest(data) {
  return request({
    url: '/system/testSub/editTestSub',
    method: 'post',
    data: data
  })
}

// 删除测试子表
export function deleteTestSubByIdsRequest(ids) {
  return request({
    url: '/system/testSub/deleteTestSubByIdsP',
    method: 'post',
    params: {
        ids: ids
    }
  })
}
