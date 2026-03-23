<template>
  <Layout>
    <div class="max-w-7xl mx-auto space-y-8">
      <Transition name="fade-down" appear>
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <PrivacyBadge type="secure" class-name="py-0.5" />
              <span class="text-xs text-gray-400 font-medium">Session Sécurisée</span>
            </div>
            <h1 class="text-3xl font-bold text-gray-900">
              Bonjour, <span class="bg-gradient-to-r from-medical-blue to-health-green bg-clip-text text-transparent">{{ auth.currentUser?.firstName }}</span>
            </h1>
            <p class="text-gray-500 mt-1">Voici un aperçu de vos activités et de l'état des archives aujourd'hui.</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right hidden sm:block">
              <p class="text-xs text-gray-400 font-semibold uppercase">Niveau d'activité</p>
              <div class="flex items-center gap-1 text-health-green font-bold text-sm"><TrendingUp class="w-4 h-4" /><span>Élevé</span></div>
            </div>
            <RouterLink to="/documents/create">
              <button class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-medical-blue to-health-green text-white rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 text-sm font-medium">
                <Plus class="w-4 h-4" />Nouveau Document
              </button>
            </RouterLink>
          </div>
        </div>
      </Transition>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Transition v-for="(card, i) in visibleCards" :key="card.title" name="fade-up" appear :style="`transition-delay: ${i * 0.1}s`">
              <div :class="`bg-gradient-to-br ${card.color} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group`">
                <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <component :is="card.icon" class="w-24 h-24 transform translate-x-4 -translate-y-4" />
                </div>
                <div class="relative z-10">
                  <div class="flex items-center justify-between mb-3">
                    <div class="p-2 bg-white/20 rounded-lg"><component :is="card.icon" class="w-6 h-6" /></div>
                    <span class="text-xs font-medium bg-black/10 px-2 py-1 rounded-full">{{ card.trend }}</span>
                  </div>
                  <div class="text-3xl font-bold mb-1">{{ card.value }}</div>
                  <p class="text-xs font-medium opacity-90 uppercase tracking-wide">{{ card.title }}</p>
                </div>
              </div>
            </Transition>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2"><Clock class="w-5 h-5 text-medical-blue" />Documents Récents</h2>
                <p class="text-xs text-gray-500 mt-0.5">Vos dernières interactions avec la base</p>
              </div>
              <RouterLink to="/documents">
                <button class="text-medical-blue hover:text-medical-blue-dark hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Tout voir</button>
              </RouterLink>
            </div>
            <div v-if="stats.recentDocuments.length === 0" class="p-8 text-center text-gray-500">Aucun document récent.</div>
            <div v-else class="divide-y divide-gray-100">
              <div v-for="doc in stats.recentDocuments" :key="doc.id" class="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-medical-blue shrink-0"><FileText class="w-6 h-6" /></div>
                <div class="flex-grow min-w-0">
                  <h3 class="font-semibold text-gray-900 truncate">{{ doc.objet }}</h3>
                  <p class="text-xs text-gray-500 flex items-center gap-2">
                    <span>{{ doc.auteur }}</span><span class="w-1 h-1 bg-gray-300 rounded-full" /><span>{{ new Date(doc.createdAt).toLocaleDateString() }}</span>
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <PrivacyBadge type="verified" class-name="hidden sm:flex text-[10px] py-0.5" />
                  <RouterLink :to="`/documents/${doc.id}`">
                    <button class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"><Plus class="w-4 h-4 rotate-45" /></button>
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="space-y-4">
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2"><Sparkles class="w-4 h-4 text-amber-500" />Suggestions Personnalisées</h3>
            <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p class="font-semibold text-gray-900 text-sm mb-1">Vérification requise</p>
              <p class="text-xs text-gray-500 mb-3">3 nouveaux documents attendent votre validation dans le service Cardiologie.</p>
              <button class="text-xs text-medical-blue font-medium hover:underline">Vérifier →</button>
            </div>
            <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
              <CheckCircle2 class="w-5 h-5 text-health-green shrink-0 mt-0.5" />
              <div>
                <p class="font-semibold text-gray-900 text-sm mb-1">Expert Certifié</p>
                <p class="text-xs text-gray-500">Vous avez contribué à plus de 50 documents vérifiés cette année.</p>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
            <h3 class="font-bold text-lg mb-2">Bénéfices de l'archivage</h3>
            <p class="text-sm text-gray-300 mb-6 leading-relaxed">Une gestion rigoureuse permet de réduire les erreurs médicales de 30% et d'accélérer la recherche clinique.</p>
            <div class="space-y-3">
              <div class="flex items-center gap-3 text-sm text-gray-300">
                <div class="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"><CheckCircle2 class="w-3.5 h-3.5 text-health-green" /></div>
                <span>Traçabilité complète</span>
              </div>
              <div class="flex items-center gap-3 text-sm text-gray-300">
                <div class="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"><CheckCircle2 class="w-3.5 h-3.5 text-health-green" /></div>
                <span>Conformité légale</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { FileText, Users, TrendingUp, Plus, Sparkles, CheckCircle2, Clock, ShieldCheck } from 'lucide-vue-next'
import Layout from '@/components/Layout.vue'
import PrivacyBadge from '@/components/PrivacyBadge.vue'
import { useAuthStore } from '@/context/authStore'
import { api } from '@/services/api'

const auth = useAuthStore()
const stats = ref({ totalDocuments: 0, totalUsers: 0, recentDocuments: [] })

onMounted(async () => {
  try {
    const [docs, users] = await Promise.all([api.documents.list(), api.users.list()])
    stats.value = { totalDocuments: docs.length, totalUsers: users.length, recentDocuments: docs.slice(0, 3) }
  } catch {}
})

const statCards = computed(() => [
  { title: 'Documents Totaux', value: stats.value.totalDocuments, icon: FileText, color: 'from-medical-blue to-blue-600', visible: true, trend: '+5% ce mois' },
  { title: 'Utilisateurs Actifs', value: stats.value.totalUsers, icon: Users, color: 'from-health-green to-green-600', visible: auth.currentUser?.role === 'Admin', trend: 'Stable' },
  { title: 'Taux de Vérification', value: '94%', icon: ShieldCheck, color: 'from-purple-500 to-purple-600', visible: true, trend: 'Excellent' },
])

const visibleCards = computed(() => statCards.value.filter(c => c.visible))
</script>

<style scoped>
.fade-down-enter-active { transition: all 0.4s ease; }
.fade-down-enter-from { opacity: 0; transform: translateY(-20px); }
.fade-up-enter-active { transition: all 0.4s ease; }
.fade-up-enter-from { opacity: 0; transform: translateY(20px); }
</style>
