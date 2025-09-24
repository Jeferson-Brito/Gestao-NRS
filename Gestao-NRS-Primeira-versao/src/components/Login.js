import React, { useState, useEffect } from 'react';
import logo from '../images/image_979eb5.png';
import PasswordInput from './PasswordInput';
import axios from 'axios'; // Importe a biblioteca axios para fazer requisições HTTP

const Login = ({ onLogin, onForgotPassword, showToastMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    try {
      // Fazendo uma requisição POST para a API do seu servidor
      const response = await axios.post('http://localhost:3001/api/login', {
        email,
        password,
      }, {
        timeout: 10000, // 10 segundos de timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Se a requisição for bem-sucedida, chama a função de login no componente pai
      if (response.status === 200) {
        onLogin(response.data);
      }
    } catch (error) {
      // Exibe a mensagem de erro usando o Toast
      console.log('Erro no login:', error);
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        showToastMessage('Servidor não está rodando. Verifique se o backend está ativo.', 'fa-server', true);
      } else if (error.response && error.response.status === 401) {
        showToastMessage('Email ou senha incorretos. Verifique suas credenciais.', 'fa-user-times', true);
      } else if (error.response && error.response.data && error.response.data.error) {
        showToastMessage(error.response.data.error, 'fa-exclamation-circle', true);
      } else if (error.message.includes('timeout')) {
        showToastMessage('Tempo limite esgotado. Tente novamente.', 'fa-clock', true);
      } else {
        showToastMessage('Erro de conexão: ' + (error.message || 'Servidor indisponível'), 'fa-wifi', true);
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
      </div>
    </div>
  );
};

export default Login;