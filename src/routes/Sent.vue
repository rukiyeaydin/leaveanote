<script setup>
import { ref, onMounted } from 'vue';
import { getDocs, collection, query, where, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

const notes = ref([]); 
const openNote = ref(null);
const isEditing = ref(false);
const currentText = ref('');

// Toggle note visibility
const toggleNote = (index) => {
  openNote.value = openNote.value === index ? null : index;
};

// Fetch notes from Firebase
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

// Save updated note to Firebase
const saveNote = async (noteId) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, {
      text: currentText.value,
    });
    isEditing.value = false;
    fetchNotes();  // Refresh notes
  } catch (error) {
    console.error('Error updating note:', error);
  }
};

// Delete note
const deleteNote = async (noteId) => {
  try {
    const userConfirmation = window.confirm('Notu silmek istediğinizden emin misiniz?');
    if (userConfirmation) {
      const noteRef = doc(db, 'notes', noteId);
      await deleteDoc(noteRef);  // Delete the note from Firebase
      fetchNotes();  // Refresh notes after deletion
    }
  } catch (error) {
    console.error('Error deleting note:', error);
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
              v-model="currentText"
              class="w-full outline-none mt-8 px-2 rounded-md h-40 resize-none"
              v-if="isEditing"
            ></textarea>
          </div>

          <div class="absolute top-0 right-0">
            <i
              class="fa-solid fa-pen-to-square cursor-pointer hover:text-slate-500"
              @click="isEditing = true; currentText = note.text"
              v-if="!isEditing"
            ></i>

            <i
              class="fa-solid fa-trash ml-3 hover:text-slate-500 cursor-pointer"
              @click="deleteNote(note.id)"
              v-if="!isEditing"
            ></i>

            <button
              class="text-black ml-3"
              v-if="isEditing"
              @click="isEditing = false"
            >
              İptal
            </button>
            <button
              class="text-black ml-3"
              v-if="isEditing"
              @click="saveNote(note.id)"
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>