import React from 'react';
import ReactDOM from 'react-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { firebaseConfig } from './firebase';
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

  const handleGoogleSignIn = e => {
    console.log("Iniciando con Google");
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
        console.log('Iniciado con email');
        setUser(userCredential.user);
        setError('');
      })
      .catch(error => {
        setError("Verifica tu correo y contraseña.");
      });
  };

  const fetchLinks = async () => {
    console.log("si doy links");
    const q = query(collection(db, "links"), where("nombre_link", "==", "main"));
    const querySnapshot = await getDocs(q);
    const linksArray = [];
    querySnapshot.forEach((doc) => {
      linksArray.push(doc.data());
    });
    setLinks(linksArray);
  };
  function handleLinkClick(link) {
    // Lógica para manejar el clic en el enlace
    console.log("Enlace clicado:", link);
 // Abrir el enlace en una ventana emergente en pantalla completa
 const screenWidth = window.screen.width;
 const screenHeight = window.screen.height;
 window.open(link, '_blank', `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${screenWidth},height=${screenHeight}`);
  }
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user ? user : null);
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (user) {
      console.log("si entro");
      fetchLinks();
    }
  }, [user]);

  if (user === undefined) return <div className="container mt-5"><h1>Cargando...</h1></div>;

  if (user) return (
<div className="container mt-5">
  <h1>Bienvenido a LearnBoard</h1>
  
    {links.map((link, index) => (
      <button key={index} className="btn btn-success mb-3 w-100mb-3 w-100" onClick={() => handleLinkClick(link.link)}>
        {link.nombre}
      </button>
    ))}
    <button className="btn btn-primary w-100" onClick={() => auth.signOut()}>Cerrar Sesión</button>
  </div>
  );

  return (
    <div className="container mt-5">
      <h1>Iniciar Sesión</h1>
      {showLogin ? (
        <div>
          <button className="btn btn-danger mb-3 w-100" onClick={() => setShowLogin(false)}>Iniciar sesión con Email</button>
          <button className="btn btn-primary w-100" onClick={handleGoogleSignIn}>Iniciar sesión con Google</button>
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
          <button type="button" className="btn btn-secondary mt-2 w-100" onClick={() => setShowLogin(true)}>Volver a Google</button>
        </form>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
