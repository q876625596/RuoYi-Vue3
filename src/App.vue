<template>
  <router-view />
</template>

<script setup>
import { handleThemeStyle } from '@/utils/theme'
import {piniaStore} from "@/store/indexStore";
import {nextTick, onMounted} from "vue";
onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(piniaStore.settingsStore.theme)
  })
})
</script>
