<script>

import { createUserWithEmailAndPassword } from "../firebase/firebase.js";
import { db, auth } from "../firebase/firebase.js";
import { setDoc, doc } from "firebase/firestore";

export default {
  data() {
    return {
      form: {
        name: "",
        username: "",
        email: "",
        password: ""
      }
    };
  },
  methods: {
    async handleSignup() {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.form.email,
          this.form.password
        );

        const user = userCredential.user;
        // console.log("User created successfully:", user);

        await setDoc(doc(db, "users", user.uid), {
          name: this.form.name,
          username: this.form.username,
          email: this.form.email,
          createdAt: new Date().toISOString()
        });

        alert("Signup successful! Welcome " + this.form.name);
        this.$router.push("/login");
      } catch (error) {
        console.error("Error during signup:", error);
        alert("Signup failed: " + error.message);
      }
    }
  }
};


</script> 

<template>
    <div class="h-[calc(100vh-60px)] flex items-center justify-center bg-gray-100">
      <div class="bg-white mx-2 shadow-md rounded-lg p-8 max-w-sm w-full">
        <h1 class="text-2xl font-semibold text-gray-800 text-center mb-6">Signup</h1>
        <form @submit.prevent="handleSignup">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              v-model="form.name"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Name Lastname"
              required
            />
          </div>
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              v-model="form.username"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>
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
            Signup
          </button>
        </form>
        <p class="text-sm text-gray-500 text-center mt-4">
          Already have an account?
          <a href="/login" class="text-[#00adb5] hover:underline">Login</a>
        </p>
      </div>
    </div>
</template>