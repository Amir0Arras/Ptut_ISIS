<template>
  <Layout>
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Créer un Utilisateur</h1>
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
            <label class="block text-sm font-medium text-gray-700 mb-2">Mot de passe initial</label>
            <div class="relative">
              <input v-model="form.password" :type="showPwd ? 'text' : 'password'" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue bg-white text-gray-900 outline-none pr-10" />
              <button type="button" @click="showPwd = !showPwd" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <EyeOff v-if="showPwd" class="w-5 h-5" /><Eye v-else class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rôle <span class="text-red-500">*</span></label>
            <select v-model="form.role" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue bg-white text-gray-900 outline-none">
              <option value="Contributeur">Contributeur</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <!-- Direction -->
<div>
  <label class="block text-sm font-medium text-gray-700 mb-2">
    Direction <span class="text-red-500">*</span>
  </label>
  <select v-model="form.direction" required
    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue bg-white text-gray-900 outline-none">
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

<!-- Fonction des droits -->
<div>
  <label class="block text-sm font-medium text-gray-700 mb-2">
    Fonction des droits <span class="text-red-500">*</span>
  </label>
  <select v-model="form.permissions" required
    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue bg-white text-gray-900 outline-none">
    <option value="MODIFICATION">Modification (visualisation + modifier)</option>
    <option value="CONSULTATION">Consultation (lecture seule)</option>
  </select>
</div>
          <div class="flex gap-4 pt-6">
            <button type="submit" :disabled="isSubmitting" class="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-medical-blue to-health-green text-white rounded-lg font-semibold shadow-lg disabled:opacity-70">
              <Save class="w-4 h-4" />{{ isSubmitting ? 'Création...' : 'Créer l\'utilisateur' }}
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
import { Save, X, Eye, EyeOff } from 'lucide-vue-next'
import Layout from '@/components/Layout.vue'
import { useToast } from '@/composables/useToast'
import { api } from '@/services/api'

const { toast } = useToast()
const router = useRouter()
const isSubmitting = ref(false)
const showPwd = ref(false)
const form = ref({
  email: '',
  firstName: '',
  lastName: '',
  role: 'Contributeur',
  password: 'changeme123',
  direction: 'RH',
  permissions: 'CONSULTATION'
})

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    await api.users.create(form.value)
    toast({ title: 'Utilisateur créé', description: 'Nouvel utilisateur créé avec succès' })
    router.push('/users')
  } catch (error) {
    toast({ title: 'Erreur', description: error.message || 'Impossible de créer l\'utilisateur', variant: 'destructive' })
  } finally { isSubmitting.value = false }
}
</script>
