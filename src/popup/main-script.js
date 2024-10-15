import { firebaseApp } from './firebase_config';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth(firebaseApp);

// Verifica si el usuario está autenticado
onAuthStateChanged(auth, user => {
    if (!user) {
        window.location.replace('./popup.html');
    }
});

// Botón para cerrar sesión
document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.replace('./popup.html');
    }).catch(() => {
        alert('Hubo un error al cerrar la sesión');
    });
});

// Botón para iniciar una pizarra (puedes personalizarlo)
document.getElementById('start-board-btn').addEventListener('click', () => {
  const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
  window.open("https://learn-board.tech/welcome", '_blank', `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${screenWidth},height=${screenHeight}`);
});
