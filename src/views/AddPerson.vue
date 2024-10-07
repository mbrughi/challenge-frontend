<template>
    <div class="form-container">
      <h2>Aggiungi Nuova Persona</h2>
      <form @submit.prevent="savePerson" class="form-content">
        <div class="form-group">
          <label for="nome">Nome:</label>
          <input type="text" id="nome" v-model="nome" required />
        </div>
        <div class="form-group">
          <label for="cognome">Cognome:</label>
          <input type="text" id="cognome" v-model="cognome" required />
        </div>
        <div class="form-group">
          <label for="codice_fiscale">Codice Fiscale:</label>
          <input type="text" id="codice_fiscale" v-model="codiceFiscale" required />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="telefono">Telefono:</label>
          <input type="text" id="telefono" v-model="telefono" required />
        </div>
        <div class="form-group">
          <label for="data_nascita">Data di Nascita:</label>
          <input type="date" id="data_nascita" v-model="dataNascita" required />
        </div>
        <button type="submit" class="btn-submit">Salva</button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router'; // Importa il router
  
  export default {
    setup() {
      const router = useRouter();
      const nome = ref('');
      const cognome = ref('');
      const codiceFiscale = ref('');
      const email = ref('');
      const telefono = ref('');
      const dataNascita = ref('');
      const errorMessage = ref(null);
  
        const savePerson = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
            throw new Error('Token mancante. Effettua il login.');
            }

            // Formatta la data da YYYY-MM-DD a d/m/Y
            const formattedDate = formatDate(dataNascita.value);

            const response = await fetch('http://127.0.0.1:8000/api/persons', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: nome.value,
                cognome: cognome.value,
                codice_fiscale: codiceFiscale.value,
                email: email.value,
                telefono: telefono.value,
                data_nascita: formattedDate,  // Usa la data formattata
            }),
            });

            if (!response.ok) {
            const errorMessage = await response.text();  // Recupero il messaggio di errore come testo
            throw new Error(`Errore durante la creazione della persona: ${errorMessage}`);
            }

            const data = await response.json();
            console.log('Persona creata con successo:', data);
            alert("Persona creata con successo!");

            // Reindirizza alla pagina delle persone
            router.push('/persons');
        } catch (error) {
            errorMessage.value = error.message || 'Errore sconosciuto';
        }
        };

        // Funzione per formattare la data da YYYY-MM-DD a d/m/Y
        const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
        };

      return {
        nome,
        cognome,
        codiceFiscale,
        email,
        telefono,
        dataNascita,
        savePerson,
        errorMessage,
      };
    },
  };
  </script>
  
  <style scoped>
  .form-container {
    max-width: 500px;
    margin: 50px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
  }
  
  .form-content {
    display: flex;
    flex-direction: column;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    font-weight: bold;
    margin-bottom: 5px;
    display: block;
    color: #333;
  }
  
  .form-group input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    transition: border-color 0.3s ease;
  }
  
  .form-group input:focus {
    border-color: #007bff;
    outline: none;
  }
  
  .btn-submit {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }
  
  .btn-submit:hover {
    background-color: #0056b3;
  }
  
  .error-message {
    color: red;
    margin-top: 15px;
    font-weight: bold;
    text-align: center;
  }
  </style>
  