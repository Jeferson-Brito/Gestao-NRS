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
        <a href="#home" className="logo-title" onClick={(e) => handleLinkClick(e, 'dashboard')}>
          <img src={logo} alt="Logo Equipe NRS" className="logo-nav" />
          Gestão NRS
        </a>
        <ul className={`nav-links ${menuOpen ? 'show' : ''}`}>
          <li><a href="#dashboard" className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`} data-page="dashboard" onClick={(e) => handleLinkClick(e, 'dashboard')}><i className="fa-solid fa-gauge-high"></i> Dashboard</a></li>
          <li><a href="#escala" className={`nav-link ${currentPage === 'escala' ? 'active' : ''}`} data-page="escala" onClick={(e) => handleLinkClick(e, 'escala')}><i className="fa-solid fa-calendar-alt"></i> Escala</a></li>
          <li><a href="#calendario" className={`nav-link ${currentPage === 'calendario' ? 'active' : ''}`} data-page="calendario" onClick={(e) => handleLinkClick(e, 'calendario')}><i className="fa-solid fa-calendar-check"></i> Calendário</a></li>
          <li><a href="#base-conhecimentos" className={`nav-link ${currentPage === 'base-conhecimentos' ? 'active' : ''}`} data-page="base-conhecimentos" onClick={(e) => handleLinkClick(e, 'base-conhecimentos')}><i className="fa-solid fa-book"></i> Base de Conhecimentos</a></li>
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
                    <span className={`profile-role ${user.role}`}>{user.role === 'admin' ? 'Admin' : 'Comum'}</span>
                  </div>
                  {user.role === 'admin' && (
                    <a href="#gerenciar-usuarios" className="dropdown-item" onClick={(e) => handleLinkClick(e, 'gerenciar-usuarios')}>
                      <i className="fa-solid fa-users-gear"></i> Gerenciar Usuários
                    </a>
                  )}
                  <a href="#settings" className="dropdown-item" onClick={handleSettingsClick}>
                    <i className="fa-solid fa-gear"></i> Configurações
                  </a>
                  <button className="dropdown-item" onClick={handleLogoutClick}>
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