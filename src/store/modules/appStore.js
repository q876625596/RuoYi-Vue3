import {defineStore} from "pinia";
import Cookies from "js-cookie";

export const useAppStore = defineStore('appStore', {
    state: () => ({
        sidebar: {
            opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
            withoutAnimation: false,
            hide: false
        },
        device: 'desktop',
        size: Cookies.get('size') || 'default'
    }),
    actions: {
        toggleSideBar() {
            if (this.sidebar.hide) {
                return false;
            }
            this.sidebar.opened = !this.sidebar.opened
            this.sidebar.withoutAnimation = false
            if (this.sidebar.opened) {
                Cookies.set('sidebarStatus', 1)
            } else {
                Cookies.set('sidebarStatus', 0)
            }
        },
        closeSideBar(withoutAnimation) {
            Cookies.set('sidebarStatus', 0)
            this.sidebar.opened = false
            this.sidebar.withoutAnimation = withoutAnimation
        },
        toggleDevice(device) {
            this.device = device
        },
        setSize(size) {
            this.size = size
            Cookies.set('size', size)
        },
        toggleSideBarHide(status) {
            this.sidebar.hide = status;
        },
    }
})
