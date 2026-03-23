<template>
  <div :class="['rounded-xl border p-4 shadow-sm', bgClass]">
    <div class="flex items-start gap-3">
      <div :class="['p-2 rounded-lg', iconBgClass]">
        <component :is="iconComponent" class="w-4 h-4" />
      </div>
      <div class="flex-1">
        <h4 class="font-semibold text-gray-900 text-sm">{{ title }}</h4>
        <p class="text-xs text-gray-500 mt-1">{{ subtitle }}</p>
        <button v-if="actionLabel" @click="$emit('action')" class="mt-2 text-xs font-semibold text-medical-blue hover:underline">
          {{ actionLabel }} →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Sparkles, CheckCircle2 } from 'lucide-vue-next'

const props = defineProps({
  title: String,
  subtitle: String,
  type: { type: String, default: 'suggestion' },
  actionLabel: String,
  icon: { type: Object, default: null }
})

defineEmits(['action'])

const bgClass = computed(() => props.type === 'achievement' ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100')
const iconBgClass = computed(() => props.type === 'achievement' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-medical-blue')
const iconComponent = computed(() => props.icon || (props.type === 'achievement' ? CheckCircle2 : Sparkles))
</script>
