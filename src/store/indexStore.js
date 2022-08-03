
import {useUserStore} from "@/store/modules/userStore";
import {useSettingsStore} from "@/store/modules/settingsStore";
import {usePermissionStore} from "@/store/modules/permissionStore";
import {useAppStore} from "@/store/modules/appStore";
import {useTagsViewStore} from "@/store/modules/tagsViewStore";
import {createPinia, defineStore} from "pinia";
import pinia from '@/store.js'
import useDictStore from "@/store/modules/dictStore";

export const piniaStore = {
    userStore: useUserStore(pinia),
    settingsStore: useSettingsStore(pinia),
    permissionStore: usePermissionStore(pinia),
    appStore: useAppStore(pinia),
    tagsViewStore: useTagsViewStore(pinia),
    dictStore: useDictStore(pinia),
}
