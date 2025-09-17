import React from 'react';

const SettingsModal = ({ show, onClose, onToggleTheme, theme }) => {
    return (
        <div id="modalSettings" className="modal" style={{ display: show ? 'block' : 'none' }}>
            <div className="modal-content">
                <span className="close-btn" onClick={onClose}>&times;</span>
                <h2>Configurações</h2>
                <div className="settings-options">
                    <div className="theme-toggle-container">
                        <p>Tema:</p>
                        <button id="btnThemeToggleModal" className="btn theme-toggle-modal" onClick={onToggleTheme}>
                            <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;