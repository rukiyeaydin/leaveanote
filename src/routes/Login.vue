<script>

import { signInWithEmailAndPassword } from "../firebase/firebase.js";
import { auth } from "../firebase/firebase.js";

export default {
  data() {
    return {
      form: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    async handleLogin() {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.form.email,
          this.form.password
        );

        const user = userCredential.user;
        // console.log("Login successful:", user);

        this.$router.push("/");
      } catch (error) {
        console.error("Error during login:", error);
        alert("Login failed: " + error.message);
      }
    }
  }
};


</script>

<template>
    <div class="h-[calc(100vh-60px)] flex items-center justify-center bg-gray-100">
      <div class="bg-white shadow-md rounded-lg p-8 mx-2 max-w-sm w-full">
        <h1 class="text-2xl font-semibold text-gray-800 text-center mb-6">Login</h1>
        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              v-model="form.password"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-[#00adb5] text-white py-2 rounded-md hover:bg-[#3fbfc6] transition duration-200"
          >
            Login
          </button>
        </form>
        <p class="text-sm text-gray-500 text-center mt-4">
          Don't have an account?
          <a href="/signup" class="text-[#00adb5] hover:underline">Signup</a>
        </p>
      </div>
    </div>
</template>
  