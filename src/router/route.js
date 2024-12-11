import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebase/firebase.js'; 
import Home from '../routes/Home.vue';
import Sent from '../routes/Sent.vue';
import Received from '../routes/Received.vue';
import Login from '../routes/Login.vue';
import Signup from '../routes/Signup.vue';

let user = null;

auth.onAuthStateChanged((currentUser) => {
  user = currentUser;
});

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/sent',
    name: 'Sent',
    component: Sent,
    meta: { requiresAuth: true },
  },
  {
    path: '/received',
    name: 'Received',
    component: Received,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true },
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: { guest: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  await new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      user = currentUser;
      unsubscribe();
      resolve();
    });
  });

  const requiresAuth = to.meta.requiresAuth;
  const isGuestPage = to.meta.guest;

  if (requiresAuth && !user) {
    next({ name: 'Login' });
  } else if (isGuestPage && user) {
    next({ name: 'Home' });
  } else {
    next(); 
  }
});

export default router;