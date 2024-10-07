<template>
  <v-container class="pa-4">
    <v-row justify="center">
      <v-col cols="12">
        <v-card>  
          <v-card-title>
            <v-row no-gutters>
              <v-col>
                <h1 class="text-h5">Gestione Persone</h1>
                <v-btn color="green" class="ml-auto" @click="goToAddPerson">Nuova Persona</v-btn>
              </v-col>
              <v-col class="text-right">
                <span>Benvenuto, {{ username }}</span>
                <v-btn color="error" @click="handleLogout">Logout</v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-responsive max-width="100%">
              <v-data-table 
                :headers="headers"
                :items="persons" 
                :items-per-page="5"
                v-if="!loading"
                class="elevation-1"
                dense
                fixed-header
              >
                <template v-slot:[`item.actions`]="{ item }">
                  <v-btn color="red" @click="deletePersonAction(item.id)" small>Cancella</v-btn>
                  <v-btn color="blue" @click="editPerson(item)" small>Modifica</v-btn>
                </template>
              </v-data-table>
              <v-progress-linear v-else indeterminate></v-progress-linear>
            </v-responsive>
            <v-alert v-if="error" type="error">{{ error }}</v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog per la modifica dei dati della persona -->
    <div v-if="dialog" class="custom-dialog-overlay">
    <div class="custom-dialog">
      <div class="custom-dialog-title">
        {{ isEditing ? 'Modifica Persona' : 'Nuova Persona' }}
        <button class="close-btn" @click="dialog = false">&times;</button>
      </div>
      <div class="custom-dialog-content">
        <form v-if="selectedPerson">
          <label>Nome</label>
          <input type="text" v-model="selectedPerson.nome" />

          <label>Cognome</label>
          <input type="text" v-model="selectedPerson.cognome" />

          <label>Codice Fiscale</label>
          <input type="text" v-model="selectedPerson.codice_fiscale" />

          <label>Email</label>
          <input type="email" v-model="selectedPerson.email" />

          <label>Telefono</label>
          <input type="text" v-model="selectedPerson.telefono" />

          <label>Data di Nascita</label>
          <input type="date" v-model="formattedDate" />
        </form>
      </div>
      <div class="custom-dialog-actions">
        <button @click="savePerson">Salva</button>
        <button @click="dialog = false">Annulla</button>
      </div>
    </div>
  </div>
  </v-container>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useApi } from '@/composables/useApi'; // Percorso corretto
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const persons = ref([]);
    const headers = ref([
      { text: 'Nome', value: 'nome' },
      { text: 'Cognome', value: 'cognome' },
      { text: 'Data di Nascita', value: 'data_nascita' },
      { text: 'Email', value: 'email' },
      { text: 'Telefono', value: 'telefono' },
      { text: 'Codice Fiscale', value: 'codice_fiscale' },
      { text: 'Azioni', value: 'actions', sortable: false },
    ]);
    const username = ref('');
    const loading = ref(false);
    const dialog = ref(false);
    const error = ref(null);
    const isEditing = ref(false);
    const selectedPerson = ref(null);
    const datePicker = ref(null); // Variabile per il v-date-picker
    const formattedDate = ref(''); // Variabile per la data formattata
    const menu = ref(false);
    const person = ref([]);

    const { getPersons, getUser, getPersonById, deletePerson, updatePerson, logout } = useApi();

    onMounted(async () => {
      loading.value = true;
      try {
        const user = await getUser();
        username.value = user.name || 'Utente';
        persons.value = await getPersons();
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    });

    // Funzione per formattare una data in "dd/MM/yyyy"
    const formatDate = (date) => {
      const d = new Date(date);
      const day = (`0${d.getDate()}`).slice(-2);
      const month = (`0${d.getMonth() + 1}`).slice(-2);
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    // Funzione per convertire una stringa "dd/MM/yyyy" in un oggetto Date
    const parseDate = (dateString) => {
      const [day, month, year] = dateString.split('/');
      return new Date(year, month - 1, day);
    };

    const editPerson = async (person) => {
      isEditing.value = true;
      selectedPerson.value = null;
      dialog.value = true;
      try {
        const detailedPerson = await getPersonById(person.id);
        if (detailedPerson) {
          selectedPerson.value = {
            ...detailedPerson,
            data_nascita: parseDate(detailedPerson.data_nascita), // Converte data_nascita da stringa a oggetto Date
          };
          formattedDate.value = formatDate(selectedPerson.value.data_nascita); // Formattazione della data per il campo visualizzato
          datePicker.value = selectedPerson.value.data_nascita; // Imposta il valore del v-date-picker
        } else {
          throw new Error('Persona non trovata');
        }
      } catch (err) {
        error.value = err.message;
      }
    };

    const updateDate = (newDate) => {
      datePicker.value = newDate;
      formattedDate.value = formatDate(newDate); // Aggiorna la visualizzazione della data
      selectedPerson.value.data_nascita = newDate.toISOString().split('T')[0]; // Imposta il formato corretto per il backend (ISO 8601)
    };

    watch(selectedPerson, (newPerson) => {
      if (newPerson && dialog.value === true) {
        dialog.value = true;
      }
    });

    const savePerson = async () => {
      try {
        if (isEditing.value && selectedPerson.value) {
          await updatePerson(selectedPerson.value.id, selectedPerson.value);
        }
        persons.value = await getPersons();
        dialog.value = false;
      } catch (err) {
        error.value = err.message;
      }
    };

    const goToAddPerson = () => {
      router.push('/add-person');
    };

    const handleLogout = async () => {
      try {
        await logout();
        router.push('/');
      } catch (err) {
        error.value = err.message;
      }
    };

    const deletePersonAction = async (id) => {
        try {
          await deletePerson(id);
          persons.value = persons.value.filter((person) => person.id !== id);
        } catch (err) {
          error.value = err.message;
        }
      };

    return {
      persons,
      headers,
      username,
      loading,
      dialog,
      error,
      isEditing,
      selectedPerson,
      datePicker,
      formattedDate,
      menu,
      editPerson,
      savePerson,
      updateDate,
      goToAddPerson,
      handleLogout,
      deletePerson,
      deletePersonAction
    };
  },
};
</script>

  <style scoped>
  
  .v-btn {margin-left: 10px;}

  .custom-dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }

  .custom-dialog {
    background-color: white;
    width: 600px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .custom-dialog-title {
    font-size: 18px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }

  .custom-dialog-content label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
  }

  .custom-dialog-content input {
    width: 100%;
    padding: 8px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .custom-dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .custom-dialog-actions button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .custom-dialog-actions button:first-of-type {
    background-color: #1976d2;
    color: white;
  }

  .custom-dialog-actions button:last-of-type {
    background-color: #f44336;
    color: white;
  }  
  </style>