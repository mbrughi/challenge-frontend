<template>
  <v-container class="d-flex justify-center align-center text-center fill-height">
    <v-row class="d-flex justify-center align-center text-center fill-height">
      <v-col cols="12" sm="8" md="6">
        <h1 class="text-center">Gestione Persone</h1>
        <p>Accedi cliccando su Login oppure crea un nuovo utente cliccando su Registrati</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
};
</script>

<style scoped>
/* Centrare il testo verticalmente e orizzontalmente */
.fill-height {
  min-height: 80vh; /* L'altezza della pagina in base alla viewport (NB 100vh = 100%) */
}

h1 {
  font-size: 2.5rem;
  color: #000;
}

p {
  font-size: 1.2rem;
  margin-top: 20px;
}

@media (max-width: 600px) {
  h1 {
    font-size: 1.8rem;  /* Adattiamo il titolo per schermi piccoli */
  }
    
  p {
    font-size: 1rem;
  }
}
</style>
