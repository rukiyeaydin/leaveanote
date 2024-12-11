<script setup>
import { ref } from 'vue';

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
</script>

<template>
    <div class="fixed p-4 h-[calc(100vh-60px)] bg-[#222831] text-white">
      <div v-if="showContent">
        <p class="font-bold text-2xl border-b-2 mb-5 pb-2 border-[rgb(0,173,181)]">Kişiler</p>
        <ul class="custom-scrollbar overflow-y-auto max-h-[calc(100vh-180px)] pr-2">
          <li 
            v-for="(person, index) in people" 
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
    <i 
      v-if="showContent"
      @click="toggleContent('left')" 
      class="absolute fa-solid fa-caret-left text-3xl cursor-pointer bg-[#00adb5] rounded-full left-60 sm:left-64 text-white max-h-min px-2"></i>
</template>