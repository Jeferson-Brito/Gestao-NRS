import React from 'react';

const EventDetailsModal = ({ events, analistas, onClose, onEdit, onDelete, user }) => {
    const isUserAdmin = user && user.role === 'admin';

    return (
        <>
            <h2 id="detalhe-evento-titulo">Detalhes do Evento</h2>
            <div id="detalhe-evento-body">
                {events.map(event => (
                    <div key={event.id} className="evento-card-detail">
                        <h3>{event.titulo}</h3>
                        <p><i className="fa-solid fa-user"></i> <strong>Analista:</strong> {event.analistaOutros || (analistas.find(a => a.id === event.analistaId)?.nome || 'Desconhecido')}</p>
                        <p><i className="fa-solid fa-clock"></i> <strong>Hora:</strong> {event.horaInicio}</p>
                        {isUserAdmin && (
                            <div className="event-actions">
                                <button className="edit-evento-btn" onClick={() => onEdit(event)} title="Editar"><i className="fa-solid fa-pen-to-square"></i></button>
                                <button className="delete-evento-btn" onClick={() => onDelete(event.id)} title="Excluir"><i className="fa-solid fa-trash-can"></i></button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="modal-buttons">
                <button type="button" className="btn secondary" onClick={onClose}>Fechar</button>
            </div>
        </>
    );
};

export default EventDetailsModal;