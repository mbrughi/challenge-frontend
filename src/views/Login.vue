<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">  
        <v-card class="pa-5">
          <v-card-title>
            <span class="headline">Login</span>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field 
                v-model="credentials.email" 
                label="Email" 
                type="email" 
                required 
                outlined
              ></v-text-field>
              <v-text-field 
                v-model="credentials.password" 
                label="Password" 
                type="password" 
                required 
                outlined
              ></v-text-field>
              <v-btn type="submit" color="primary" block>Login</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useApi } from '../composables/useApi';
import { useRouter } from 'vue-router';

// Ricevi le funzioni showSuccess e showError come props
const props = defineProps({
  showSuccess: Function,
  showError: Function
});

const { login, error } = useApi();
const credentials = ref({ email: '', password: '' });
const router = useRouter();

/*const handleLogin = async () => {
  const response = await login(credentials.value);
  if (response) {
    props.showSuccess('Accesso avvenuto con successo');  // Usa showSuccess direttamente come prop
    router.push({ name: 'Home' });
  } else {
    props.showError(error.value || 'Errore durante il login');
  }
};*/
const handleLogin = async () => {
  const response = await login(credentials.value);
  if (response) {
    const role = localStorage.getItem('userRole'); // Recupero il ruolo utente
    props.showSuccess('Accesso avvenuto con successo');  // Mostra il messaggio di successo
    
    localStorage.setItem('user', JSON.stringify(response.user));

    // Redirect based on role
    if (role === 'admin') {
      router.push({ name: 'Admin' });
    } else if (role === 'editor') {
      router.push({ name: 'Persons' });
    } else if (role === 'viewer') {
      router.push({ name: 'PersonsList' });
    } else {
      router.push({ name: 'Home' });  // Default fallback
    }
  } else {
    props.showError(error.value || 'Errore durante il login');
  }
};

</script>

<style scoped>
/* Stile personalizzato per la dimensione del form */
.v-container {
  max-width: 100%;
}

.v-card {
  max-width: 100%;
}
</style>
