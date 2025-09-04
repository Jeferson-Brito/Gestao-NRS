import React, { useState } from 'react';
import Modal from './Modal';
import UserForm from './UserForm';

const UserManagement = ({ users, onSaveUser, onDeleteUser }) => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title"><i className="fa-solid fa-users-gear"></i> Gerenciar Usuários</h1>
        <div className="page-actions">
          <button className="btn primary" onClick={handleAddUser}><i className="fa-solid fa-user-plus"></i> Novo Usuário</button>
        </div>
      </div>
      <div className="users-list-container">
        <table id="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome de Usuário</th>
              <th>Email</th>
              <th>Permissão</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="edit-user-btn" onClick={() => handleEditUser(user)}>Editar</button>
                  <button className="delete-user-btn" onClick={() => onDeleteUser(user.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={isUserModalOpen} onClose={() => setIsUserModalOpen(false)}>
        <UserForm
          user={editingUser}
          onSave={onSaveUser}
          onCancel={() => setIsUserModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default UserManagement;