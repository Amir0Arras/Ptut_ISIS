<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      <div class="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full bg-medical-blue/5 blur-[120px]" />
      <div class="absolute -bottom-20 -left-20 w-[600px] h-[600px] rounded-full bg-health-green/5 blur-[120px]" />
    </div>

    <Transition name="fade-up" appear>
      <div class="w-full max-w-[480px] z-10">
        <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <!-- Top Security Bar -->
          <div class="bg-gradient-to-r from-medical-blue to-health-green px-6 py-2 flex items-center justify-between">
            <div class="flex items-center gap-2 text-white/90 text-[10px] font-medium tracking-wide uppercase">
              <Shield class="w-3 h-3" /><span>Connexion Cryptée SSL 256-bit</span>
            </div>
            <div class="flex items-center gap-2 text-white/90 text-[10px] font-medium tracking-wide uppercase">
              <Activity class="w-3 h-3" /><span>Système Actif</span>
            </div>
          </div>

          <div class="p-8 pt-10">
            <div class="flex flex-col items-center justify-center mb-8">
              <div class="relative mb-6 group">
                <div class="w-20 h-20 bg-gradient-to-br from-medical-blue to-health-green rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <FolderArchive class="w-10 h-10 text-white" />
                </div>
                <div class="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 animate-spin-slow">
                  <Archive class="w-4 h-4 text-medical-blue" />
                </div>
              </div>
              <h1 class="text-3xl font-bold text-gray-900 text-center tracking-tight mb-2">ISIS Archives</h1>
              <p class="text-gray-500 text-center text-sm max-w-xs mx-auto">Plateforme de gestion documentaire sécurisée et conforme.</p>
              <div class="flex flex-wrap justify-center gap-2 mt-4">
                <PrivacyBadge type="secure" :show-tooltip="false" class-name="text-[10px] px-2 py-0.5" />
                <PrivacyBadge type="gdpr" :show-tooltip="false" class-name="text-[10px] px-2 py-0.5" />
              </div>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-5">
              <div class="space-y-1.5">
                <label class="block text-sm font-semibold text-gray-700 ml-1">Identifiant Professionnel</label>
                <div class="relative group">
                  <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-medical-blue transition-colors" />
                  <input v-model="email" type="email" required autocomplete="username" placeholder="nom@isis.com"
                    class="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-medical-blue/10 focus:border-medical-blue transition-all outline-none bg-gray-50/50 focus:bg-white text-gray-900 placeholder:text-gray-400" />
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="block text-sm font-semibold text-gray-700 ml-1">Mot de passe</label>
                <div class="relative group">
                  <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-medical-blue transition-colors" />
                  <input v-model="password" :type="showPwd ? 'text' : 'password'" required autocomplete="current-password" placeholder="••••••••"
                    class="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-medical-blue/10 focus:border-medical-blue transition-all outline-none bg-gray-50/50 focus:bg-white text-gray-900 placeholder:text-gray-400" />
                  <button type="button" @click="showPwd = !showPwd" tabindex="-1" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                    <EyeOff v-if="showPwd" class="w-4 h-4" /><Eye v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button type="submit" :disabled="isLoading"
                class="w-full bg-gradient-to-r from-medical-blue to-health-green hover:from-medical-blue-dark hover:to-health-green-dark text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mt-4 disabled:opacity-70 flex items-center justify-center gap-2">
                <div v-if="isLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span v-if="isLoading">Authentification en cours...</span>
                <template v-else>
                  <span>Accéder au Portail</span>
                  <ArrowRight class="w-4 h-4" />
                </template>
              </button>
            </form>
          </div>

          <div class="bg-gray-50/80 px-8 py-5 border-t border-gray-100">
            <div class="flex items-center justify-center gap-6 opacity-60 hover:opacity-100 transition-all duration-500">
              <div class="flex flex-col items-center"><Shield class="w-5 h-5 mb-1" /><span class="text-[10px] font-medium">Sécurité</span></div>
              <div class="flex flex-col items-center"><Lock class="w-5 h-5 mb-1" /><span class="text-[10px] font-medium">Confidentialité</span></div>
              <div class="flex flex-col items-center"><FileCheck class="w-5 h-5 mb-1" /><span class="text-[10px] font-medium">Conformité</span></div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-200 text-center">
              <p class="text-[10px] text-gray-400">L'accès à ce système est monitoré. En vous connectant, vous acceptez notre politique de confidentialité.</p>
              <div class="mt-2 text-[9px] text-gray-300 hover:text-gray-500 transition-colors cursor-help" title="admin@isis.com / admin123 | contributeur@isis.com / contrib123">Mode Démonstration</div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Shield, Activity, FolderArchive, Archive, Mail, Lock, Eye, EyeOff, ArrowRight, FileCheck } from 'lucide-vue-next'
import { useAuthStore } from '@/context/authStore'
import { useToast } from '@/composables/useToast'
import PrivacyBadge from '@/components/PrivacyBadge.vue'

const auth = useAuthStore()
const router = useRouter()
const { toast } = useToast()

const email = ref('')
const password = ref('')
const showPwd = ref(false)
const isLoading = ref(false)

const handleSubmit = async () => {
  isLoading.value = true
  try {
    const result = await auth.login(email.value, password.value)
    if (result.success) {
      toast({ title: 'Connexion réussie', description: 'Bienvenue sur ISIS Archives', className: 'bg-green-50 border-green-200 text-green-900' })
      router.push(result.requiresPasswordChange ? '/change-password' : '/dashboard')
    } else {
      toast({ title: 'Erreur de connexion', description: result.error, variant: 'destructive' })
    }
  } catch {
    toast({ title: 'Erreur', description: 'Une erreur inattendue est survenue', variant: 'destructive' })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.fade-up-enter-active { transition: all 0.6s ease; }
.fade-up-enter-from { opacity: 0; transform: translateY(30px); }
.animate-spin-slow { animation: spin 20s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
