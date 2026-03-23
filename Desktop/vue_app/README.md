# ISIS Archives - Vue.js

Conversion de l'application React vers Vue.js 3.

## Stack

- **Vue 3** (Composition API + `<script setup>`)
- **Vue Router 4** (avec navigation guards, remplace React Router)
- **Pinia** (store d'authentification, remplace React Context)
- **Tailwind CSS** (identique à la version React)
- **lucide-vue-next** (remplace lucide-react)

## Structure

```
src/
├── context/
│   └── authStore.js        ← Pinia store (remplace AuthContext.jsx)
├── composables/
│   └── useToast.js         ← Composable toast (remplace useToast hook)
├── router/
│   └── index.js            ← Vue Router avec guards (remplace ProtectedRoute)
├── services/
│   └── api.js              ← API mock (identique)
├── utils/
│   └── qrCodeGenerator.js  ← Util QR (identique)
├── components/
│   ├── Layout.vue
│   ├── PrivacyBadge.vue
│   └── Toaster.vue
├── pages/
│   ├── LoginPage.vue
│   ├── HomePage.vue
│   ├── DashboardPage.vue
│   ├── DocumentListPage.vue
│   ├── DocumentCreatePage.vue
│   ├── DocumentDetailPage.vue
│   ├── DocumentEditPage.vue
│   ├── ChangePasswordPage.vue
│   ├── UserListPage.vue
│   ├── UserCreatePage.vue
│   ├── UserEditPage.vue
│   └── HistoryPage.vue
├── App.vue
└── main.js
```

## Installation

```bash
npm install
npm run dev
```

## Comptes de démo

- **Admin**: admin@isis.com / admin123
- **Contributeur**: contributeur@isis.com / contrib123
