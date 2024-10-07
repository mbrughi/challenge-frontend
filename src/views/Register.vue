<template>
  <div class="form-container">
    <h2>Registrazione Utente</h2>
    <form @submit.prevent="registerUser" class="form-content">
      <div class="form-group">
        <label for="name">Nome:</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div class="form-group">
        <label for="passwordConfirm">Conferma Password:</label>
        <input type="password" id="passwordConfirm" v-model="passwordConfirm" required />
      </div>
      <div class="form-group">
        <label for="role">Ruolo:</label>
        <select v-model="role" id="role" required>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>
      <button type="submit" class="btn-submit">Registrati</button>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Importa il router

export default {
  setup() {
    const router = useRouter(); // Inizializza il router
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const passwordConfirm = ref('');
    const role = ref('');
    const errorMessage = ref(null);

    const registerUser = async () => {
      if (password.value !== passwordConfirm.value) {
        errorMessage.value = "Le password non corrispondono";
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name.value,
            email: email.value,
            password: password.value,
            password_confirmation: passwordConfirm.value,
            role: role.value,
          }),
        });

        if (!response.ok) {
          throw new Error('Registrazione fallita');
        }

        const data = await response.json();
        console.log('Registrazione avvenuta con successo:', data);
        alert("Registrazione completata con successo!");

        // Reindirizza alla pagina iniziale dopo la registrazione
        router.push('/');
      } catch (error) {
        errorMessage.value = error.message || 'Errore sconosciuto';
      }
    };

    return {
      name,
      email,
      password,
      passwordConfirm,
      role,
      registerUser,
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

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
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
