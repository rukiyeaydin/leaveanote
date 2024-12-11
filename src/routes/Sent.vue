<script setup>
import { ref, onMounted } from 'vue';
import { getDocs, collection, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

const notes = ref([]); 
const openNote = ref(null);
const isEditing = ref(false);

const toggleNote = (index) => {
  openNote.value = openNote.value === index ? null : index;
};

const fetchNotes = async () => {
  try {
    const user = auth.currentUser; 
    if (!user) return;

    const notesQuery = query(
      collection(db, 'notes'),
      where('from.id', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(notesQuery);
    const fetchedNotes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    notes.value = fetchedNotes;
  } catch (error) {
    console.error('Error fetching notes:', error);
  }
};

onMounted(() => {
  fetchNotes();
});
</script>

<template>
    <div class="w-full flex flex-col items-center p-5">
      <h2 class="text-xl font-semibold mb-4">Gönderdiklerin</h2>
      <div class="w-full max-w-lg space-y-4">
        <div
          v-for="(note, index) in notes"
          :key="note.id"
          class="border rounded-lg p-4 bg-gray-100 dark:bg-gray-800 dark:text-white mx-2"
        >
          <div
            class="cursor-pointer flex justify-between items-center"
            @click="toggleNote(index)"
          >
            <span class="font-semibold">{{ note.to.name }}</span>
            <i
              :class="openNote === index ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"
            ></i>
          </div>
  
          <div
            v-if="openNote === index"
            class="mt-2 text-gray-700 dark:text-gray-300 relative"
          >
            <div>
              <p
                v-if="!isEditing"
                class="break-words whitespace-normal w-11/12"
              >
                {{ note.text }}
              </p>
              <textarea
                name="message"
                id=""
                :value="note.text"
                class="w-full outline-none mt-8 px-2 rounded-md h-40 resize-none"
                v-if="isEditing"
              ></textarea>
            </div>
  
            <div class="absolute top-0 right-0">
              <i
                class="fa-solid fa-pen-to-square cursor-pointer hover:text-slate-500"
                @click="isEditing = true"
                v-if="!isEditing"
              ></i>
  
              <button
                class="text-black ml-3"
                v-if="isEditing"
                @click="isEditing = false"
              >
                İptal
              </button>
              <button class="text-black ml-3" v-if="isEditing">Kaydet</button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>