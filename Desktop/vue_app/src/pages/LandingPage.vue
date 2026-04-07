<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative"
    style="background: radial-gradient(100% 100% at 50% 100%, #FF9875 0%, #B452FF 15%, #673DE6 30%, #1a1b1e 80%)">
    <Transition name="hero" appear>
      <div class="flex flex-col items-center gap-4 w-full max-w-[448px]">
        <div class="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
          <FolderArchive class="w-12 h-12 text-white" />
        </div>
        <div class="flex flex-col gap-1 w-full text-center">
          <h1 class="text-4xl font-bold text-white">ISIS Archives</h1>
          <p class="text-white/70 text-lg">Plateforme de gestion documentaire </p>
          <RouterLink to="/" class="mt-6">
            <button class="px-8 py-3 bg-white text-gray-900 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5">Se connecter</button>
          </RouterLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { FolderArchive } from 'lucide-vue-next'
</script>

<style scoped>
.hero-enter-active { transition: all 0.8s ease; }
.hero-enter-from { opacity: 0; transform: translateY(-50px); }
</style>
