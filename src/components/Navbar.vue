<script>
import { onAuthStateChanged } from "../firebase/firebase.js";
import { auth } from "../firebase/firebase.js";

export default {
  data() {
    return {
      showMenu: false,
      isLoggedIn: false,
    };
  },
  created() {
    onAuthStateChanged(auth, (user) => {
      this.isLoggedIn = !!user;
    });
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    toggleMenu(event) {
      event.stopPropagation();
      this.showMenu = !this.showMenu;
    },
    handleLogout() {
      auth.signOut().then(() => {
        alert("Çıkış yapıldı.");
        this.isLoggedIn = false;
        this.$router.push("/login");
      });
    },
    handleClickOutside(event) {
      const menuElement = this.$el.querySelector(".menu");
      if (menuElement && !menuElement.contains(event.target)) {
        this.showMenu = false; 
      }
    },
  },
};
</script>

<template>
  <div class="h-[60px] w-full p-4 bg-[#222831] text-white flex items-center justify-between z-50">
    <div class="relative">
      <router-link to="/">
        <p class="text-2xl z-20 relative">leaveanote</p>
      </router-link>
      <p class="absolute top-0 left-6 text-3xl font-light text-[#00ADB5] z-10 rotate-[-20deg]">2025</p>
    </div>

    <i v-if="isLoggedIn" class="fa-solid fa-user cursor-pointer" @click="toggleMenu"></i>

    <div v-else>
      <ul class="flex gap-3">
        <router-link to="/login">
          <li>Giriş Yap</li>
        </router-link>
        <router-link to="/signup">
          <li>Kaydol</li>
        </router-link>
      </ul>
    </div>

    <ul
      v-if="isLoggedIn && showMenu"
      class="absolute right-2 top-12 bg-[#00adb5] flex flex-col items-end gap-5 p-3 rounded-xl menu"
    >
      <router-link to="/sent">
        <li class="cursor-pointer hover:underline">Gönderdiklerim</li>
      </router-link>
      <router-link to="/received">
        <li class="cursor-pointer hover:underline">Aldıklarım</li>
      </router-link>
      <li class="cursor-pointer hover:underline" @click="handleLogout">Çıkış Yap</li>
    </ul>
  </div>
</template>
