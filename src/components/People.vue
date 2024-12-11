<script setup>

import { onAuthStateChanged } from '../firebase/firebase.js';
import { auth } from '../firebase/firebase.js';
import { ref, computed } from 'vue';

const props = defineProps({
  people: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['person-click']);

const handlePersonClick = (person) => {
  emit('person-click', person); 
};

const showContent = ref(true);

const toggleContent = (direction) => {
  if (direction === 'left') {
    showContent.value = false;
  } else if (direction === 'right') {
    showContent.value = true;
  }
};

const currentUser = ref(null);

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser.value = user; 
  } else {
    currentUser.value = null; 
  }
});

const filteredPeople = computed(() => {
  if (!currentUser.value) return props.people; 
  return props.people.filter(person => person.email !== currentUser.value.email); 
})

</script>

<template>
    <div class="fixed p-4 h-[calc(100vh-60px)] bg-[#222831] text-white">
      <i 
      v-if="showContent"
      @click="toggleContent('left')" 
      class="absolute right-0 top-0 fa-solid fa-caret-left text-3xl cursor-pointer bg-[#00adb5] rounded-l-lg text-white max-h-min px-2"></i>
      <div v-if="showContent">
        <p class="font-bold text-2xl border-b-2 mb-5 pb-2 border-[rgb(0,173,181)]">Kişiler</p>
        <ul class="custom-scrollbar overflow-y-auto max-h-[calc(100vh-180px)] pr-2">
          <li 
            v-for="(person, index) in filteredPeople" 
            :key="index" 
            @click="handlePersonClick(person)"
            class="p-4 mb-3 rounded-xl bg-[#393E46] shadow-lg flex items-center hover:bg-gray-600 transition-all duration-200 cursor-pointer">
            <div class="basharf w-12 h-12 rounded-full bg-[#00adb5] flex items-center justify-center text-white font-bold mr-4 text-lg">
              {{ person.name.charAt(0).toUpperCase() }}
            </div>
            <div class="w-36 sm:w-40">
              <p class="long-text font-semibold">{{ person.name }}</p>
              <p class="long-text text-gray-400 text-sm">@{{ person.username }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <i 
      v-if="!showContent"
      @click="toggleContent('right')" 
      class="absolute left-8 fa-solid fa-caret-right text-3xl cursor-pointer bg-[#00adb5] rounded-br-lg text-white max-h-min px-2"
    ></i>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 8px; 
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #393E46; 
    border-radius: 10px; 
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #00adb5;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #15d8e2;
}
.long-text {
    word-wrap: break-word; /* Kelimeleri kırarak yeni satıra geçmesini sağlar */
    word-break: break-word; /* Gerekirse kelimeyi bölerek taşmayı önler */
    white-space: normal; /* Tek bir satırda kalmasını engeller, sarma yapar */
    overflow-wrap: break-word; /* Modern tarayıcılarda kelime bölme desteği */
}
</style>
