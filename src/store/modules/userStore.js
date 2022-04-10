import {defineStore} from "pinia";
import { sysLogin, logout, getInfo } from '@/api/system/sysLogin'
import { getToken, setToken, removeToken } from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'
export const    useUserStore = defineStore('userStore',{
    state: ()=>({
        token: getToken(),
        name: '',
        avatar: '',
        roles: [],
        permissions: []
    }),
    actions:{
        // 登录
        login(userInfo) {
            const username = userInfo.username.trim()
            const password = userInfo.password
            const captchaVerification = userInfo.captchaVerification
            const tenantId = userInfo.tenantId;
            return new Promise((resolve, reject) => {
                sysLogin(username, password, captchaVerification, tenantId).then(res => {
                    console.log(res);
                    setToken(res.data.tokenValue)
                    this.token = res.data.tokenValue
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        getInfo() {
            return new Promise((resolve, reject) => {
                getInfo().then(res => {
                    if (!res.data) {
                        this.$message.error("用户信息获取异常")
                    }
                    //           const avatar = (res.data.avatar == "" || res.data.avatar == null) ? defAva : import.meta.env.VITE_APP_BASE_API + res.data.avatar;
                    const avatar = (res.data.avatar == "" || res.data.avatar == null) ? defAva : res.data.avatar;

                    if (res.data.roles && res.data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                        this.roles = res.data.roles;
                        this.permissions = res.data.permissions;
                    } else {
                        this.roles = ['ROLE_DEFAULT'];
                    }
                    this.name = res.data.userName;
                    this.avatar = avatar;
                    this.tenantId = res.data.tenantId;
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 退出系统
        logOut() {
            return new Promise((resolve, reject) => {
                logout(this.token).then(() => {
                    this.token = '';
                    this.roles = [];
                    this.permissions = [];
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        fedLogOut() {
            return new Promise(resolve => {
                this.token = '';
                removeToken()
                resolve()
            })
        }
    }
})
