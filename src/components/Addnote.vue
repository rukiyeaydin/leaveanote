<script setup>
import { ref } from 'vue';
import { db, auth } from '../firebase/firebase.js'; 
import { addDoc, collection } from 'firebase/firestore';

const props = defineProps({
    selectedPerson: {
        type: Object,
        required: false
    }
});

const noteText = ref('');

const sendNote = async () => {
    const currentUser = auth.currentUser;
    // console.log(currentUser);
    

    if (!currentUser || !props.selectedPerson) {
        alert('Lütfen bir kullanıcı seçin ve giriş yapın');
        return;
    }

    if (!noteText.value.trim()) {
        alert('Not içeriği boş olamaz');
        return;
    }

    try {
        await addDoc(collection(db, 'notes'), {
            from: {
                id: currentUser.uid,
                name: currentUser.displayName || currentUser.email
            },
            to: {
                id: props.selectedPerson.id,  
                name: props.selectedPerson.name
            },
            text: noteText.value,
            createdAt: new Date()
        });

        noteText.value = '';
        alert('Not başarıyla gönderildi!');
    } catch (error) {
        console.error('Not gönderilirken hata oluştu:', error);
        alert('Not gönderilirken bir hata oluştu');
    }
};
</script>

<template>
    <div class="w-full flex flex-col items-end justify-end p-4 text-end">
        <div v-if="selectedPerson" class="w-10/12 sm:w-96">
            <h2 class="text-xl font-semibold">Leave a note to "{{ selectedPerson.name }}"</h2>
            <div class="w-full flex flex-col items-end">
                <textarea 
                    v-model="noteText" 
                    name="notearea" 
                    id="notetext" 
                    class="mt-2 outline-none p-2 border border-slate-400 rounded-lg h-52 resize-none w-full" 
                    placeholder="Notunuzu girin..."
                ></textarea>
                <button 
                    @click="sendNote" 
                    class="bg-[#00adb5] text-white hover:bg-[#3ac3ca] p-2 rounded-lg mt-2 text-sm w-max font-semibold"
                >
                    Gönder
                </button>
            </div>
        </div>
        <div v-else>
            <p class="text-lg text-gray-400">Not bırakmak istediğiniz kişiyi seçin...</p>
        </div>
    </div>
</template>