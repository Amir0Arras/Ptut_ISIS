<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'p-4 rounded-xl shadow-lg border text-sm',
          toast.variant === 'destructive'
            ? 'bg-red-50 border-red-200 text-red-900'
            : toast.className || 'bg-white border-gray-200 text-gray-900'
        ]"
      >
        <p class="font-bold">{{ toast.title }}</p>
        <p v-if="toast.description" class="mt-1 text-xs opacity-80">{{ toast.description }}</p>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToast } from '@/composables/useToast'
const { toasts } = useToast()
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(100%); }
.toast-leave-to { opacity: 0; transform: translateX(100%); }
</style>
