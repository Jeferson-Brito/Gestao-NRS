<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import logo from '../images/image_979eb5.png';
import PasswordInput from './PasswordInput';
import axios from 'axios'; // Importe a biblioteca axios para fazer requisições HTTP
=======
import React, { useState } from 'react';
import logo from '../images/image_979eb5.png'; // Importa o logo
>>>>>>> 3a7d2720fca6b866ea98c218f4404af359e27906

const Login = ({ onLogin, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Estado para a mensagem de erro

  useEffect(() => {
    // Adicionar classe ao body quando o componente montar
    document.body.classList.add('login-active');
    
    // Remover classe quando o componente desmontar
    return () => {
      document.body.classList.remove('login-active');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(''); // Limpa a mensagem de erro anterior
    try {
      // Fazendo uma requisição POST para a API do seu servidor
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });

      // Se a requisição for bem-sucedida, chama a função de login no componente pai
      if (response.status === 200) {
        onLogin(response.data.token);
      }
    } catch (error) {
      // Exibe a mensagem de erro da API ou uma mensagem padrão
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Ocorreu um erro ao tentar fazer login. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modern-login-container">
      {/* Background com gradiente animado */}
      <div className="login-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Card de login moderno */}
      <div className="modern-login-card">
        {/* Header com logo */}
        <div className="login-header">
          <div className="logo-container">
            <img src={logo} alt="Logo Equipe NRS" className="modern-logo" />
            <div className="logo-text">
              <span className="logo-main">Gestão</span>
              <span className="logo-sub">NRS</span>
            </div>
          </div>
          <h1 className="login-title">Bem-vindo de volta!</h1>
          <p className="login-subtitle">Acesse sua conta para continuar</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="modern-form">
          <div className="input-group">
            <div className="input-container">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                className="modern-input"
                required
              />
              <label htmlFor="email" className="input-label">Email</label>
            </div>
          </div>

          <div className="input-group">
            <div className="input-container">
              <i className="fas fa-lock input-icon"></i>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="modern-input"
                required
              />
              <label htmlFor="password" className="input-label">Senha</label>
            </div>
          </div>

          {/* Exibindo a mensagem de erro */}
          {errorMessage && (
            <div className="error-message-container">
              <span className="error-message">{errorMessage}</span>
            </div>
          )}

          <div className="form-options">
            <button
              type="button"
              className="forgot-password-link"
              onClick={onForgotPassword}
            >
              <i className="fas fa-key"></i>
              Esqueci minha senha
            </button>
          </div>

          <button
            type="submit"
            className={`modern-submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Entrando...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Entrar
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p className="footer-text">
            <i className="fas fa-shield-alt"></i>
            Sistema seguro e confiável
          </p>
        </div>
      </div>

      {/* Decoração adicional */}
      <div className="login-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
=======

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
>>>>>>> 3a7d2720fca6b866ea98c218f4404af359e27906
      </div>
    </div>
  );
};

export default Login;