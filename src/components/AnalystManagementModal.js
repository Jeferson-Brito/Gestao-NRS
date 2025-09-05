import React, { useState } from 'react';
import AnalistaForm from './AnalistaForm';
import Modal from './Modal';

const AnalystManagementModal = ({ show, onClose, analysts, turnos, onSave, onDelete }) => {
  const [isAnalistaFormOpen, setIsAnalistaFormOpen] = useState(false);
  const [editingAnalyst, setEditingAnalyst] = useState(null);

  const handleEditClick = (analyst) => {
    setEditingAnalyst(analyst);
    setIsAnalistaFormOpen(true);
  };

  const handleAddClick = () => {
    setEditingAnalyst(null);
    setIsAnalistaFormOpen(true);
  };

  const handleFormClose = () => {
    setIsAnalistaFormOpen(false);
    setEditingAnalyst(null);
  };

  return (
    <>
      <Modal show={show} onClose={onClose}>
        <h2 id="modal-title-gerenciar-analistas">Gerenciar Analistas</h2>
        <div className="analysts-list-container">
          <table id="analysts-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Turno</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {analysts.map(analyst => (
                <tr key={analyst.id}>
                  <td>{analyst.nome}</td>
                  <td>{analyst.turno}</td>
                  <td>
                    <button className="edit-analista-btn btn" onClick={() => handleEditClick(analyst)}><i className="fa-solid fa-pen-to-square"></i></button>
                    <button className="delete-analista-btn btn" onClick={() => onDelete(analyst.id)}><i className="fa-solid fa-trash-can"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="modal-buttons">
            <button type="button" className="btn primary" onClick={handleAddClick}><i className="fa-solid fa-user-plus"></i> Adicionar Novo</button>
            <button type="button" className="btn secondary" onClick={onClose}>Fechar</button>
        </div>
      </Modal>

      <Modal show={isAnalistaFormOpen} onClose={handleFormClose}>
        <AnalistaForm
          analista={editingAnalyst}
          turnos={turnos}
          onSave={(data) => { onSave(data); handleFormClose(); }}
          onCancel={handleFormClose}
        />
      </Modal>
    </>
  );
};

export default AnalystManagementModal;