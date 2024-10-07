import { ref } from 'vue';
import router from '../router';

const baseUrl = 'http://127.0.0.1:8000';  // URL del server delle API

export function useApi() {
  //console.log('useApi composables called'); // check chiamata API

  const error = ref(null);
  const token = ref(null);
  
  // Funzione per ottenere l'utente loggato dal localStorage
  const getUser = () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;  // Ritorna i dati utente se esistono
  };

  const login = async (credentials) => {
      try {
        const response = await fetch(`${baseUrl}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
        if (!response.ok) throw new Error('Failed to login');
        const data = await response.json();
        token.value = data.token; // Salvo the token
        localStorage.setItem('authToken', data.token); // Salvo il token in localStorage
        localStorage.setItem('userRole', data.user.role); // Salvo il ruolo in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));  // Salva i dati dell'utente
        // Debugging
        //console.log('User role: ', data.user.role); 
        //console.log('User: ', data.user);
        // ---------
        return data; // Return dei dati ruolo incluso
      } catch (err) {
        error.value = err.message;
      }
  };
  
  const logout = async () => {

    try {
      const response = await fetch(`${baseUrl}/api/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Logout fallito');
      
      // Cancella i dati dopo il logout
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      // Resetta eventuali stati di errore
      error.value = null;  // Resetta l'errore qui
      
      router.push('/');
    } catch (err) {
      console.error('Errore durante il logout:', err.message);
    }
  };



  const getPersons = async () => {
    try {
      console.log('Fetching persons...');  // Debugging
      if (localStorage.getItem('authToken')) {
        token.value = localStorage.getItem('authToken');
      }
      console.log('Token value:', token.value); //Debugging
      const response = await fetch(`${baseUrl}/api/persons`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch persons');
      
      const data = await response.json();
      console.log('Persons data:', data);  // Debugging
      return data;
    } catch (err) {
      console.error('Error fetching persons:', err.message);  // Debugging
      error.value = err.message;
    }
  };

  const createPerson = async (personData) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Token mancante. Effettua il login.');
  
      console.log('Token presente:', token);  // Debug token
  
      const response = await fetch(`${baseUrl}/api/persons`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,  // Usa solo il token per autenticare
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personData),
      });
  
      // Verifica se la risposta non è andata a buon fine
      if (!response.ok) {
        const errorMessage = await response.text();  // Recupera il messaggio di errore come testo
        console.error('Errore dalla risposta:', errorMessage);  // Log dell'errore dal backend
        throw new Error(`Errore durante la creazione della persona: ${errorMessage}`);
      }
  
      // Verifica se la risposta è effettivamente JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();  // Restituisci il JSON se valido
      } else {
        const responseText = await response.text();  // Recupera la risposta come testo
        console.error('Risposta non in formato JSON:', responseText);
        throw new Error('Risposta non in formato JSON');
      }
  
    } catch (err) {
      console.error('Errore durante la creazione della persona:', err.message);
      throw err;
    }
  };
  
  

  const getPersonById = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/api/persons/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch person');
      return response.json();
    } catch (err) {
      error.value = err.message;
    }
  };

  const updatePerson = async (id, personData) => {
    try {
      const response = await fetch(`${baseUrl}/api/persons/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}`,
        },
        body: JSON.stringify(personData),
      });
      if (!response.ok) throw new Error('Failed to update person');
      return response.json();
    } catch (err) {
      error.value = err.message;
    }
  };

  const getCsrfCookie = async () => {
    await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
      method: 'GET',
      credentials: 'include'
    });
  };
    
  const deletePerson = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/api/persons/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to delete user');
      return response.json();
    } catch (err) {
      error.value = err.message;
    }
  };
  

  const register = async (userData) => {
    try {
      // Richiama il CSRF cookie prima della registrazione
      await getCsrfCookie();
  
      const response = await fetch(`${baseUrl}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',  // Include le credenziali
      });
  
      if (!response.ok) {
        throw new Error('Failed to register');
      }
  
      const data = await response.json();
      return data;
    } catch (err) {
      error.value = err.message || 'Unknown error occurred';
      throw err;
    }
  };
      
  const getUsers = async () => {
    try {
      if (localStorage.getItem('authToken')) {
        token.value = localStorage.getItem('authToken');
      }
      const response = await fetch(`${baseUrl}/api/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    } catch (err) {
      error.value = err.message;
    }
  };

  const updateUserRole = async (id, role) => {
    try {
      const response = await fetch(`${baseUrl}/api/users/${id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}`,
        },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) throw new Error('Failed to update user role');
      return response.json();
    } catch (err) {
      error.value = err.message;
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete user');
      return response.json();
    } catch (err) {
      error.value = err.message;
    }
  };

  return {
    login,
    logout,
    getPersons,
    createPerson,
    getPersonById,
    updatePerson,
    deletePerson,
    register,
    getUsers,
    getUser,
    updateUserRole,
    deleteUser,
    error,
  };
}
