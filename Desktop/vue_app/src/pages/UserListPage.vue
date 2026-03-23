<template>
  <Layout>
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p class="text-gray-600 mt-1">{{ users.length }} utilisateurs enregistrés</p>
        </div>
        <RouterLink to="/users/create">
          <button class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-medical-blue to-health-green text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all text-sm">
            <Plus class="w-4 h-4" />Créer un utilisateur
          </button>
        </RouterLink>
      </div>

      <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue"></div>
      </div>
      <template v-else>
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gradient-to-r from-medical-blue to-health-green text-white">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-semibold">Nom</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold">Rôle</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold">Statut</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold">Créé</th>
                  <th class="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-gradient-to-br from-medical-blue to-health-green rounded-full flex items-center justify-center text-white font-semibold">{{ user.firstName[0] }}{{ user.lastName[0] }}</div>
                      <p class="ml-3 font-semibold text-gray-900">{{ user.firstName }} {{ user.lastName }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-gray-700">{{ user.email }}</td>
                  <td class="px-6 py-4">
                    <span :class="['inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold', user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700']">
                      <Shield v-if="user.role === 'Admin'" class="w-3 h-3 mr-1" /><UserCheck v-else class="w-3 h-3 mr-1" />{{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span v-if="user.passwordChangeRequired" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Changement requis</span>
                    <span v-else class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Actif</span>
                  </td>
                  <td class="px-6 py-4 text-gray-700 text-sm">{{ new Date(user.createdAt).toLocaleDateString() }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-center gap-2">
                      <RouterLink :to="`/users/${user.id}/edit`">
                        <button class="p-2 border border-health-green text-health-green hover:bg-green-50 rounded-lg transition-colors"><Edit class="w-4 h-4" /></button>
                      </RouterLink>
                      <button v-if="user.id !== auth.currentUser?.id" @click="handleDelete(user.id)" class="p-2 border border-red-500 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 class="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="users.length === 0" class="text-center py-12 bg-white rounded-xl shadow-lg mt-6">
          <Users class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Aucun utilisateur</h3>
          <p class="text-gray-600 mb-6">Créez votre premier utilisateur pour commencer</p>
          <RouterLink to="/users/create">
            <button class="flex items-center gap-2 mx-auto px-4 py-2 bg-gradient-to-r from-medical-blue to-health-green text-white rounded-lg font-medium"><Plus class="w-4 h-4" />Créer un utilisateur</button>
          </RouterLink>
        </div>
      </template>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Users, Plus, Edit, Trash2, Shield, UserCheck } from 'lucide-vue-next'
import Layout from '@/components/Layout.vue'
import { useAuthStore } from '@/context/authStore'
import { useToast } from '@/composables/useToast'
import { api } from '@/services/api'

const auth = useAuthStore()
const { toast } = useToast()
const users = ref([])
const loading = ref(true)

const loadUsers = async () => {
  try { users.value = await api.users.list() }
  catch { toast({ title: 'Erreur', description: 'Impossible de charger les utilisateurs', variant: 'destructive' }) }
  finally { loading.value = false }
}

onMounted(loadUsers)

const handleDelete = async (userId) => {
  if (!confirm('Supprimer cet utilisateur ?')) return
  try {
    await api.users.delete(userId)
    toast({ title: 'Utilisateur supprimé' })
    loadUsers()
  } catch { toast({ title: 'Erreur', variant: 'destructive' }) }
}
</script>
