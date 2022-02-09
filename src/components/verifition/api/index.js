/**
 * 此处可直接引用自己项目封装好的 axios 配合后端联调
 */


import request from '@/utils/request'  //组件内部封装的axios

//获取验证图片  以及token
export function reqGet(data, tenantId) {
	return  request({
        url: '/auth/captcha/get',
        headers:{
            paramsTenantId: tenantId ?? null
        },
        method: 'post',
        data
    })
}

//滑动或者点选验证
export function reqCheck(data, tenantId) {
	return  request({
        url: '/auth/captcha/check',
        headers:{
            paramsTenantId: tenantId ?? null
        },
        method: 'post',
        data
    })
}


