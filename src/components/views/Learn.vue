<template>
  <div class="task-container">
    <h2 class="text-black text-center text-2xl font-black mb-5">Unisciti alla community di Satoshi</h2>


    <div class="task-item" v-for="task in tasks">
      <img :src="taskImage(task.id)" class="task-icon" />
      <p class="task-text">{{ task.name }}</p>
      <a :href="task.url" class="task-button" target="_blank" @click="completeTask(task.id)" v-if="!task.done">
        Start
      </a>
      <div v-if="task.done" class="text-green-600">
        <CheckCircleIcon class="size-10"></CheckCircleIcon>
      </div>
    </div>
  </div>

  <Modal :isOpen="modalOpen" @close="modalOpen = false" :confirmButtonEnabled="false" :cancelButtonText="'Ok'"
    :title="modalTitle">
    <p class="text-center">
      {{ modalDescription }}
    </p>
  </Modal>
</template>

<script setup>
import { onActivated, onMounted, ref } from 'vue';
import { store } from '../../common/store';
import { CheckCircleIcon } from '@heroicons/vue/24/solid';
import Modal from '../modals/Modal.vue';

const tasks = ref([]);

const modalOpen = ref(false);
const modalTitle = ref('');
const modalDescription = ref('');

// @todo: put images on db
const taskImage = (id) => {
  return `${import.meta.env.VITE_WEB_APP_BASE_URL}logo${id}.png`;
}

const completeTask = async (taskId) => {
  const response = await store.api.saveTask(taskId);

  if (response.status === 'success') {
    modalOpen.value = true;
    modalTitle.value = 'Task completato!';
    modalDescription.value = `Hai ricevuto ${response.new_coins} ${import.meta.env.VITE_JETTON_SYMBOL} come ricompensa!`

    store.user.coins += parseInt(response.new_coins);

    const response = await store.api.getTasks();

    tasks.value = response.tasks;
  }
}

onActivated(async () => {
  const response = await store.api.getTasks();

  tasks.value = response.tasks;
});
</script>

<style scoped>
.task-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  /* Sfondo con gradiente grigio chiaro */
  border-radius: 16px;
  /* Bordi arrotondati maggiori */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  /* Ombra più morbida e pronunciata */
  text-align: left;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 12px;
  background-color: white;
  /* Sfondo bianco per le task */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  /* Leggera ombra per ogni task */
  transition: transform 0.3s ease;
  /* Transizione per hover */
}

.task-item:hover {
  transform: translateY(-5px);
  /* Sollevamento al passaggio del mouse */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  /* Ombra più pronunciata al passaggio del mouse */
}

.task-text {
  font-size: 1.125rem;
  color: #374151;
  /* Colore del testo */
}

.task-button {
  background: linear-gradient(135deg, #229ED9, #229ED9);
  /* Gradient per i bottoni */
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
  transition: background 0.3s ease, transform 0.2s ease;
  /* Transizione per sfondo e trasformazione */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  /* Aggiunge ombra al bottone */
}

.task-button:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  /* Colore più scuro al passaggio del mouse */
  transform: translateY(-3px);
  /* Leggero sollevamento al passaggio del mouse */
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  /* Aumenta l'ombra al passaggio del mouse */
}

.task-icon {
  width: 64px;
  /* Dimensione dell'icona */
  height: 64px;
  margin-right: 10px;
  /* Spazio tra l'icona e il testo */
  border-radius: 5%;
  /* Arrotonda gli angoli dell'immagine */
}
</style>