import React, { useState } from 'react';
import logo from '../images/image_979eb5.png'; // Importa o logo

const Login = ({ onLogin, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="Logo Equipe NRS" className="login-logo" />
        <h2 className="login-title">Acesse sua conta</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="forgot-password">
            <a href="#" onClick={onForgotPassword}>Esqueci minha senha</a>
          </div>
          <button type="submit" className="btn primary full-width">Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;