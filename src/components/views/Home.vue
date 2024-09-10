<script setup>
import { ref, onMounted } from 'vue';
import { initHapticFeedback } from '@telegram-apps/sdk';
import Modal from '../modals/Modal.vue';
import Button from '../common/Button.vue';
import { store } from '../../common/store';
import ProfileMenu from '../common/ProfileMenu.vue';

const jettonSymbol = ref(import.meta.env.VITE_JETTON_SYMBOL);
const hapticFeedback = initHapticFeedback();
const bounceKey = ref(0);
const modalOpen = ref(false);
const modalTitle = ref('');
const modalDescription = ref('');
const showInstructionsModal = ref(false);
const isAnimating = ref(false);
const showCounter = ref(false);
const counterValue = ref(1);
const hasClickedUsername = ref(false);

const handleClick = (event) => {
  hapticFeedback.impactOccurred('heavy');
  store.incrementAmount();
  isAnimating.value = true;
  setTimeout(() => {
    isAnimating.value = false;
  }, 500);

  showCounter.value = true;
  counterValue.value = 1; // 1 di default, da dinamicizzare
  setTimeout(() => {
    showCounter.value = false;
  }, 200); // durata animazione
  bounceKey.value += 1;
};

const openModal = () => {
  modalOpen.value = true;
  modalTitle.value = "Grazie!";
  modalDescription.value = "Se visualizzi questo testo, il bottone funziona. Il tuo feedback è prezioso";
};

const sendTransaction = () => {
  store.telegram.sendTransaction();
};

const showUsernameInstructions = () => {
  if (store.user.username === null || store.user.username !== '') {
    showInstructionsModal.value = true;
  }
};

const animateTimeout = ref(null);
const isIconAnimated = ref(null);

let unsubscribeModal = null;
onMounted(() => {
  animateTimeout.value = setTimeout(() => {
    isIconAnimated.value = false;

    if (animateTimeout.value) {
      clearTimeout(animateTimeout.value);
    }
  }, 500);
});
</script>
<template>
  <div class="min-h-full">
    <div class="flex flex-col items-center p-3">
      <!-- Centered and 3D effect for currentAmount and jettonSymbol -->
      <div class="text-center flex flex-col items-center mt-10">
        <div class="text-4xl sm:text-2xl text-white font-mono font-bold">
          {{ store.currentAmount }}
        </div>

        <div class="text-4xl sm:text-2xl text-orange-600 font-mono font-bold">
          {{ jettonSymbol }}
        </div>
      </div>

      <div class="text-center flex flex-col flex-1 justify-start mt-5">
        <div class="flex-1 flex flex-col justify-center content-center">
          <div class="flex justify-center">
            <div class="cursor-pointer" @click="handleClick">
              <img src="/ToshiIcon.png" :key="bounceKey" :class="{ 'animate-bounce': isAnimating }"
                class="max-w-full h-auto" alt="toshi-coin" />
            </div>
          </div>
        </div>

        <div class="flex flex-col text-white text-center">
          <div class="uppercase text-xs">Daily taps</div>
          <div class="font-mono font-bold">{{ store.user?.daily_taps }}/{{ store.maxDailyTaps }}</div>
        </div>

        <div class="flex justify-center mt-3">
          <Button @click="sendTransaction()">
            Test transazione
          </Button>
        </div>
      </div>

      <Modal :isOpen="modalOpen" @close="modalOpen = false" :confirmButtonEnabled="false" :cancelButtonText="'Ok'"
        :title="modalTitle">
        <p class="text-center">
          {{ modalDescription }}
        </p>
      </Modal>

      <Modal :isOpen="showInstructionsModal" @close="showInstructionsModal = false" :confirmButtonEnabled="false"
        :cancelButtonText="'Close'" :title="'Come impostare il tuo username Telegram'">
        <p>Segui questi semplici passaggi:<br><br></p>
        <ol class="list-decimal ml-5">
          <li>Apri l'app di Telegram.</li>
          <li>Vai sul menu "Impostazioni".</li>
          <li>Clicca su "Username" e imposta l'username che preferisci.</li>
          <li>Salva.</li>
        </ol>
        <br>
        <p>Apri nuovamente l'app per visualizzare il tuo username.</p>
      </Modal>
    </div>

    <transition enter-active-class="transition-opacity duration-1000" enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-1000" leave-to-class="opacity-0">
      <div v-if="showCounter"
        class="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-blue-500 text-xl font-bold">
        +{{ counterValue }}
      </div>
    </transition>
  </div>
</template>
