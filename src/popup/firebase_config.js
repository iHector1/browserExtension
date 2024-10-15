import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyA28orE08oYLCt0EV79b1AiLjUvuJourlU",
    authDomain: "learnboard-d2306.firebaseapp.com",
    projectId: "learnboard-d2306",
    storageBucket: "learnboard-d2306.appspot.com",
    messagingSenderId: "277297604892",
    appId: "1:277297604892:web:47d68891b7d9ab321972d9",
    measurementId: "G-2J6NSQ8334"
};

const firebaseApp = initializeApp(firebaseConfig);

export { firebaseApp };
