<template>
  <component :is="isAuthenticated ? DashboardPage : LandingPage" />
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useAuthStore } from '@/context/authStore'
import DashboardPage from './DashboardPage.vue'

const LandingPage = defineAsyncComponent(() => import('./LandingPage.vue'))
const auth = useAuthStore()
const isAuthenticated = computed(() => auth.isAuthenticated)
</script>
