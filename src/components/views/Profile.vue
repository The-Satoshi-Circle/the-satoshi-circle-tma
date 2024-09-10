<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../../common/store';

const router = useRouter();

const userProfile = ref({
  username: '{ USER }',
  avatar: '/SatoshiAvatar.png',
});

const viewNFT = () => {
  // Esempio di reindirizzamento a una pagina di modifica del profilo
  router.push('/viewNFT');
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center py-10">
    <!-- Avatar e Nome Utente -->
    <div class="bg-white shadow-lg rounded-lg p-6 w-80 max-w-lg">
      <div class="flex items-center space-x-6 mb-4">
        <img :src="userProfile.avatar" alt="Avatar" class="w-24 h-24 rounded-full shadow-md">
        <div>
          <h2 class="text-2xl font-semibold text-gray-800">{{ store.user.firstName }} {{ store.user.lastName }}</h2>
          <p class="text-gray-600">@{{ store.user.username }}</p>
        </div>
      </div>
      <!-- Biografia -->
      <p class="text-gray-700 mb-6">{{ userProfile.bio }}</p>
      <!-- Pulsante per Visualizzare gli NFT -->
      <div class="flex justify-end">
        <button @click="viewNFT" class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 focus:outline-none">
          Vedi i tuoi NFT
        </button>
      </div>
    </div>
  </div>
</template>