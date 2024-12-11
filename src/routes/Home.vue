<script>
import { onMounted, ref } from 'vue';
import { db } from '../firebase/firebase.js'; 
import { collection, getDocs } from 'firebase/firestore'; 

import People from '../components/People.vue';
import Addnote from '../components/Addnote.vue';

export default {
  components: {
    People,
    Addnote,
  },
  setup() {
    const selectedPerson = ref(null);
    const people = ref([]); 

    const handlePersonClick = (person) => {
      selectedPerson.value = person;
    };

    const fetchPeopleFromFirestore = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList = [];
        querySnapshot.forEach((doc) => {
          // Dokümana id'yi de ekleyin
          usersList.push({
            id: doc.id,  // Firestore'dan gelen dokümanın benzersiz ID'si
            ...doc.data()
          });
        });
        people.value = usersList;
      } catch (error) {
        console.error("Error fetching users from Firestore: ", error);
      }
    };

    onMounted(() => {
      fetchPeopleFromFirestore();
    });

    return {
      selectedPerson,
      handlePersonClick,
      people
    };
  }
};
</script>

<template>
  <div class="flex">
    <People @person-click="handlePersonClick" :people="people" />
    <Addnote :selected-person="selectedPerson" />
  </div>
</template>