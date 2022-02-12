import defaultSettings from '@/settings'
console.log("aaa");
import {piniaStore} from "@/store/indexStore";
console.log("bbb");

/**
 * 动态修改标题
 */
export function useDynamicTitle() {
    if (piniaStore.settingsStore.dynamicTitle) {
        document.title = piniaStore.settingsStore.title + ' - ' + defaultSettings.title;
    } else {
        document.title = defaultSettings.title;
    }
}
