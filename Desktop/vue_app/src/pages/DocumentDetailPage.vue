<template>
  <Layout>
    <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue"></div>
    </div>
    <div v-else-if="document" class="max-w-6xl mx-auto">
      <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button @click="router.push('/documents')" class="flex items-center gap-2 text-gray-600 hover:text-medical-blue hover:bg-blue-50 px-3 py-2 rounded-lg -ml-2 transition-colors text-sm">
          <ArrowLeft class="w-4 h-4" />Retour aux documents
        </button>
        <div v-if="auth.currentUser?.role === 'Admin'" class="flex gap-2">
          <RouterLink :to="`/documents/${document.id}/edit`">
            <button class="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"><Edit class="w-4 h-4" />Éditer</button>
          </RouterLink>
          <button @click="handleDelete" class="flex items-center gap-2 px-4 py-2 border border-red-100 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors"><Trash2 class="w-4 h-4" />Supprimer</button>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
        <div class="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-8">
          <div class="flex flex-wrap gap-2 mb-4">
            <PrivacyBadge type="secure" /><PrivacyBadge type="confidential" />
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-600">
              <Calendar class="w-3.5 h-3.5" />{{ document.periode }}
            </span>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{{ document.objet }}</h1>
          <div class="flex flex-wrap items-center gap-6 text-sm text-gray-500">
            <div class="flex items-center gap-2"><Briefcase class="w-4 h-4 text-medical-blue" /><span class="font-medium text-gray-700">{{ document.service || 'Service Général' }}</span></div>
            <div class="flex items-center gap-2"><User class="w-4 h-4 text-medical-blue" /><span class="font-medium text-gray-700">{{ document.auteur }}</span><span class="text-xs bg-blue-50 text-medical-blue px-2 py-0.5 rounded-full">{{ document.poste }}</span></div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
          <div class="lg:col-span-2 p-8">
            <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><FileText class="w-5 h-5 text-gray-400" />Description et Contenu</h2>
            <p class="text-gray-600 leading-relaxed whitespace-pre-wrap">{{ document.description }}</p>

            <div v-if="document.tags" class="mt-8 pt-6 border-t border-gray-100">
              <div class="flex items-center gap-2 mb-3"><Tag class="w-4 h-4 text-gray-400" /><span class="text-sm font-semibold text-gray-700">Mots-clés associés</span></div>
              <div class="flex flex-wrap gap-2">
                <span v-for="(tag, i) in document.tags.split(',')" :key="i" class="px-3 py-1 bg-gray-50 text-gray-600 text-sm rounded-lg border border-gray-200 font-medium hover:bg-blue-50 hover:text-medical-blue hover:border-blue-100 transition-colors cursor-pointer">
                  #{{ tag.trim() }}
                </span>
              </div>
            </div>

            <div class="mt-8 pt-6 border-t border-gray-100">
              <h3 class="text-sm font-bold text-gray-900 mb-3">Sources & Références</h3>
              <ul class="space-y-2">
                <li class="text-sm text-gray-600 flex items-start gap-2"><span class="text-medical-blue mt-1">•</span><span>Base de données clinique interne, ISIS (2023)</span></li>
                <li class="text-sm text-gray-600 flex items-start gap-2"><span class="text-medical-blue mt-1">•</span><span>Rapport annuel de conformité, Ministère de la Santé</span></li>
              </ul>
            </div>
          </div>

          <div class="p-8 bg-gray-50/50 space-y-8">
            <div class="bg-white p-5 rounded-xl border border-green-100 shadow-sm">
              <div class="flex items-start gap-3">
                <div class="p-2 bg-green-50 rounded-lg text-health-green"><ShieldCheck class="w-5 h-5" /></div>
                <div>
                  <h3 class="font-bold text-gray-900 text-sm">Document Vérifié</h3>
                  <p class="text-xs text-gray-500 mt-1">Validé le {{ new Date(document.createdAt).toLocaleDateString() }}.</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Lock class="w-4 h-4 text-gray-400" />Droits d'Accès</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between text-sm"><span class="text-gray-600">Administrateurs</span><span class="text-health-green font-medium text-xs bg-green-50 px-2 py-0.5 rounded">Accès Total</span></div>
                <div class="flex items-center justify-between text-sm"><span class="text-gray-600">Contributeurs</span><span class="text-blue-600 font-medium text-xs bg-blue-50 px-2 py-0.5 rounded">Lecture Seule</span></div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Eye class="w-4 h-4 text-gray-400" />Métadonnées</h3>
              <div class="space-y-3 text-sm border-l-2 border-gray-200 pl-3">
                <div><p class="text-gray-400 text-xs uppercase tracking-wider">Créé par</p><p class="font-medium text-gray-900 mt-1">{{ document.createdByName }}</p></div>
                <div><p class="text-gray-400 text-xs uppercase tracking-wider">Date de création</p><p class="font-medium text-gray-900 mt-1">{{ new Date(document.createdAt).toLocaleString('fr-FR') }}</p></div>
                <div><p class="text-gray-400 text-xs uppercase tracking-wider">ID Unique</p><p class="font-mono text-xs text-gray-600 mt-1 bg-gray-100 inline-block px-2 py-0.5 rounded">{{ document.id }}</p></div>
              </div>
            </div>

            <div v-if="document.qrCode" class="pt-6 border-t border-gray-200">
              <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                <img :src="document.qrCode" alt="QR Code" class="w-32 h-32 mx-auto mb-3" />
                <button @click="downloadQRCode" class="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-gray-50 transition-colors">
                  <Download class="w-3 h-3" />Télécharger QR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center text-xs text-gray-400 pb-8">Ce document est soumis aux règles de confidentialité de l'établissement ISIS.</div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Edit, Trash2, Calendar, User, Briefcase, Tag, Download, ShieldCheck, Eye, FileText, Lock } from 'lucide-vue-next'
import Layout from '@/components/Layout.vue'
import PrivacyBadge from '@/components/PrivacyBadge.vue'
import { useAuthStore } from '@/context/authStore'
import { useToast } from '@/composables/useToast'
import { api } from '@/services/api'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { toast } = useToast()
const document = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const doc = await api.documents.get(route.params.id)
    if (doc) {
      document.value = doc
      await api.history.log({ action: 'VIEW', userId: auth.currentUser.id, userName: `${auth.currentUser.firstName} ${auth.currentUser.lastName}`, details: 'Viewed document', documentId: route.params.id })
    } else {
      toast({ title: 'Document introuvable', variant: 'destructive' })
      router.push('/documents')
    }
  } catch {
    toast({ title: 'Erreur', description: 'Impossible de charger le document', variant: 'destructive' })
  } finally {
    loading.value = false
  }
})

const handleDelete = async () => {
  if (!confirm('Supprimer ce document ?')) return
  try {
    await api.documents.delete(route.params.id, auth.currentUser)
    toast({ title: 'Document supprimé' })
    router.push('/documents')
  } catch {
    toast({ title: 'Erreur', variant: 'destructive' })
  }
}

const downloadQRCode = () => {
  if (!document.value?.qrCode) return
  const link = window.document.createElement('a')
  link.href = document.value.qrCode
  link.download = `qrcode_${document.value.id}.svg`
  link.click()
  toast({ title: 'QR Code téléchargé' })
}
</script>
