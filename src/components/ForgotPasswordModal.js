import React, { useState } from 'react';
import Modal from './Modal';
import axios from 'axios';

const ForgotPasswordModal = ({ show, onClose, showToastMessage }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/forgot-password', { email });
            showToastMessage(response.data.message, 'fa-envelope');
            onClose();
        } catch (error) {
            showToastMessage(error.response?.data?.error || 'Erro ao solicitar redefinição de senha.', 'fa-exclamation-circle', true);
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <h2>Esqueci a Senha</h2>
                <p>Digite seu e-mail para receber um link de redefinição de senha.</p>
                <div className="form-group">
                    <label htmlFor="email-forgot">Email:</label>
                    <input
                        type="email"
                        id="email-forgot"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="modal-buttons">
                    <button type="submit" className="btn primary">Enviar</button>
                    <button type="button" className="btn secondary" onClick={onClose}>Cancelar</button>
                </div>
            </form>
        </Modal>
    );
};

export default ForgotPasswordModal;