import React, { useState, useEffect } from 'react';

const TurnoModal = ({ turnos, onSave, onDelete, onReorder, onCancel, user }) => {
  const [nome, setNome] = useState('');
  const [horario, setHorario] = useState('');
  const [cor, setCor] = useState('#1f4e79');
  const [originalName, setOriginalName] = useState(null);
  const [draggableTurnos, setDraggableTurnos] = useState(Object.keys(turnos).sort((a, b) => turnos[a].ordem - turnos[b].ordem));

  const isUserAdmin = user && user.role === 'admin';

  useEffect(() => {
    setDraggableTurnos(Object.keys(turnos).sort((a, b) => turnos[a].ordem - turnos[b].ordem));
  }, [turnos]);

  const handleEdit = (turnoNome) => {
    if (!isUserAdmin) return;
    const turno = turnos[turnoNome];
    setOriginalName(turnoNome);
    setNome(turnoNome);
    setHorario(turno.horario);
    setCor(turno.cor);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isUserAdmin) return;
    onSave({
      originalName,
      name: nome,
      details: {
        horario,
        cor,
      }
    });
    setNome('');
    setHorario('');
    setCor('#1f4e79');
    setOriginalName(null);
  };

  const handleDrop = (e, droppedOnName) => {
    e.preventDefault();
    if (!isUserAdmin) return;
    const draggedName = e.dataTransfer.getData('turnoName');
    const newOrder = [...draggableTurnos];
    const draggedIndex = newOrder.indexOf(draggedName);
    const droppedIndex = newOrder.indexOf(droppedOnName);

    if (draggedIndex === -1 || droppedIndex === -1) return;

    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(droppedIndex, 0, removed);
    setDraggableTurnos(newOrder);
    onReorder(newOrder);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDragStart = (e, turnoName) => {
    if (!isUserAdmin) return;
    e.dataTransfer.setData('turnoName', turnoName);
  };

  return (
    <>
      <h2>Gerenciar Turnos</h2>
      <div className="turno-list-container">
        <table id="turnos-table">
          <thead>
            <tr>
              <th>Turno</th>
              <th>Horário</th>
              <th>Cor</th>
              {isUserAdmin && <th>Ações</th>}
            </tr>
          </thead>
          <tbody onDragOver={handleDragOver}>
            {draggableTurnos.map(turnoName => (
              <tr key={turnoName} draggable={isUserAdmin} onDragStart={(e) => handleDragStart(e, turnoName)} onDrop={(e) => handleDrop(e, turnoName)}>
                <td>{turnoName}</td>
                <td>{turnos[turnoName].horario}</td>
                <td><div className="color-swatch" style={{ backgroundColor: turnos[turnoName].cor }}></div></td>
                {isUserAdmin && (
                    <td>
                        <button className="edit-turno-btn" onClick={() => handleEdit(turnoName)}><i className="fa-solid fa-pen-to-square"></i></button>
                        <button className="delete-turno-btn" onClick={() => onDelete(turnoName)}><i className="fa-solid fa-trash-can"></i></button>
                    </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isUserAdmin && (
          <>
            <h3>{originalName ? 'Editar Turno' : 'Adicionar Turno'}</h3>
            <form id="turno-form" className="form-horizontal" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="turno-nome">Nome do Turno:</label>
                <input type="text" id="turno-nome" required value={nome} onChange={e => setNome(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="turno-horario">Horário de Trabalho:</label>
                <input type="text" id="turno-horario" placeholder="Ex: 14:00 - 22:00" required value={horario} onChange={e => setHorario(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="turno-cor">Cor da Tabela:</label>
                <input type="color" id="turno-cor" value={cor} onChange={e => setCor(e.target.value)} required />
              </div>
              <div className="modal-buttons">
                <button type="button" id="btnCancelarTurno" className="btn secondary" onClick={onCancel}>Cancelar</button>
                <button type="submit" id="btnSalvarTurno" className="btn primary">Salvar Turno</button>
              </div>
            </form>
          </>
      )}
    </>
  );
};

export default TurnoModal;