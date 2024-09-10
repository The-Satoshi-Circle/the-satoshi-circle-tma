<script setup>
import { store } from '../../common/store';
import { ref, computed, onMounted } from 'vue';
import { CheckIcon, DocumentDuplicateIcon, WalletIcon } from '@heroicons/vue/24/solid';
import useClickOutside from '../../composables/useClickOutside.js';
import TONIcon from './TONIcon.vue';

const jettonSymbol = ref(import.meta.env.VITE_JETTON_SYMBOL);

const shortenAddress = (address) => {
  if (address.length <= 14) {
    return address;
  }

  return address.substring(0, 9) + "..." + address.substring(address.length - 9);
}

const abbreviateNumber = (x) => {
  // if (x >= 1000000) {
  //   return (x / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  // } else if (x >= 1000) {
  //   return (x / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  // } else {
  //   return x.toString();
  // }
  return x.toString();
}

const copied = ref(false);
const copyWalletAddressToClipboard = (address) => {
  navigator.clipboard.writeText(address);
  copied.value = true;
}

const connectWallet = async () => {
  await store.telegram.tonConnectUI.openModal();
}

const walletDropdownOpen = ref(false);
const walletDropdownClass = computed(() => {
  return { 'hidden': !walletDropdownOpen.value }
})

const openWalletDropdown = () => {
  walletDropdownOpen.value = !walletDropdownOpen.value;
}

const disconnectWallet = async () => {
  await store.telegram.tonConnectUI.disconnect();

  store.telegram.walletAccount = null;
}

const componentRef = ref()
const excludeRef = ref()

useClickOutside(
  componentRef,
  () => {
    walletDropdownOpen.value = false
  },
  excludeRef
)

let unsubscribeModal = null;

onMounted(async () => {
  await store.telegram.initConnectWalletButton('ton-connect-button');

  unsubscribeModal = store.telegram.tonConnectUI.onModalStateChange(
    (state) => {
      if (state.status === 'closed' && state.closeReason === 'wallet-selected') {
        store.telegram.initWallet();
      }
    }
  );
})
</script>

<template>
  <div class="flex my-1 mx-3 p-2 rounded-xl bg-gray-800">
    <RouterLink :to="'/profile'">
      <div class="flex rounded-full">
        <div class="ml-1 flex flex-col rounded-full aspect-square bg-black border border-stone-700 justify-center">
          <img src="/SatoshiAvatar.png" alt="Avatar" class="w-8 h-8 rounded-full shadow-md">
        </div>
        <div class="font font-black flex flex-col">
          <div class="text-xs pt-1 pl-2 flex-1 pr-4 text-nowrap text-ellipsis">
            {{ store.user?.username ?? store.user?.first_name }}
          </div>
          <div class="flex pl-2 pr-4">
            <div class="text-[10px] text-nowrap text-ellipsis text-amber-300 pr-2">
              {{ abbreviateNumber(store.user?.coins) }} {{ jettonSymbol }}
            </div>
          </div>
        </div>
      </div>
    </RouterLink>
    <div class="flex-1 text-right flex flex-col justify-center">
      <div v-if="!store.telegram.walletAccount">
        <button class="rounded-xl bg-[#1c93e3] py-1 px-2" @click="connectWallet()">
          <TONIcon></TONIcon>

          <div class="text-center fixed mr-3 right-0 mt-4 w-[70vw] z-50 bg-stone-700 rounded-lg shadow font">
            <div
              class="absolute top-[-40%] right-0 mt-2 mr-8 h-3 w-3 z-50 bg-stone-700 transform rotate-[135deg] origin-bottom-right rounded-sm">
            </div>
            <div class="text-xs p-3">Connect your TON wallet!</div>
          </div>
        </button>
      </div>
      <div v-else>
        <button ref="excludeRef" class="rounded-xl bg-stone-700 py-1.5 px-2" @click="openWalletDropdown()">
          <WalletIcon class="size-5"></WalletIcon>
        </button>
        <div id="wallet-dropdown" ref="componentRef" :class="walletDropdownClass"
          class="text-center fixed mr-5 right-0 mt-1 w-[70vw] z-50 bg-stone-700 rounded-lg shadow-2xl font">
          <div class="text-xs px-4 pt-5">Your TON wallet is connected!</div>
          <div class="text-xs px-4 pt-1 flex justify-center">
            <div class="bg-stone-800 py-1 px-3 rounded">
              {{ shortenAddress(store.telegram.walletAccount.publicKey) }}
            </div>
            <div class="ml-1 bg-stone-800 py-1 px-3 rounded"
              @click="copyWalletAddressToClipboard(store.telegram.walletAccount.publicKey)">
              <DocumentDuplicateIcon v-if="!copied" class="size-4"></DocumentDuplicateIcon>
              <CheckIcon v-if="copied" class="size-4"></CheckIcon>
            </div>
          </div>
          <ul class="mt-3 py-1 text-sm text-stone-400 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-stone-800 dark:hover:text-white"
                @click="disconnectWallet()">Disconnect wallet</a>
            </li>
          </ul>
        </div>
      </div>
      <button id="ton-connect-button" type="button"></button>
    </div>
  </div>
</template>

<style scoped>
#ton-connect-button {
  display: none !important;
}
</style>