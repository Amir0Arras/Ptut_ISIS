import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/context/authStore'

const routes = [
  { path: '/', component: () => import('@/pages/LoginPage.vue') },
  { path: '/login', redirect: '/' },
  { path: '/welcome', component: () => import('@/pages/HomePage.vue') },
  {
    path: '/change-password',
    component: () => import('@/pages/ChangePasswordPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/documents',
    component: () => import('@/pages/DocumentListPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/documents/create',
    component: () => import('@/pages/DocumentCreatePage.vue'),
    meta: { requiresAuth: true, allowedRoles: ['Admin', 'Contributeur'] }
  },
  {
    path: '/documents/:id',
    component: () => import('@/pages/DocumentDetailPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/documents/:id/edit',
    component: () => import('@/pages/DocumentEditPage.vue'),
    meta: { requiresAuth: true, allowedRoles: ['Admin'] }
  },
  {
    path: '/users',
    component: () => import('@/pages/UserListPage.vue'),
    meta: { requiresAuth: true, allowedRoles: ['Admin'] }
  },
  {
    path: '/users/create',
    component: () => import('@/pages/UserCreatePage.vue'),
    meta: { requiresAuth: true, allowedRoles: ['Admin'] }
  },
  {
    path: '/users/:id/edit',
    component: () => import('@/pages/UserEditPage.vue'),
    meta: { requiresAuth: true, allowedRoles: ['Admin'] }
  },
  {
    path: '/history',
    component: () => import('@/pages/HistoryPage.vue'),
    meta: { requiresAuth: true, allowedRoles: ['Admin'] }
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/')
  }

  if (auth.isAuthenticated && auth.currentUser?.passwordChangeRequired && to.path !== '/change-password') {
    return next('/change-password')
  }

  if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(auth.currentUser?.role)) {
    return next('/dashboard')
  }

  next()
})

export default router
