import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './styles/custom.css';

function Popup() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleEmailLogin = (e) => {
    e.preventDefault();
    // Lógica para el login con correo y contraseña
    setLoggedIn(true);
  };

  const handleGoogleLogin = () => {
    // Lógica para el login con Google
    setLoggedIn(true);
  };

  const handleMicrosoftLogin = () => {
    // Lógica para el login con Microsoft
    setLoggedIn(true);
  };

  return (
    <div className="container p-3">
      {!loggedIn ? (
        <div>
          <h2 className="mb-3">Login</h2>
          <form onSubmit={handleEmailLogin}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-control" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-control" required />
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

ReactDOM.render(<Popup />, document.getElementById('root'));
