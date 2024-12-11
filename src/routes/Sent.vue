<script setup>
import { ref } from 'vue';

const isEditing = ref(false);

const notes = ref([
{ name: 'Ali Veli', message: 'Sana her zaman destek olacağım.Sana her zaman destek olacağım.' },
{ name: 'Ayşe Fatma', message: 'Harika bir iş çıkardın, tebrikler!' },
{ name: 'Mehmet Can', message: 'Birlikte çalışmaktan çok keyif aldım.' },
{ name: 'Zehra Nur', message: 'Başarılarının devamını dilerim.' },
]);

const openNote = ref(null);

const toggleNote = (index) => {
openNote.value = openNote.value === index ? null : index;
};



</script>

<template>
    <div class="w-full flex flex-col items-center p-5">
        <h2 class="text-xl font-semibold mb-4">Gönderdiklerin</h2>
        <div class="w-full max-w-lg space-y-4">
            <div
                v-for="(note, index) in notes"
                :key="index"
                class="border rounded-lg p-4 bg-gray-100 dark:bg-gray-800 dark:text-white mx-2"
            >
                <div 
                class="cursor-pointer flex justify-between items-center"
                @click="toggleNote(index)"
                >
                <span class="font-semibold">{{ note.name }}</span>
                <i :class="openNote === index ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"></i>
                </div>

                <div v-if="openNote === index" class="mt-2 text-gray-700 dark:text-gray-300 relative">

                    <div>
                        <p v-if="!isEditing" class="break-words whitespace-normal w-11/12">{{ note.message }}</p>
                        <textarea name="message" id="" :value="note.message" class="w-full outline-none mt-8 px-2 rounded-md h-40 resize-none " v-if="isEditing"></textarea>

                    </div>
                    
                    <div class="absolute top-0 right-0">
                        <i class="fa-solid fa-pen-to-square cursor-pointer hover:text-slate-500" @click="isEditing=true" v-if="!isEditing"></i>
                        
                        <button class="text-black ml-3" v-if="isEditing" @click="isEditing=false">İptal</button>
                        <button class="text-black ml-3" v-if="isEditing">Kaydet</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  