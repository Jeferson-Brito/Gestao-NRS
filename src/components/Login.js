import React, { useState } from 'react';
import PasswordInput from './PasswordInput';

const Login = ({ onLogin, onForgotPassword }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
        if (!email) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email inválido';
        }
        
        if (!password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (password.length < 6) {
            newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        try {
            await onLogin(email, password);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="login-particles">
                    {[...Array(50)].map((_, i) => (
                        <div key={i} className="particle" style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}></div>
                    ))}
                </div>
            </div>
            
            <div className="login-content">
                <div className="login-card">
                    <div className="login-header">
                        <div className="nexus-logo">
                            <div className="logo-icon">
                                <svg viewBox="0 0 100 100" className="nexus-symbol">
                                    <defs>
                                        <linearGradient id="nexusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#2563eb" />
                                            <stop offset="100%" stopColor="#06b6d4" />
                                        </linearGradient>
                                    </defs>
                                    <g fill="url(#nexusGradient)">
                                        <circle cx="50" cy="50" r="3" />
                                        <path d="M50,10 L60,20 L70,10 L80,20 L70,30 L60,20 L50,30 Z" />
                                        <path d="M50,90 L60,80 L70,90 L80,80 L70,70 L60,80 L50,70 Z" />
                                        <path d="M10,50 L20,60 L10,70 L20,80 L30,70 L20,60 L30,50 Z" />
                                        <path d="M90,50 L80,60 L90,70 L80,80 L70,70 L80,60 L70,50 Z" />
                                        <path d="M25,25 L35,35 L25,45 L35,55 L45,45 L35,35 L45,25 Z" />
                                        <path d="M75,75 L65,65 L75,55 L65,45 L55,55 L65,65 L55,75 Z" />
                                        <path d="M75,25 L65,35 L75,45 L65,55 L55,45 L65,35 L55,25 Z" />
                                        <path d="M25,75 L35,65 L25,55 L35,45 L45,55 L35,65 L45,75 Z" />
                                    </g>
                                </svg>
                            </div>
                            <div className="logo-text">
                                <h1>Nexus</h1>
                                <p>Smart Management Solutions</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <div className="input-wrapper">
                                <i className="fa-solid fa-envelope input-icon"></i>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={errors.email ? 'error' : ''}
                                    placeholder="seu@email.com"
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Senha</label>
                            <div className="input-wrapper">
                                <i className="fa-solid fa-lock input-icon"></i>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={errors.password ? 'error' : ''}
                                    placeholder="Sua senha"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>

                        <div className="form-options">
                            <button
                                type="button"
                                className="forgot-password"
                                onClick={onForgotPassword}
                                disabled={isLoading}
                            >
                                Esqueceu sua senha?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className={`login-button ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                    Entrando...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-sign-in-alt"></i>
                                    Entrar
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <div className="security-badges">
                            <div className="badge">
                                <i className="fa-solid fa-shield-halved"></i>
                                <span>Seguro</span>
                            </div>
                            <div className="badge">
                                <i className="fa-solid fa-lock"></i>
                                <span>Protegido</span>
                            </div>
                            <div className="badge">
                                <i className="fa-solid fa-cloud"></i>
                                <span>Cloud</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;