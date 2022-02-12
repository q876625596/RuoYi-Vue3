import defaultSettings from '@/settings'
import {piniaStore} from "@/store/indexStore";

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
