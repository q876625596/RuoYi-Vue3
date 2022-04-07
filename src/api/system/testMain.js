import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function getTestMainListRequest(query) {
  return request({
    url: '/system/testMain/getTestMainList',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getTestMainDetailsRequest(id) {
  return request({
    url: '/system/testMain/getTestMainDetails',
    method: 'get',
    params: {
        id: id
    }
  })
}

// 新增【请填写功能名称】
export function addTestMainRequest(data) {
  return request({
    url: '/system/testMain/addTestMain',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function editTestMainRequest(data) {
  return request({
    url: '/system/testMain/editTestMain',
    method: 'post',
    data: data
  })
}

// 删除【请填写功能名称】
export function deleteTestMainByIdsRequest(ids) {
  return request({
    url: '/system/testMain/deleteTestMainByIdsP',
    method: 'post',
    params: {
        ids: ids
    }
  })
}
