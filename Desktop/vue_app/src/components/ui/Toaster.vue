<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
    <TransitionGroup name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        :class="[
          'rounded-xl shadow-xl border px-4 py-3 flex items-start gap-3 cursor-pointer',
          t.variant === 'destructive'
            ? 'bg-red-50 border-red-200 text-red-900'
            : t.className || 'bg-white border-gray-200 text-gray-900'
        ]"
        @click="dismiss(t.id)"
      >
        <div class="flex-1 min-w-0">
          <p v-if="t.title" class="font-semibold text-sm">{{ t.title }}</p>
          <p v-if="t.description" class="text-xs mt-0.5 opacity-80">{{ t.description }}</p>
        </div>
        <button class="text-gray-400 hover:text-gray-600 shrink-0">✕</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '@/composables/useToast'
const { toasts, dismiss } = useToast()
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(100%); }
.toast-leave-to { opacity: 0; transform: translateX(100%); }
</style>
