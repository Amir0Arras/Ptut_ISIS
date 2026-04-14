<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    <nav class="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <RouterLink to="/dashboard" class="flex items-center space-x-3 group">
            <div class="w-10 h-10 bg-gradient-to-br from-medical-blue to-health-green rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-medical-blue/30 transition-all duration-300 group-hover:scale-105">
              <FolderArchive class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-bold bg-gradient-to-r from-medical-blue to-health-green bg-clip-text text-transparent tracking-tight">ISIS Archives</span>
          </RouterLink>

          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center space-x-2">
            <RouterLink v-for="item in visibleNavItems" :key="item.path" :to="item.path">
              <button :class="['flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300', isActive(item.path) ? 'bg-gradient-to-r from-medical-blue to-health-green text-white shadow-md' : 'text-gray-600 hover:text-medical-blue hover:bg-blue-50']">
                <component :is="item.icon" class="w-4 h-4" />
                <span>{{ item.label }}</span>
              </button>
            </RouterLink>
          </div>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <div class="hidden md:flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div class="text-right">
                <p class="text-sm font-bold text-gray-900 leading-none">{{ auth.currentUser?.firstName }} {{ auth.currentUser?.lastName }}</p>
                <p class="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mt-1">{{ auth.currentUser?.role }}</p>
              </div>
              <div class="w-9 h-9 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center shadow-md ring-2 ring-gray-100">
                <User class="w-4 h-4 text-white" />
              </div>
            </div>

            <RouterLink to="/change-password">
              <button :class="['hidden md:flex items-center justify-center rounded-full w-10 h-10 transition-all', route.path === '/change-password' ? 'bg-blue-50 text-medical-blue' : 'text-gray-500 hover:text-medical-blue hover:bg-blue-50']" title="Changer le mot de passe">
                <Lock class="w-5 h-5" />
              </button>
            </RouterLink>

            <button @click="handleLogout" class="hidden md:flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all rounded-full w-10 h-10" title="Déconnexion">
              <LogOut class="w-5 h-5" />
            </button>

            <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2">
              <X v-if="mobileOpen" class="w-6 h-6" />
              <Menu v-else class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition name="mobile">
        <div v-if="mobileOpen" class="md:hidden bg-white border-t border-gray-200 shadow-lg overflow-hidden">
          <div class="px-4 py-4 space-y-3">
            <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl mb-4 border border-gray-100">
              <div class="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center">
                <User class="w-5 h-5 text-white" />
              </div>
              <div>
                <p class="text-sm font-bold text-gray-900">{{ auth.currentUser?.firstName }} {{ auth.currentUser?.lastName }}</p>
                <p class="text-xs text-gray-500 font-medium">{{ auth.currentUser?.role }}</p>
              </div>
            </div>

            <RouterLink v-for="item in visibleNavItems" :key="item.path" :to="item.path" @click="mobileOpen = false">
              <button :class="['w-full flex items-center text-left px-4 py-2 rounded-xl mb-2 text-sm font-medium', isActive(item.path) ? 'bg-gradient-to-r from-medical-blue to-health-green text-white' : 'text-gray-700 hover:bg-gray-100']">
                <component :is="item.icon" class="w-4 h-4 mr-3" />
                {{ item.label }}
              </button>
            </RouterLink>

            <RouterLink to="/change-password" @click="mobileOpen = false">
              <button :class="['w-full flex items-center text-left px-4 py-2 rounded-xl mb-2 text-sm font-medium', route.path === '/change-password' ? 'bg-gradient-to-r from-medical-blue to-health-green text-white' : 'text-gray-700 hover:bg-gray-100']">
                <Lock class="w-4 h-4 mr-3" />Sécurité du compte
              </button>
            </RouterLink>

            <div class="h-px bg-gray-100 my-2"></div>
            <button @click="handleLogout" class="w-full flex items-center text-left px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 text-sm font-medium">
              <LogOut class="w-4 h-4 mr-3" />Déconnexion
            </button>
          </div>
        </div>
      </Transition>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
      <Transition name="page" mode="out-in">
        <slot />
      </Transition>
    </main>

    <footer class="bg-white border-t border-gray-200 py-8 mt-auto">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-sm text-gray-500 font-medium">&copy; {{ new Date().getFullYear() }} ISIS Archives. Plateforme documentaire Sécurisée.</p>
        <div class="mt-4 flex justify-center space-x-6">
          <span class="text-xs text-gray-400 hover:text-medical-blue cursor-pointer">Confidentialité</span>
          <span class="text-xs text-gray-400 hover:text-medical-blue cursor-pointer">Conditions d'utilisation</span>
          <span class="text-xs text-gray-400 hover:text-medical-blue cursor-pointer">Support Technique</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Menu, X, LogOut, FileText, Users, History, LayoutDashboard, FolderArchive, User, Lock } from 'lucide-vue-next'
import { useAuthStore } from '@/context/authStore'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const mobileOpen = ref(false)

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
  { path: '/documents', label: 'Documents', icon: FileText, adminOnly: false },
  { path: '/users', label: 'Utilisateurs', icon: Users, adminOnly: true },
  { path: '/history', label: 'Historique', icon: History, adminOnly: true },
]

const visibleNavItems = computed(() =>
  navItems.filter(i => !i.adminOnly || auth.currentUser?.role === 'Admin')
)

const isActive = (path) => route.path.startsWith(path)

const handleLogout = () => {
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
.page-enter-active, .page-leave-active { transition: all 0.3s ease; }
.page-enter-from { opacity: 0; transform: translateY(15px); }
.page-leave-to { opacity: 0; transform: translateY(-15px); }
.mobile-enter-active, .mobile-leave-active { transition: all 0.25s ease; }
.mobile-enter-from, .mobile-leave-to { opacity: 0; max-height: 0; }
.mobile-enter-to, .mobile-leave-from { max-height: 600px; }
</style>
