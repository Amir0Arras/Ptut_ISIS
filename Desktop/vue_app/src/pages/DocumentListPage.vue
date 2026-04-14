<template>
  <Layout>
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Documents</h1>
          <p class="text-gray-600 mt-1">{{ documents.length }} documents trouvés</p>
        </div>
        <div class="flex gap-2">
          <button @click="handlePrint" class="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Printer class="w-4 h-4" />Print
          </button>
          <button @click="handleExportCSV" class="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Download class="w-4 h-4" />Export CSV
          </button>
          <RouterLink v-if="auth.currentUser?.role === 'Admin' || auth.currentUser?.role === 'Contributeur'" to="/documents/create">
            <button class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-medical-blue to-health-green text-white rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all">
              <Plus class="w-4 h-4" />Créer
            </button>
          </RouterLink>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input v-model="searchQuery" type="text" placeholder="Rechercher par titre, auteur ou tags..."
              class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent text-gray-900 bg-white outline-none" />
          </div>
          <button @click="showFilters = !showFilters" class="flex items-center gap-2 px-4 py-2 border border-medical-blue text-medical-blue hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
            <Filter class="w-4 h-4" />Filtres
          </button>
        </div>

        <Transition name="expand">
          <div v-if="showFilters" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
           <div>
  <label class="block text-sm font-medium text-gray-700 mb-2">Service</label>
  <select v-model="filterService" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white">
    <option value="">Tous les services</option>
    <option value="RH">RH</option>
    <option value="Financier">Financier</option>
    <option value="Scolarité">Scolarité</option>
    <option value="Communication">Communication</option>
    <option value="Patrimoine">Patrimoine</option>
    <option value="Informatique">Informatique</option>
    <option value="Vie étudiante">Vie étudiante</option>
    <option value="Enseignements">Enseignements</option>
    <option value="Recherche">Recherche</option>
    <option value="Relation partenariales">Relation partenariales</option>
    <option value="Commun">Commun</option>
  </select>
</div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Période</label>
              <select v-model="filterPeriode" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white">
                <option value="">Toutes les périodes</option>
                <option v-for="p in ['2023','2024','Q1 2024']" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
          </div>
        </Transition>
      </div>

      <div v-if="loading" class="flex justify-center p-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue"></div>
      </div>
      <div v-else-if="documents.length === 0" class="text-center p-12 bg-white rounded-xl shadow-lg">
        <FileText class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Aucun document trouvé</h3>
        <p class="text-gray-600">Essayez d'ajuster vos filtres ou créez un nouveau document.</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="doc in documents" :key="doc.id" class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden flex flex-col">
          <div class="p-6 flex-1">
            <div class="flex justify-between items-start mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-medical-blue to-health-green rounded-lg flex items-center justify-center">
                <FileText class="w-6 h-6 text-white" />
              </div>
              <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{{ doc.service || 'Général' }}</span>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{{ doc.objet }}</h3>
            <p class="text-sm text-gray-500 mb-4 line-clamp-2">{{ doc.description }}</p>
            <div class="space-y-1 text-sm text-gray-600 mb-4">
              <p><strong>Auteur:</strong> {{ doc.auteur }}</p>
              <p><strong>Période:</strong> {{ doc.periode }}</p>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex justify-between gap-2">
            <RouterLink :to="`/documents/${doc.id}`" class="flex-1">
              <button class="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Eye class="w-4 h-4" />Voir
              </button>
            </RouterLink>
            <button v-if="auth.currentUser?.role === 'Admin'" @click="handleDelete(doc.id)"
              class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { FileText, Plus, Search, Filter, Eye, Trash2, Download, Printer } from 'lucide-vue-next'
import Layout from '@/components/Layout.vue'
import { useAuthStore } from '@/context/authStore'
import { useToast } from '@/composables/useToast'
import { api } from '@/services/api'

const auth = useAuthStore()
const { toast } = useToast()
const documents = ref([])
const loading = ref(true)
const searchQuery = ref('')
const filterService = ref('')
const filterPeriode = ref('')
const showFilters = ref(false)

const loadDocuments = async () => {
  loading.value = true
  try {
    documents.value = await api.documents.list({ search: searchQuery.value, service: filterService.value, periode: filterPeriode.value })
  } catch {
    toast({ title: 'Erreur', description: 'Impossible de charger les documents', variant: 'destructive' })
  } finally {
    loading.value = false
  }
}

watch([searchQuery, filterService, filterPeriode], loadDocuments, { immediate: true })

const handleDelete = async (id) => {
  if (!confirm('Supprimer ce document ?')) return
  try {
    await api.documents.delete(id, auth.currentUser)
    toast({ title: 'Document supprimé' })
    loadDocuments()
  } catch {
    toast({ title: 'Erreur', description: 'Suppression impossible', variant: 'destructive' })
  }
}

const handleExportCSV = () => {
  const headers = ['ID', 'Objet', 'Service', 'Periode', 'Auteur', 'Poste', 'Created At']
  const csvContent = [headers.join(','), ...documents.value.map(d => [d.id, `"${d.objet}"`, d.service, d.periode, d.auteur, d.poste, d.createdAt].join(','))].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `documents_export_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
}

const handlePrint = () => window.print()
</script>

<style scoped>
.expand-enter-active, .expand-leave-active { transition: all 0.3s ease; overflow: hidden; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
.expand-enter-to, .expand-leave-from { max-height: 200px; }
</style>
