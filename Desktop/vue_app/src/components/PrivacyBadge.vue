<template>
  <div class="relative inline-block">
    <div
      :class="['flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold cursor-help transition-all hover:scale-105', badge.color, className]"
      @mouseenter="showTip = true"
      @mouseleave="showTip = false"
    >
      <component :is="badge.icon" class="w-3.5 h-3.5" />
      <span>{{ badge.text }}</span>
    </div>
    <Transition name="tip">
      <div
        v-if="showTooltip && showTip"
        class="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-xl text-center pointer-events-none"
      >
        {{ badge.description }}
        <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Shield, Lock, Eye, AlertCircle, CheckCircle, Info } from 'lucide-vue-next'

const props = defineProps({
  type: { type: String, default: 'secure' },
  className: { type: String, default: '' },
  showTooltip: { type: Boolean, default: true }
})

const showTip = ref(false)

const badges = {
  secure: { icon: Shield, text: 'Données Sécurisées', color: 'text-medical-blue bg-blue-50 border-blue-200', description: 'Vos données sont cryptées et stockées de manière sécurisée.' },
  confidential: { icon: Lock, text: 'Confidentielite', color: 'text-purple-700 bg-purple-50 border-purple-200', description: "L'accès à ce document est strictement réservé au personnel autorisé." },
  restricted: { icon: AlertCircle, text: 'Accès Restreint', color: 'text-amber-700 bg-amber-50 border-amber-200', description: "Ce contenu nécessite des privilèges d'administration." },
  verified: { icon: CheckCircle, text: 'Vérifié & Validé', color: 'text-health-green bg-green-50 border-green-200', description: 'Ce contenu a été validé par l\'administration et est conforme aux normes de qualité.' },
  gdpr: { icon: Info, text: 'Conforme RGPD', color: 'text-gray-700 bg-gray-100 border-gray-200', description: 'Le traitement de ces données respecte le RGPD.' }
}

const badge = computed(() => badges[props.type] || badges.secure)
</script>

<style scoped>
.tip-enter-active, .tip-leave-active { transition: all 0.15s ease; }
.tip-enter-from, .tip-leave-to { opacity: 0; transform: translateX(-50%) translateY(4px); }
</style>
