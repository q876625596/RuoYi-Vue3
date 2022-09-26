import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token';
//失效时间24小时
const expiresTime = 60 * 1000 * 60 * 24;

export function getToken() {
    // return localStorage.getItem(TokenKey);
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    // return localStorage.setItem(TokenKey,token);
    return Cookies.set(TokenKey, token, {expires: new Date(new Date().getTime() + expiresTime)})
}

export function refreshToken() {
    // return localStorage.setItem(TokenKey,token);
    return Cookies.set(TokenKey, Cookies.get(TokenKey), {expires: new Date(new Date().getTime() + expiresTime)})
}

export function removeToken() {
    // return localStorage.removeItem(TokenKey)
    return Cookies.remove(TokenKey)
}
