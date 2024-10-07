import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/views/MainLayout.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Home from '@/views/Home.vue';
// Importa i componenti con tabelle con lazy loading
const Admin = () => import('@/views/Admin.vue'); 
const Persons = () => import('@/views/Persons.vue');
const PersonsList = () => import('@/views/PersonsList.vue');
const AddPerson = () => import('@/views/AddPerson.vue');
  

const routes = [
    {
      path: '/',
      component: MainLayout,  // MainLayout come layout principale
      children: [
        { path: '', name: 'Home', component: Home },
        { path: 'login', name: 'Login', component: Login },
        { path: 'admin', name: 'Admin', component: Admin },  // Admin route
        { path: 'persons', name: 'Persons', component: Persons },  // Editor route
        { path: 'persons-list', name: 'PersonsList', component: PersonsList },  // Viewer route
        { path: 'register', name: 'Register', component: Register },
        { path: 'add-person', name: 'AddPerson', component: AddPerson },
      ]
    }
  ];
  
  const router = createRouter({
    history: createWebHistory(),
    routes
  });
  
  // Guardia di autenticazione
  router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('authToken');  // Controlla se esiste un token di autenticazione
    if (to.meta.requiresAuth && !isAuthenticated) {
      next({ name: 'Login' });  // Reindirizza al login se non autenticato
    } else {
      next();  // Altrimenti, prosegui normalmente
    }
  });
  

  export default router;