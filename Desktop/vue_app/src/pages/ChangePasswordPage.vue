<template>
  <Layout>
    <div class="flex justify-center items-start pt-8 pb-12">
      <div class="w-full max-w-lg">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-blue-600 to-emerald-500 px-8 py-8 text-center relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
            <div class="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full -ml-10 -mb-10 blur-2xl" />
            <div class="relative z-10 flex flex-col items-center">
              <div class="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg mb-4 ring-1 ring-white/30">
                <Shield class="w-8 h-8 text-white" />
              </div>
              <h1 class="text-2xl font-bold text-white mb-2">Sécurité du Compte</h1>
              <p class="text-blue-50 text-sm max-w-sm">Mettez à jour vos identifiants pour garantir la sécurité des données .</p>
            </div>
          </div>

          <div class="p-8">
            <div class="flex justify-center mb-6">
              <PrivacyBadge type="secure" :show-tooltip="false" />
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-5">
              <div v-for="field in passwordFields" :key="field.key">
                <label class="block text-xs font-bold uppercase text-gray-500 mb-2 ml-1">{{ field.label }}</label>
                <div class="relative group">
                  <component :is="field.icon" class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input :type="field.show.value ? 'text' : 'password'" v-model="field.model.value" required :placeholder="field.placeholder"
                    class="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all outline-none bg-gray-50/50 focus:bg-white text-gray-900 placeholder:text-gray-400" />
                  <button type="button" @click="field.show.value = !field.show.value" tabindex="-1" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-md">
                    <EyeOff v-if="field.show.value" class="w-4 h-4" /><Eye v-else class="w-4 h-4" />
                  </button>
                </div>
                <div v-if="field.key !== 'old'" class="h-px bg-gray-100 mt-4" />
              </div>

              <div class="pt-4">
                <button type="submit" :disabled="isLoading" class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70">
                  <div v-if="isLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span v-if="isLoading">Mise à jour en cours...</span>
                  <template v-else>
                    <span>Mettre à jour le mot de passe</span><ArrowRight class="w-4 h-4" />
                  </template>
                </button>
              </div>
            </form>

            <div class="mt-6 flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <AlertTriangle class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div class="text-xs text-amber-800 leading-relaxed">
                <p class="font-bold mb-1">Rappel de sécurité</p>
                <p>Ne partagez jamais votre mot de passe. Les administrateurs ISIS ne vous le demanderont jamais.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Lock, Shield, CheckCircle, AlertTriangle, ArrowRight, Eye, EyeOff } from 'lucide-vue-next'
import Layout from '@/components/Layout.vue'
import PrivacyBadge from '@/components/PrivacyBadge.vue'
import { useAuthStore } from '@/context/authStore'
import { useToast } from '@/composables/useToast'

const auth = useAuthStore()
const router = useRouter()
const { toast } = useToast()

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showOld = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)
const isLoading = ref(false)

const passwordFields = [
  { key: 'old', label: 'Mot de passe actuel', icon: Lock, model: oldPassword, show: showOld, placeholder: 'Votre mot de passe actuel' },
  { key: 'new', label: 'Nouveau mot de passe', icon: Lock, model: newPassword, show: showNew, placeholder: 'Minimum 6 caractères' },
  { key: 'confirm', label: 'Confirmer le nouveau mot de passe', icon: CheckCircle, model: confirmPassword, show: showConfirm, placeholder: 'Répétez le nouveau mot de passe' },
]

const handleSubmit = async () => {
  if (newPassword.value !== confirmPassword.value) {
    return toast({ title: 'Erreur de validation', description: 'Les mots de passe ne correspondent pas.', variant: 'destructive' })
  }
  if (newPassword.value.length < 6) {
    return toast({ title: 'Mot de passe trop faible', description: 'Minimum 6 caractères requis.', variant: 'destructive' })
  }
  if (newPassword.value === oldPassword.value) {
    return toast({ title: 'Mot de passe identique', description: 'Le nouveau mot de passe doit être différent.', variant: 'destructive' })
  }

  isLoading.value = true
  try {
    const result = await auth.changePassword(oldPassword.value, newPassword.value)
    if (result.success) {
      toast({ title: 'Succès', description: 'Mot de passe mis à jour avec succès.', className: 'bg-emerald-50 border-emerald-200 text-emerald-900' })
      router.push('/dashboard')
    } else {
      toast({ title: 'Erreur', description: result.error, variant: 'destructive' })
    }
  } catch {
    toast({ title: 'Erreur inattendue', description: 'Une erreur technique est survenue.', variant: 'destructive' })
  } finally {
    isLoading.value = false
  }
}
</script>
