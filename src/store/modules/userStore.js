import {defineStore} from "pinia";
import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'
export const    useUserStore = defineStore('userStore',{
    state: ()=>({
        token: getToken(),
        tenantId: '',
        name: '',
        avatar: '',
        roles: [],
        permissions: []
    }),
    actions:{
        saveTenantIdForUrl(tenantId){
            this.tenantId = tenantId;
        },
        // 登录
        login(userInfo) {
            const username = userInfo.username.trim()
            const password = userInfo.password
            const code = userInfo.code
            const uuid = userInfo.uuid
            const captchaVO = userInfo.captchaVO
            const tenantId = userInfo.tenantId;
            return new Promise((resolve, reject) => {
                login(username, password, code, uuid, captchaVO, tenantId).then(res => {
                    console.log(res);
                    setToken(res.data.access_token)
                    this.token = res.data.access_token
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
                    const user = res.data.user
                    const avatar = user.avatar == "" ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar;

                    if (res.data.roleSet && res.data.roleSet.length > 0) { // 验证返回的roles是否是一个非空数组
                        this.roles = res.data.roleSet;
                        this.permissions = res.data.permissionSet;
                    } else {
                        this.roles = ['ROLE_DEFAULT'];
                    }
                    this.name = user.userName;
                    this.avatar = avatar;
                    this.tenantId = user.tenantId;
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
