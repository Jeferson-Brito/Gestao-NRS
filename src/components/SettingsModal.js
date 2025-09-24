import React, { useState } from 'react';

const SettingsModal = ({ show, onClose, onToggleTheme, theme, user, showToastMessage }) => {
    const [notifications, setNotifications] = useState(localStorage.getItem('notifications') === 'true');
    const [autoRefresh, setAutoRefresh] = useState(localStorage.getItem('autoRefresh') === 'true');
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'pt-BR');

    const handleNotificationToggle = () => {
        const newValue = !notifications;
        setNotifications(newValue);
        localStorage.setItem('notifications', newValue.toString());
        showToastMessage(
            newValue ? 'Notificações habilitadas!' : 'Notificações desabilitadas!', 
            newValue ? 'fa-bell' : 'fa-bell-slash'
        );
    };

    const handleAutoRefreshToggle = () => {
        const newValue = !autoRefresh;
        setAutoRefresh(newValue);
        localStorage.setItem('autoRefresh', newValue.toString());
        showToastMessage(
            newValue ? 'Atualização automática habilitada!' : 'Atualização automática desabilitada!', 
            newValue ? 'fa-arrows-rotate' : 'fa-pause'
        );
    };

    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
        
        const languageNames = {
            'pt-BR': 'Português (Brasil)',
            'en-US': 'English (US)',
            'es-ES': 'Español'
        };
        
        showToastMessage(
            `Idioma alterado para ${languageNames[newLanguage]}!`, 
            'fa-language'
        );
        
        // Aplicar mudança de idioma imediatamente
        applyLanguageChange(newLanguage);
    };

    const applyLanguageChange = (lang) => {
        // Traduções básicas
        const translations = {
            'pt-BR': {
                'Sistema de Gestão NRS': 'Sistema de Gestão NRS',
                'Dashboard': 'Dashboard',
                'Escala': 'Escala',
                'Calendário': 'Calendário',
                'Base de Conhecimentos': 'Base de Conhecimentos',
                'Gerenciar Usuários': 'Gerenciar Usuários',
                'Configurações': 'Configurações',
                'Sair': 'Sair'
            },
            'en-US': {
                'Sistema de Gestão NRS': 'NRS Management System',
                'Dashboard': 'Dashboard',
                'Escala': 'Schedule',
                'Calendário': 'Calendar',
                'Base de Conhecimentos': 'Knowledge Base',
                'Gerenciar Usuários': 'Manage Users',
                'Configurações': 'Settings',
                'Sair': 'Logout'
            },
            'es-ES': {
                'Sistema de Gestão NRS': 'Sistema de Gestión NRS',
                'Dashboard': 'Panel',
                'Escala': 'Horario',
                'Calendário': 'Calendario',
                'Base de Conhecimentos': 'Base de Conocimientos',
                'Gerenciar Usuários': 'Gestionar Usuarios',
                'Configurações': 'Configuraciones',
                'Sair': 'Salir'
            }
        };

        // Aplicar traduções aos elementos da página
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
    };

    const handleExportData = () => {
        // Função para exportar dados do usuário
        const userData = {
            user: user,
            settings: {
                theme,
                notifications,
                autoRefresh,
                language
            },
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `gestao-nrs-settings-${user.username}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div id="modalSettings" className="modal" style={{ display: show ? 'block' : 'none' }}>
            <div className="modal-content" style={{ maxWidth: '500px' }}>
                <span className="close-btn" onClick={onClose}>&times;</span>
                <h2><i className="fa-solid fa-gear"></i> Configurações</h2>
                
                <div className="settings-options">
                    {/* Tema */}
                    <div className="setting-item">
                        <div className="setting-label">
                            <i className="fa-solid fa-palette"></i>
                            <span>Tema da Interface</span>
                        </div>
                        <button className="btn theme-toggle-modal" onClick={onToggleTheme}>
                            <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
                            {theme === 'light' ? 'Claro' : 'Escuro'}
                        </button>
                    </div>

                    {/* Notificações */}
                    <div className="setting-item">
                        <div className="setting-label">
                            <i className="fa-solid fa-bell"></i>
                            <span>Notificações</span>
                        </div>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                checked={notifications} 
                                onChange={handleNotificationToggle}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    {/* Auto Refresh */}
                    <div className="setting-item">
                        <div className="setting-label">
                            <i className="fa-solid fa-arrows-rotate"></i>
                            <span>Atualização Automática</span>
                        </div>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                checked={autoRefresh} 
                                onChange={handleAutoRefreshToggle}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    {/* Idioma */}
                    <div className="setting-item">
                        <div className="setting-label">
                            <i className="fa-solid fa-language"></i>
                            <span>Idioma</span>
                        </div>
                        <select value={language} onChange={handleLanguageChange} className="language-select">
                            <option value="pt-BR">Português (Brasil)</option>
                            <option value="en-US">English (US)</option>
                            <option value="es-ES">Español</option>
                        </select>
                    </div>

                    {/* Informações do Usuário */}
                    <div className="setting-item user-info">
                        <div className="setting-label">
                            <i className="fa-solid fa-user"></i>
                            <span>Informações da Conta</span>
                        </div>
                        <div className="user-details">
                            <p><strong>Nome:</strong> {user?.username}</p>
                            <p><strong>Email:</strong> {user?.email}</p>
                            <p><strong>Permissão:</strong> {user?.role}</p>
                        </div>
                    </div>

                    {/* Exportar Dados */}
                    <div className="setting-item">
                        <div className="setting-label">
                            <i className="fa-solid fa-download"></i>
                            <span>Exportar Configurações</span>
                        </div>
                        <button className="btn btn-secondary" onClick={handleExportData}>
                            <i className="fa-solid fa-download"></i> Baixar
                        </button>
                    </div>
                </div>

                <div className="settings-footer">
                    <button className="btn btn-primary" onClick={onClose}>
                        <i className="fa-solid fa-check"></i> Salvar e Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;