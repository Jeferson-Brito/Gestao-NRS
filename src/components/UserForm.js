import React, { useState, useEffect } from 'react';

const UserForm = ({ user, onSave, onCancel }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('common');

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setEmail(user.email);
            setPassword(user.password);
            setRole(user.role);
        } else {
            setUsername('');
            setEmail('');
            setPassword('');
            setRole('common');
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            id: user?.id,
            username,
            email,
            password,
            role
        });
        onCancel();
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 id="modal-title-user">{user ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h2>
            <div className="form-group">
                <label htmlFor="username">Nome de Usuário:</label>
                <input type="text" id="username" required value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="password">Senha:</label>
                <input type="password" id="password" required={!user} value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="role">Permissão:</label>
                <select id="role" value={role} onChange={e => setRole(e.target.value)}>
                    <option value="common">Comum</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div className="modal-buttons">
                <button type="button" className="btn secondary" onClick={onCancel}>Cancelar</button>
                <button type="submit" className="btn primary">Salvar</button>
            </div>
        </form>
    );
};

export default UserForm;