<template>
  <Layout>
    <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue"></div>
    </div>
    <div v-else class="max-w-2xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Modifier l'Utilisateur</h1>
        <button @click="router.push('/users')" class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
          <X class="w-4 h-4" />Annuler
        </button>
      </div>
      <div class="bg-white rounded-xl shadow-lg p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Prénom <span class="text-red-500">*</span></label>
              <input v-model="form.firstName" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue bg-white text-gray-900 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom <span class="text-red-500">*</span></label>
              <input v-model="form.lastName" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue bg-white text-gray-900 outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email <span class="text-red-500">*</span></label>
            <input v-model="form.email" type="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue bg-white text-gray-900 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rôle <span class="text-red-500">*</span></label>
            <select v-model="form.role" required :disabled="route.params.id === auth.currentUser?.id" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue bg-white text-gray-900 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed">
              <option value="Contributeur">Contributeur</option>
              <option value="Admin">Admin</option>
            </select>
            <p v-if="route.params.id === auth.currentUser?.id" class="mt-2 text-sm text-amber-600">Vous ne pouvez pas modifier votre propre rôle</p>
          </div>
          <div class="flex gap-4 pt-6">
            <button type="submit" :disabled="isSubmitting" class="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-medical-blue to-health-green text-white rounded-lg font-semibold shadow-lg disabled:opacity-70">
              <Save class="w-4 h-4" />{{ isSubmitting ? 'Sauvegarde...' : 'Sauvegarder' }}
            </button>
            <button type="button" @click="router.push('/users')" class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Save, X } from 'lucide-vue-next'
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
const form = ref({ email: '', firstName: '', lastName: '', role: 'Contributeur' })

onMounted(async () => {
  try {
    const user = await api.users.get(route.params.id)
    if (user) { form.value = { email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } }
    else { toast({ title: 'Utilisateur introuvable', variant: 'destructive' }); router.push('/users') }
  } catch { toast({ title: 'Erreur', variant: 'destructive' }) } finally { loading.value = false }
})

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    await api.users.update(route.params.id, form.value)
    if (route.params.id === auth.currentUser?.id) {
      const stored = JSON.parse(localStorage.getItem('currentUser') || '{}')
      localStorage.setItem('currentUser', JSON.stringify({ ...stored, ...form.value }))
    }
    toast({ title: 'Utilisateur mis à jour' })
    router.push('/users')
  } catch (error) {
    toast({ title: 'Erreur', description: error.message || 'Mise à jour impossible', variant: 'destructive' })
  } finally { isSubmitting.value = false }
}
</script>
