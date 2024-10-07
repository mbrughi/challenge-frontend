<template>
    <v-container class="pa-4">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>
              <v-row no-gutters>
                <v-col>
                  <h1 class="text-h5">Dashboard Amministrazione</h1>
                </v-col>
                <v-col class="text-right">
                  <span>Benvenuto, {{ username }}</span>
                  <v-btn color="error" @click="handleLogout">Logout</v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <!-- Tabella con titoli corretti e paginazione -->
              <v-data-table
                :headers="headers"
                :items="users"
                :items-per-page="5"
                v-if="!loading"
                class="elevation-1"
                dense
              >
                <template v-slot:[`item.actions`]="{ item }">
                  <v-btn color="red" @click="deleteUserAction(item.id)" small>Cancella</v-btn>
                  <v-btn color="blue" @click="editUser(item)" small>Mod. Ruolo</v-btn>
                </template>
              </v-data-table>
              <v-progress-linear v-else indeterminate></v-progress-linear>
              <v-alert v-if="error" type="error">{{ error }}</v-alert>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Finestra di dialogo per modificare il ruolo -->
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title>
            Modifica ruolo per {{ selectedUser.name }}
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="newRole" label="Ruolo"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="error" text @click="saveRole">Salva</v-btn>
            <v-btn text @click="dialog = false">Annulla</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { useApi } from "../composables/useApi"; // Assicurati che il percorso sia corretto
  import { useRouter } from 'vue-router';

  export default {
    name: "Admin",
    setup() {
      const { getUsers, getUser, logout, deleteUser, updateUserRole } = useApi();
      const username = ref("");
      const users = ref([]);
      const loading = ref(true);
      const error = ref(null);
      const dialog = ref(false);
      const selectedUser = ref(null);
      const newRole = ref("");
      const router = useRouter();
  
      const headers = [
        { text: "ID", value: "id" },
        { text: "Nome", value: "name" },
        { text: "Email", value: "email" },
        { text: "Ruolo", value: "role" },
        { text: "Azioni", value: "actions", sortable: false }
      ];
  
      onMounted(async () => {
        try {
          const user = await getUser(); // Recupera l'utente attuale
          username.value = user.name || "Utente"; // Imposta il nome utente
          users.value = await getUsers();
        } catch (err) {
          error.value = err.message;
        } finally {
          loading.value = false;
        }
      });
  
      const deleteUserAction = async (id) => {
        try {
          await deleteUser(id);
          users.value = users.value.filter((user) => user.id !== id);
        } catch (err) {
          error.value = err.message;
        }
      };
  
      const editUser = (user) => {
        selectedUser.value = user;
        newRole.value = user.role;
        dialog.value = true;
      };
  
      const saveRole = async () => {
        try {
          await updateUserRole(selectedUser.value.id, newRole.value);
          selectedUser.value.role = newRole.value;
          dialog.value = false;
        } catch (err) {
          error.value = err.message;
        }
      };
  
      const handleLogout = async () => {
        try {
          await logout();
          router.push('/');
        } catch (err) {
          error.value = err.message;
        }
      };

      return {
        username,
        users,
        loading,
        error,
        dialog,
        selectedUser,
        newRole,
        headers,
        deleteUserAction,
        editUser,
        saveRole,
        logout, 
        handleLogout
      };
    }
  };
  </script>

<style scoped>
.v-container {
max-width: 100%;
}

.v-btn {margin-left: 10px;}

.v-card {
max-width: 100%;
margin: 0 auto;
}
/* Assicurarsi che i titoli della tabella siano visibili */
.custom-table .v-data-table-header th {
color: black !important;  /* Forza il colore del testo */
font-weight: bold;        /* Testo in grassetto */
white-space: nowrap;      /* Evita che i titoli vadano su più righe */
overflow: hidden;         /* Evita overflow dei titoli */
text-overflow: ellipsis;  /* Aggiunge i puntini di sospensione in caso di overflow */
}
.custom-table .v-data-table {
background-color: white;  /* Forza il background della tabella a bianco */
}
</style>
  