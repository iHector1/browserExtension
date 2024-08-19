import React from 'react';
import ReactDOM from 'react-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { firebaseConfig } from './firebase';
import 'bootstrap/dist/css/bootstrap.min.css';

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);

const App = () => {
  const [user, setUser] = React.useState(undefined);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [showLogin, setShowLogin] = React.useState(true);

  const handleGoogleSignIn = e => {
    console.log("hola");
        const provider = new GoogleAuthProvider();
        signInWithCredential(auth, provider)
            .then(userCredential => {
                console.log('signed in with Google!');
                setUser(userCredential.user);
                setError('');
            })
            .catch(error => {
                setError(error.message);
            });
  };

  const handleEmailSignIn = e => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        console.log('signed in with email!');
        setUser(userCredential.user);
        setError('');
      })
      .catch(error => {
        setError(error.message);
      });
  };

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user ? user : null);
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) return <div className="container mt-5"><h1>Loading...</h1></div>;

  if (user) return (
    <div className="container mt-5">
      <h1>Signed in as {user.displayName}.</h1>
      <button className="btn btn-primary" onClick={() => auth.signOut()}>Sign Out?</button>
    </div>
  );

  return (
    <div className="container mt-5">
      <h1>Sign In</h1>
      {showLogin ? (
        <div>
          <button className="btn btn-danger mb-3" onClick={() => setShowLogin(false)}>Sign In with Email</button>
          <button className="btn btn-primary" onClick={handleGoogleSignIn}>Sign In with Google</button>
        </div>
      ) : (
        <form onSubmit={handleEmailSignIn}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
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
            <label htmlFor="password" className="form-label">Password</label>
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
          <button type="submit" className="btn btn-primary">Sign In</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowLogin(true)}>Back to Google Sign In</button>
        </form>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
