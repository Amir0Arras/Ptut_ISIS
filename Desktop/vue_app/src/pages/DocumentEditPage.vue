<template>
  <Layout>
    <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue"></div>
    </div>
    <div v-else class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Modifier le Document</h1>
      <form @submit.prevent="handleSubmit" class="bg-white p-8 rounded-xl shadow-lg space-y-6">
        <input v-model="form.objet" name="objet" placeholder="Objet" required class="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-medical-blue" />
        <div class="grid grid-cols-2 gap-6">
          <input v-model="form.periode" placeholder="Période" required class="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-medical-blue" />
          <select v-model="form.service" required class="w-full px-4 py-3 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-medical-blue">
            <option value="">Sélectionner un service</option>
            <option v-for="s in services" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-6">
          <input v-model="form.auteur" placeholder="Auteur" required class="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-medical-blue" />
          <input v-model="form.poste" placeholder="Poste" class="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-medical-blue" />
        </div>
        <textarea v-model="form.description" placeholder="Description" rows="6" required class="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-medical-blue" />
        <input v-model="form.tags" placeholder="Tags (séparés par des virgules)" class="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-medical-blue" />
        <div class="flex gap-4">
          <button type="submit" :disabled="isSubmitting" class="flex-1 flex items-center justify-center gap-2 py-3 bg-medical-blue text-white rounded-lg font-semibold disabled:opacity-70">
            <Save class="w-4 h-4" />{{ isSubmitting ? 'Sauvegarde...' : 'Sauvegarder' }}
          </button>
          <button type="button" @click="router.push('/documents')" class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Annuler</button>
        </div>
      </form>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Save } from 'lucide-vue-next'
import Layout from '@/components/Layout.vue'
import { useAuthStore } from '@/context/authStore'
import { useToast } from '@/composables/useToast'
import { api } from '@/services/api'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { toast } = useToast()
const loading = ref(true)
const isSubmitting = ref(false)
const form = ref({ objet: '', periode: '', auteur: '', poste: '', service: '', description: '', tags: '' })
const services = ['Cardiologie', 'Neurologie', 'Pédiatrie', 'Urgences', 'Administration', 'Ressources Humaines', 'Laboratoire', 'Radiologie']

onMounted(async () => {
  try {
    const doc = await api.documents.get(route.params.id)
    if (doc) { form.value = { objet: doc.objet, periode: doc.periode, auteur: doc.auteur, poste: doc.poste, service: doc.service || '', description: doc.description, tags: doc.tags } }
    else { toast({ title: 'Erreur', description: 'Document introuvable', variant: 'destructive' }); router.push('/documents') }
  } catch { toast({ title: 'Erreur', variant: 'destructive' }) } finally { loading.value = false }
})

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    await api.documents.update(route.params.id, form.value, auth.currentUser)
    toast({ title: 'Succès', description: 'Document mis à jour' })
    router.push(`/documents/${route.params.id}`)
  } catch { toast({ title: 'Erreur', description: 'Mise à jour impossible', variant: 'destructive' }) }
  finally { isSubmitting.value = false }
}
</script>
