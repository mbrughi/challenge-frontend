<template>
    <v-container class="pa-4">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>
              <v-row no-gutters>
                  <v-col>                
                    <h1 class="text-h5">Elenco delle Persone</h1>
                  </v-col>
              <v-col class="text-right">
                <span>Benvenuto, {{ username }}</span>
                <v-btn color="error" @click="logout">Logout</v-btn>
              </v-col>
            </v-row>              
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <!-- Tabella con titoli e paginazione per le persone -->
              <v-data-table
                :headers="headers"
                :items="persons"
                :items-per-page="5"
                dense
              ></v-data-table>
              <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
              
              <v-alert v-if="!loading && persons.length === 0" type="info">Nessuna persona trovata.</v-alert>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useApi } from '@/composables/useApi'; // Usa il composable useApi
  
  export default {
    setup() {
      const { getPersons, error, getUser, logout } = useApi();
      const username = ref("");
      const persons = ref([]);
      const loading = ref(true);
  
      const headers = [
        { text: 'ID', value: 'id', sortable: true },
        { text: 'Nome', value: 'nome', sortable: true },
        { text: 'Cognome', value: 'cognome', sortable: true },
        { text: 'Data di Nascita', value: 'data_nascita', sortable: true },
        { text: 'Email', value: 'email', sortable: true },
        { text: 'Telefono', value: 'telefono', sortable: true },
        { text: 'Codice Fiscale', value: 'codice_fiscale', sortable: true },
      ];
  
      const loadPersons = async () => {
        loading.value = true;
        try {
          persons.value = await getPersons(); // Chiamata all'API
          console.log('Dati delle persone:', persons.value); // Debug
        } catch (err) {
          console.error('Errore nel caricamento delle persone:', err);
        } finally {
          loading.value = false;
        }
      };
  
  onMounted(async () => {
    loading.value = true;
    try {
      await loadPersons(); // Carica le persone
      const user = await getUser(); // Recupera l'utente attuale
      username.value = user.name || "Utente"; // Imposta il nome utente
      users.value = await getUsers(); // Carica la lista degli utenti
    } catch (err) {
      error.value = err.message; // Gestione degli errori
    } finally {
      loading.value = false; // Fine del caricamento
    }
  });
  
      return {
        persons,
        headers,
        loading,
        error,
        username, 
        logout
      };
    },
  };
  </script>
  
  <style scoped>
  .v-container {
    max-width: 100%;
  }
  
  .v-card {
    max-width: 100%;
    margin: 0 auto;
  }
  .v-btn {margin-left: 10px;}
  </style>
  