import {getDicts} from '@/api/system/sysDictData'
import {piniaStore} from "@/store/indexStore";
import {toRefs} from "vue";

/**
 * 获取字典数据
 */
export function useDict(...args) {
    const res = ref({});
    return (() => {
        args.forEach((dictType, index) => {
            res.value[dictType] = [];
            const dicts = piniaStore.dictStore.getDict(dictType);
            if (dicts) {
                res.value[dictType] = dicts;
            } else {
                getDicts(dictType).then(resp => {
                    res.value[dictType] = resp.data.map(p => ({
                        label: p.dictLabel,
                        value: p.dictValue,
                        elTagType: p.listClass,
                        elTagClass: p.cssClass
                    }))
                    piniaStore.dictStore.setDict(dictType, res.value[dictType]);
                })
            }
        })
        return toRefs(res.value);
    })()
}
