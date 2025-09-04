import React from 'react';

const AllEventsModal = ({ events, analistas, onEdit, onDelete, onClose, user }) => {
    const sortedEvents = [...events].sort((a, b) => {
        const dateA = new Date(a.data);
        const dateB = new Date(b.data);
        return dateA - dateB;
    });
    
    const isUserAdmin = user && user.role === 'admin';

    return (
        <>
            <h2>Todos os Eventos</h2>
            <div className="events-list-container">
                <table id="todos-eventos-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Hora</th>
                            <th>Título</th>
                            <th>Analista</th>
                            {isUserAdmin && <th>Ações</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedEvents.map(event => (
                            <tr key={event.id}>
                                <td>{new Date(event.data).toLocaleDateString('pt-BR')}</td>
                                <td>{event.horaInicio}</td>
                                <td>{event.titulo}</td>
                                <td>{event.analistaOutros || (analistas.find(a => a.id === event.analistaId)?.nome || 'Desconhecido')}</td>
                                {isUserAdmin && (
                                    <td>
                                        <button className="edit-evento-btn" onClick={() => onEdit(event)}><i className="fa-solid fa-pen-to-square"></i></button>
                                        <button className="delete-evento-btn" onClick={() => onDelete(event.id)}><i className="fa-solid fa-trash-can"></i></button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="modal-buttons">
                <button type="button" className="btn secondary" onClick={onClose}>Fechar</button>
            </div>
        </>
    );
};

export default AllEventsModal;