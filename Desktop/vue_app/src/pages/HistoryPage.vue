<template>
  <Layout>
    <div class="max-w-7xl mx-auto">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Audit Trail</h1>
        <p class="text-gray-600 mt-1">{{ filteredHistory.length }} actions enregistrées</p>
      </div>

      <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Filtres</h2>
          <button @click="showFilters = !showFilters" class="flex items-center gap-2 px-4 py-2 border border-medical-blue text-medical-blue hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
            <Filter class="w-4 h-4" />{{ showFilters ? 'Masquer' : 'Afficher' }} les filtres
          </button>
        </div>
        <Transition name="expand">
          <div v-if="showFilters" class="mt-4 pt-4 border-t border-gray-200">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Type d'action</label>
                <select v-model="filterAction" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white outline-none focus:ring-2 focus:ring-medical-blue">
                  <option value="">Toutes les actions</option>
                  <option value="CREATE">Créer</option>
                  <option value="UPDATE">Modifier</option>
                  <option value="DELETE">Supprimer</option>
                  <option value="VIEW">Consulter</option>
                </select>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <div v-if="filteredHistory.length === 0" class="bg-white rounded-xl shadow-lg p-12 text-center">
        <History class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Aucun historique</h3>
        <p class="text-gray-600">{{ filterAction ? 'Essayez d\'ajuster vos filtres' : 'Les actions apparaîtront ici au fur et à mesure' }}</p>
      </div>
      <div v-else class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="divide-y divide-gray-200">
          <div v-for="item in filteredHistory" :key="item.id" class="p-6 hover:bg-gray-50 transition-colors">
            <div class="flex items-start gap-4">
              <div :class="['w-10 h-10 rounded-full flex items-center justify-center', actionColor(item.action)]">
                <component :is="actionIcon(item.action)" class="w-4 h-4" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <span :class="['inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold', actionColor(item.action)]">{{ item.action }}</span>
                  <span class="text-sm text-gray-500">{{ new Date(item.timestamp).toLocaleString('fr-FR') }}</span>
                </div>
                <p class="text-gray-900 font-medium mb-1">{{ item.details }}</p>
                <div class="flex items-center gap-4 text-sm text-gray-600">
                  <div class="flex items-center gap-1"><User class="w-4 h-4" /><span>{{ item.userName }}</span></div>
                  <RouterLink v-if="item.documentId" :to="`/documents/${item.documentId}`" class="flex items-center gap-1 text-medical-blue hover:underline">
                    <FileText class="w-4 h-4" /><span>Voir le document</span>
                  </RouterLink>
                </div>
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
import { History, Filter, Eye, Edit, Trash2, Plus, FileText, User } from 'lucide-vue-next'
import Layout from '@/components/Layout.vue'
import { useToast } from '@/composables/useToast'
import { api } from '@/services/api'

const { toast } = useToast()
const history = ref([])
const filterAction = ref('')
const showFilters = ref(false)

onMounted(async () => {
  try { history.value = await api.history.list() }
  catch { toast({ title: 'Erreur', description: 'Impossible de charger l\'historique', variant: 'destructive' }) }
})

const filteredHistory = computed(() => filterAction.value ? history.value.filter(h => h.action === filterAction.value) : history.value)

const actionIcon = (action) => ({ CREATE: Plus, UPDATE: Edit, DELETE: Trash2, VIEW: Eye }[action] || FileText)
const actionColor = (action) => ({ CREATE: 'bg-green-100 text-green-700', UPDATE: 'bg-blue-100 text-blue-700', DELETE: 'bg-red-100 text-red-700', VIEW: 'bg-gray-100 text-gray-700' }[action] || 'bg-gray-100 text-gray-700')
</script>

<style scoped>
.expand-enter-active, .expand-leave-active { transition: all 0.3s ease; overflow: hidden; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
.expand-enter-to, .expand-leave-from { max-height: 200px; }
</style>
