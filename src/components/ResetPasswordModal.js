import React, { useState } from 'react';
import Modal from './Modal';
import axios from 'axios';
import PasswordInput from './PasswordInput';

const ResetPasswordModal = ({ show, onClose, token }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const API_URL = 'http://localhost:3001/api';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        if (password !== confirmPassword) {
            setMessage('As senhas não coincidem!');
            setIsError(true);
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/reset-password`, { token, password });
            setMessage(response.data.message);
            setTimeout(onClose, 3000);
        } catch (error) {
            setMessage(error.response?.data?.error || 'Erro ao redefinir a senha.');
            setIsError(true);
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <h2>Redefinir Senha</h2>
                <div className="form-group">
                    <label htmlFor="new-password">Nova Senha:</label>
                    <PasswordInput
                        id="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Digite a nova senha"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirm-password">Confirme a Nova Senha:</label>
                    <PasswordInput
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirme a nova senha"
                        required
                    />
                </div>
                {message && (
                    <p style={{ color: isError ? 'red' : 'green' }}>{message}</p>
                )}
                <div className="modal-buttons">
                    <button type="submit" className="btn primary">Redefinir Senha</button>
                    <button type="button" className="btn secondary" onClick={onClose}>Cancelar</button>
                </div>
            </form>
        </Modal>
    );
};

export default ResetPasswordModal;