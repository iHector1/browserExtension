import React from 'react';
import ReactDOM from 'react-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { firebaseConfig } from './firebase';
import CryptoJS from 'crypto-js';
import 'bootstrap/dist/css/bootstrap.min.css';

// Inicializar Firebase
const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const db = getFirestore(firebase);

const App = () => {
  const [user, setUser] = React.useState(undefined);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [showLogin, setShowLogin] = React.useState(true);
  const [links, setLinks] = React.useState([]);
  const [registerLink, setRegisterLink] = React.useState(''); // Estado para el enlace de registro
  const [registerName, setRegisterName] = React.useState(''); // Estado para el nombre de registro
  // Clave secreta desde el archivo .env
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  const handleGoogleSignIn = e => {
    chrome.identity.getAuthToken({ interactive: true }, async function (token) {
      if (chrome.runtime.lastError || !token) {
        console.error(chrome.runtime.lastError.message);
        return;
      }
      if (token) {
        const credential = GoogleAuthProvider.credential(null, token);
        try {
          await signInWithCredential(auth, credential);
          setUser(auth.currentUser);  // Actualiza el usuario después de la autenticación
        } catch (e) {
          console.error("No se pudo iniciar sesión: ", e);
        }
      }
    });
  };

  const handleEmailSignIn = e => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        setUser(userCredential.user);
        setError('');
      })
      .catch(error => {
        setError("Verifica tu correo y contraseña.");
      });
  };

  const fetchLinks = async () => {
    try {
      const q = query(collection(db, "links"));
      const querySnapshot = await getDocs(q);
      const linksArray = [];
      let registerLinkTemp = '';

      querySnapshot.forEach((doc) => {
        const data = doc.data();
      if (data.nombre_link === "registro") {
          registerLinkTemp = data.link;  // Asigna el enlace de registro
          
        }else{
            linksArray.push(data);
        }
      });

      setLinks(linksArray);
      setRegisterLink(registerLinkTemp);  // Actualiza el estado con el enlace de registro

      // Agregar logs para depuración
      console.log("Links:", linksArray);
      console.log("Register Link:", registerLinkTemp);
    } catch (error) {
      console.error("Error fetching links: ", error);
    }
  };

  const encryptEmail = (email) => {
    // Concatenar email con la clave secreta y encriptar usando SHA-256
    const hash = CryptoJS.SHA256(email + secretKey).toString();
    return hash;
  };
  const handleRegisterLink=(link)=>{
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    window.open(link, '_blank', `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${screenWidth},height=${screenHeight}`);
  }

  const handleLinkClick = (link) => {
    if (user && user.email) {
      const encryptedEmail = encryptEmail(user.email);

      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const urlWithParams = `${link}?email=${encodeURIComponent(encryptedEmail)}`; // Añade el correo encriptado a la URL
      window.open(urlWithParams, '_blank', `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${screenWidth},height=${screenHeight}`);
    }
  };

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user ? user : null);
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (user) {
      fetchLinks();
    }else{
      fetchLinks();
    }
  }, [user]);

  if (user === undefined) return <div className="container mt-5"><h1>Cargando...</h1></div>;

  if (user) return (
    <div className="container mt-5">
      <h1>Bienvenido a LearnBoard</h1>
      {links.map((link, index) => (
        <button key={index} className="btn btn-success mb-3 w-100" onClick={() => handleLinkClick(link.link)}>
          {link.nombre}
        </button>
      ))}
      <button className="btn btn-secondary mt-3 mb-5 w-100" onClick={() => auth.signOut()}>Cerrar Sesión</button>
    </div>
  );

  return (
    <div className="container mt-5">
      <h1 className='mb-3'>Iniciar Sesión</h1>
      {showLogin ? (
        <div>
          <button className="btn btn-primary mb-3 w-100" onClick={() => setShowLogin(false)}>Iniciar sesión con Email</button>
          <button className="btn btn-danger w-100" onClick={handleGoogleSignIn}>Iniciar sesión con Google</button>
          {registerLink && ( // Renderiza el botón de "Registrarse" solo si se ha recuperado el enlace
            <button className="btn btn-success mt-3 mb-5 w-100" onClick={() => handleRegisterLink(registerLink)}>Registrarse</button>
          )}
        </div>
      ) : (
        <form onSubmit={handleEmailSignIn}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
          <button type="button" className="btn btn-secondary mt-3 mb-5 w-100" onClick={() => setShowLogin(true)}>Volver</button>
        </form>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
