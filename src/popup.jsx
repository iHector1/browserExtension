import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { auth } from './firebase'; // Asegúrate de tener esta ruta correcta
import './styles/custom.css';

function Popup() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    try {
      await auth.signInWithEmailAndPassword(email, password);
      setLoggedIn(true);
    } catch (error) {
      console.error('Error signing in with email and password', error);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await auth.signInWithPopup(provider);
      setLoggedIn(true);
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  const handleMicrosoftLogin = async () => {
    const provider = new firebase.auth.OAuthProvider('microsoft.com');
    try {
      await auth.signInWithPopup(provider);
      setLoggedIn(true);
    } catch (error) {
      console.error('Error signing in with Microsoft', error);
    }
  };

  return (
    <div className="container p-3">
      {!loggedIn ? (
        <div>
          <h2 className="mb-3">Login</h2>
          <form onSubmit={handleEmailLogin}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" className="form-control" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" className="form-control" required />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Login</button>
          </form>
          <button onClick={handleGoogleLogin} className="btn btn-danger btn-block mt-3">
            Login with Google
          </button>
          <button onClick={handleMicrosoftLogin} className="btn btn-info btn-block mt-3">
            Login with Microsoft
          </button>
        </div>
      ) : (
        <h3>You are logged in!</h3>
      )}
    </div>
  );
}

export default Popup;
