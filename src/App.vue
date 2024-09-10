<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { store } from './common/store'

import Navbar from './components/common/Navbar.vue'
import Header from './components/common/Header.vue'

const router = useRouter()

const loading = ref(true);
const preventCollapse = function (event) {
  if (window.scrollY === 0) {
    window.scrollTo(0, 1);
  }
}

onMounted(async () => {
  await store.init()
  loading.value = false;
  store.ui.show();
  router.push('/home');
})
</script>

<template>

  <div class="relative z-10 bg-cover bg-center" :style="{ backgroundImage: `url('/bg-image.webp')` }">
    <div class="flex flex-col h-[100vh] bg-black/60">
      <div id="content" class="flex-1 flex-col overflow-auto" v-on:touchstart="preventCollapse(event)">
        <div id="header-container" v-if="store.ui.showHeader" class="fixed w-full">
          <Header></Header>
        </div>
        <div class="flex-1 min-h-full pt-14">
          <div class="min-h-full p-4">
            <router-view v-slot="{ Component }">
              <keep-alive>
                <component :is="Component" />
              </keep-alive>
            </router-view>
          </div>
        </div>
      </div>
      <div id="navbar-container" v-if="store.ui.showNavbar" class="relative p-3">
        <Navbar class="relative z-20"></Navbar>
      </div>
    </div>
  </div>
</template>

<style>
</style>