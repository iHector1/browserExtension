import { firebaseApp } from './firebase_config';
import {
    getAuth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithCredential,
    onAuthStateChanged
} from 'firebase/auth';

const auth = getAuth(firebaseApp);

// Selecciona los elementos del DOM
const loginBtn = document.getElementById('login-btn');
const googleLoginBtn = document.getElementById('google-login-btn');
const registerBtn = document.getElementById('register-btn');
const errorMessage = document.getElementById('error-message');

// Iniciar sesión con correo y contraseña
loginBtn.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            window.location.replace('./main.html');
        })
        .catch(() => {
            displayError('Error al iniciar sesión. Verifica tu correo y contraseña.');
        });
});

// Iniciar sesión con Google utilizando chrome.identity.getAuthToken
googleLoginBtn.addEventListener('click', () => {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
            displayError('No se pudo obtener el token de Google. Inténtalo de nuevo.');
            return;
        }

        if (token) {
            // Crear la credencial de Firebase con el token de Google
            const credential = GoogleAuthProvider.credential(null, token);

            // Iniciar sesión en Firebase con la credencial
            signInWithCredential(auth, credential)
                .then(() => {
                    window.location.replace('./main.html');
                })
                .catch(() => {
                    displayError('No se pudo iniciar sesión con Google en Firebase. Inténtalo de nuevo.');
                });
        } else {
            displayError('No se recibió un token válido de Google.');
        }
    });
});

// Registro - Abrir ventana emergente
registerBtn.addEventListener('click', (event) => {
    event.preventDefault();  // Prevenir el comportamiento predeterminado si fuera el caso
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    
    // Prevenir duplicados asegurando que no se abra más de una ventana
    if (!window.openedRegisterWindow || window.openedRegisterWindow.closed) {
        window.openedRegisterWindow = window.open(
            "https://learn-board.tech/register", 
            '_blank', 
            `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${screenWidth},height=${screenHeight}`
        );
    }
});
// Mostrar mensaje de error
function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('d-none');
}
