<script setup>
import { ref, onMounted } from 'vue';
import { getDocs, collection, query, where, orderBy, getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

const notes = ref([]);
const openNote = ref(null);

const toggleNote = (index) => {
  openNote.value = openNote.value === index ? null : index;
};

const fetchReceivedNotes = async () => {
  try {
    const user = auth.currentUser; 
    if (!user) return;

    const receivedNotesQuery = query(
      collection(db, 'notes'),
      where('to.id', '==', user.uid),
      orderBy('createdAt', 'desc') 
    );

    const querySnapshot = await getDocs(receivedNotesQuery);
    const fetchedNotes = await Promise.all(
      querySnapshot.docs.map(async (docSnapshot) => {
        const noteData = docSnapshot.data();
        
        const senderDocRef = doc(db, 'users', noteData.from.id); 
        const senderDoc = await getDoc(senderDocRef);  
        const senderData = senderDoc.exists() ? senderDoc.data() : {};

        return {
          id: docSnapshot.id,
          text: noteData.text,
          from: {
            id: noteData.from.id,
            name: senderData.name || noteData.from.name || 'Unknown User',
          },
          to: noteData.to,
          createdAt: noteData.createdAt,
        };
      })
    );

    notes.value = fetchedNotes;
  } catch (error) {
    console.error('Error fetching received notes:', error);
  }
};

onMounted(() => {
  fetchReceivedNotes();
});
</script>

<template>
    <div class="w-full flex flex-col items-center p-5">
      <h2 class="text-xl font-semibold mb-4">Aldıklarım</h2>
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
            <span class="font-semibold">{{ note.from.name }}</span>
            <i
              :class="openNote === index ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"
            ></i>
          </div>
  
          <div
            v-if="openNote === index"
            class="mt-2 text-gray-700 dark:text-gray-300"
          >
            <p class="break-words whitespace-normal w-full">{{ note.text }}</p>
          </div>
        </div>
      </div>
    </div>
</template>