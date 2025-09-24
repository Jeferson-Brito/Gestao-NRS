import React, { useState, useRef, useEffect } from 'react';
import logo from '../images/image_979eb5.png';

const Navbar = ({ onNavigate, onSettingsToggle, currentPage, user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null); // Cria uma referência para o container do perfil

  const handleLinkClick = (e, pageId) => {
    e.preventDefault();
    onNavigate(pageId);
    setMenuOpen(false); // Fecha o menu em telas menores
    setProfileMenuOpen(false); // Fecha o menu de perfil
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };
  
  const handleLogoutClick = () => {
      onLogout();
      setProfileMenuOpen(false);
  };
  
  const handleSettingsClick = () => {
      onSettingsToggle();
      setProfileMenuOpen(false);
  };

  // Efeito para fechar o menu ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  return (
    <header className="header">
      <nav className="navbar">
        <a href="#home" className="nexus-logo" onClick={(e) => handleLinkClick(e, 'dashboard')}>
          <div className="nexus-icon">
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
          <div className="nexus-text">
            <span className="nexus-name">Nexus</span>
            <span className="nexus-tagline">Smart Management Solutions</span>
          </div>
        </a>
        <ul className={`nav-links ${menuOpen ? 'show' : ''}`}>
          <li><a href="#dashboard" className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`} data-page="dashboard" onClick={(e) => handleLinkClick(e, 'dashboard')} data-translate="Dashboard"><i className="fa-solid fa-gauge-high"></i> Dashboard</a></li>
          <li><a href="#escala" className={`nav-link ${currentPage === 'escala' ? 'active' : ''}`} data-page="escala" onClick={(e) => handleLinkClick(e, 'escala')} data-translate="Escala"><i className="fa-solid fa-calendar-alt"></i> Escala</a></li>
          <li><a href="#calendario" className={`nav-link ${currentPage === 'calendario' ? 'active' : ''}`} data-page="calendario" onClick={(e) => handleLinkClick(e, 'calendario')} data-translate="Calendário"><i className="fa-solid fa-calendar-check"></i> Calendário</a></li>
          <li><a href="#base-conhecimentos" className={`nav-link ${currentPage === 'base-conhecimentos' ? 'active' : ''}`} data-page="base-conhecimentos" onClick={(e) => handleLinkClick(e, 'base-conhecimentos')} data-translate="Base de Conhecimentos"><i className="fa-solid fa-book"></i> Base de Conhecimentos</a></li>
        </ul>
        <div className="nav-actions">
          {user && (
            <div className="profile-container" ref={profileRef}>
              <button className="profile-btn" onClick={toggleProfileMenu}>
                <i className="fa-solid fa-user-circle"></i>
              </button>
              {profileMenuOpen && (
                <div className="profile-dropdown">
                  <div className="profile-header">
                    <span className="profile-name">{user.username}</span>
                    <span className={`profile-role ${user.role}`}>
                        {user.role === 'admin' ? 'Administrador' : 'Analista'}
                    </span>
                  </div>
                  {user.role === 'admin' && (
                    <a href="#gerenciar-usuarios" className="dropdown-item" onClick={(e) => handleLinkClick(e, 'gerenciar-usuarios')} data-translate="Gerenciar Usuários">
                      <i className="fa-solid fa-users-gear"></i> Gerenciar Usuários
                    </a>
                  )}
                  <a href="#settings" className="dropdown-item" onClick={handleSettingsClick} data-translate="Configurações">
                    <i className="fa-solid fa-gear"></i> Configurações
                  </a>
                  <button className="dropdown-item" onClick={handleLogoutClick} data-translate="Sair">
                    <i className="fa-solid fa-right-from-bracket"></i> Sair
                  </button>
                </div>
              )}
            </div>
          )}
          <button className="menu-toggle" id="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;