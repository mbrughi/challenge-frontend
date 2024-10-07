<template>
    <v-app>
      <!-- Header -->
      <v-app-bar app color="blue darken-3" dark>
        <v-toolbar-title>Gestione Persone</v-toolbar-title>
  
        <v-spacer></v-spacer>
  
        <!-- Pulsanti Login, Registrati -->
        <v-btn v-if="!isLoggedIn" :to="{ name: 'Login' }" text color="white">Login</v-btn>
        <v-btn v-if="!isLoggedIn" :to="{ name: 'Register' }" text color="white">Registrati</v-btn>
      </v-app-bar>
  
      <!-- Body -->
      <v-main>
        <!-- Usa router-view per caricare i componenti in base alla route -->
        <router-view :showSuccess="showSuccess" :showError="showError"></router-view>
      </v-main>
  
      <!-- Footer -->
      <v-footer app color="blue darken-3" dark>
        <v-col class="text-center" cols="12">
          © {{ currentYear }} - Peoplemanage L.t.d.
        </v-col>
      </v-footer>
  
      <!-- Popup per messaggi di errore o successo -->
      <v-snackbar v-model="showSnackbar" :timeout="3000" :color="snackbarColor" top right>
        {{ snackbarMessage }}
      </v-snackbar>
    </v-app>
  </template>
  
  <script>
  import { ref, nextTick, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useApi } from '@/composables/useApi';

  const isLoggedIn = ref(false);
  const errorMessage = ref(null);
  const userName = ref('');
  const showSnackbar = ref(false);
  const snackbarMessage = ref('');
  const snackbarColor = ref('');
  
  const router = useRouter();
  const { getUser } = useApi();

  // Variabile per l'utente loggato
  const user = ref(null);
    
  // Funzione per caricare i dati dell'utente loggato
  const loadUser = async () => {
    user.value = await getUser();  // Recupera l'utente loggato dall'API
  };

  // Carica i dati dell'utente quando il componente viene montato
  onMounted(() => {
    loadUser();
  });
  
  const showSuccess = (message) => {
    snackbarMessage.value = message;
    snackbarColor.value = 'green';
    showSnackbar.value = false;
    nextTick(() => {
      showSnackbar.value = true;
    });
  };
  
  const showError = (message) => {
    snackbarMessage.value = message;
    snackbarColor.value = 'red';
    showSnackbar.value = false;
    nextTick(() => {
      showSnackbar.value = true;
    });
  };
  
  const currentYear = new Date().getFullYear();
  
  export default {
    setup() {
      return {
        isLoggedIn,
        errorMessage,
        userName,
        showSuccess,
        showError,
        showSnackbar,
        snackbarMessage,
        snackbarColor,
        currentYear,
      };
    }
  };
  </script>
  
  <style scoped>
  .user-name {
    font-weight: bold;
    font-size: 18px;
    text-align: center;
    margin: 0 10px;
  }
  
  v-main {
    min-height: calc(100vh - 64px);
  }
  </style>
  