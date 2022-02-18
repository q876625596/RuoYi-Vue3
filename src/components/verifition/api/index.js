/**
 * 此处可直接引用自己项目封装好的 axios 配合后端联调
 */
import request from '@/utils/request' //组件内部封装的axios
import {piniaStore} from "@/store/indexStore";

//获取验证图片  以及token
export function reqGet(data) {
	return  request({
        url: '/auth/captcha/get',
        headers:{
            tenantid: piniaStore.userStore.tenantId ?? null
        },
        method: 'post',
        data
    })
}

//滑动或者点选验证
export function reqCheck(data) {
	return  request({
        url: '/auth/captcha/check',
        headers:{
            tenantid: piniaStore.userStore.tenantId ?? null
        },
        method: 'post',
        data
    })
}


