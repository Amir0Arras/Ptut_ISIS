<template>
  <Layout>
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Créer un Document</h1>
        <button @click="router.push('/documents')" class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <X class="w-4 h-4" />Annuler
        </button>
      </div>
      <div class="bg-white rounded-xl shadow-lg p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Objet <span class="text-red-500">*</span></label>
            <input v-model="form.objet" required placeholder="Titre du document"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent transition-all text-gray-900 bg-white outline-none" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Période <span class="text-red-500">*</span></label>
              <input v-model="form.periode" required placeholder="ex: 2024, Q1 2024"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent transition-all text-gray-900 bg-white outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Service / Catégorie <span class="text-red-500">*</span></label>
              <select v-model="form.service" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent transition-all text-gray-900 bg-white outline-none">
                <option value="">Sélectionner un service</option>
                <option v-for="s in services" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Auteur <span class="text-red-500">*</span></label>
              <input v-model="form.auteur" required placeholder="Nom de l'auteur"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent transition-all text-gray-900 bg-white outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Poste <span class="text-red-500">*</span></label>
              <input v-model="form.poste" required placeholder="Poste / Fonction"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent transition-all text-gray-900 bg-white outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description <span class="text-red-500">*</span></label>
            <textarea v-model="form.description" required rows="6" placeholder="Description détaillée"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent transition-all text-gray-900 bg-white outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tags <span class="text-red-500">*</span></label>
            <input v-model="form.tags" required placeholder="Séparés par des virgules"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent transition-all text-gray-900 bg-white outline-none" />
          </div>
          <div class="flex gap-4 pt-6">
            <button type="submit" :disabled="isSubmitting"
              class="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-medical-blue to-health-green hover:from-medical-blue-dark hover:to-health-green-dark text-white rounded-lg font-semibold shadow-lg disabled:opacity-70 transition-all">
              <Save class="w-4 h-4" />{{ isSubmitting ? 'Création...' : 'Créer le Document' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Save, X } from 'lucide-vue-next'
import Layout from '@/components/Layout.vue'
import { useAuthStore } from '@/context/authStore'
import { useToast } from '@/composables/useToast'
import { api } from '@/services/api'
import { generateQRCode } from '@/utils/qrCodeGenerator'

const auth = useAuthStore()
const { toast } = useToast()
const router = useRouter()
const isSubmitting = ref(false)

const form = ref({ objet: '', periode: '', auteur: '', poste: '', service: '', description: '', tags: '' })
const services = ['Cardiologie', 'Neurologie', 'Pédiatrie', 'Urgences', 'Administration', 'Ressources Humaines', 'Laboratoire', 'Radiologie']

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const qrCode = await generateQRCode({ id: 'temp', ...form.value })
    await api.documents.create({ ...form.value, qrCode }, auth.currentUser)
    toast({ title: 'Document créé', description: 'Votre document a été créé avec succès' })
    router.push('/documents')
  } catch {
    toast({ title: 'Erreur', description: 'Impossible de créer le document', variant: 'destructive' })
  } finally {
    isSubmitting.value = false
  }
}
</script>
