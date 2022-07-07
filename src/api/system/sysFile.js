import request from '@/utils/request'
import {parseStrEmpty} from "@/utils/ruoyi";

// 用户头像上传
export function uploadImage(data) {
    return request({
        url: '/file/upload',
        method: 'post',
        data: data
    })
}
