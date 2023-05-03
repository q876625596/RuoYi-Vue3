import {defineStore} from "pinia";
import {checkTenantTag, getInfo, logout, sysLogin} from '@/api/system/sysLogin'
import {getToken, removeToken, setToken} from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'

export const useUserStore = defineStore('userStore', {
    state: () => ({
        deviceId: "1",
        token: getToken(),
        tenantId: '',
        name: '',
        avatar: '',
        roles: [],
        permissions: []
    }),
    getters: {
        getTenantId: (state) => state.tenantId ?? '1',
    },
    actions: {
        saveTenantId(tenantId) {
            this.tenantId = tenantId;
        },
        // 登录
        login(userInfo) {
            const username = userInfo.username.trim()
            const password = userInfo.password
            const captchaVerification = userInfo.captchaVerification
            return new Promise(async (resolve, reject) => {
                let checkTenantTagRes = await checkTenantTag(userInfo.tenantTag).catch(error => {
                    reject(error)
                })
                this.saveTenantId(checkTenantTagRes.data);
                // await checkDevice(this.deviceId).catch(error => {
                //     reject(error)
                // })
                let sysLoginRes = await sysLogin(username, password, captchaVerification).catch(error => {
                    reject(error)
                })
                console.log(sysLoginRes);
                setToken(sysLoginRes.data.tokenValue)
                this.token = sysLoginRes.data.tokenValue
                resolve()
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
