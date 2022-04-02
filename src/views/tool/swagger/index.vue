<template>
   <i-frame v-model:src="url"></i-frame>
</template>

<script setup>
import IFrame from '@/components/iFrame'

const url = ref(import.meta.env.VITE_APP_BASE_API + "/doc.html")
</script>
