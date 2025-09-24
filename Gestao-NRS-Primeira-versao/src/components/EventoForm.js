import React, { useState, useEffect } from 'react';

const EventoForm = ({ evento, analistas, onSave, onCancel }) => {
    const [titulo, setTitulo] = useState('');
    const [analistaId, setAnalistaId] = useState('');
    const [analistaOutros, setAnalistaOutros] = useState('');
    const [data, setData] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [isOutrosSelected, setIsOutrosSelected] = useState(false);
    
    useEffect(() => {
        if (evento) {
            setTitulo(evento.titulo);
            setAnalistaId(evento.analistaId);
            setAnalistaOutros(evento.analistaOutros || '');
            setData(evento.data);
            setHoraInicio(evento.horaInicio);
            setIsOutrosSelected(evento.analistaId === 'Outros');
        } else {
            setTitulo('');
            setAnalistaId('');
            setAnalistaOutros('');
            setData('');
            setHoraInicio('');
            setIsOutrosSelected(false);
        }
    }, [evento]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            id: evento?.id,
            titulo,
            analistaId: isOutrosSelected ? 'Outros' : analistaId,
            analistaOutros: isOutrosSelected ? analistaOutros : null,
            data,
            horaInicio
        });
    };
    
    const handleAnalistaChange = (e) => {
        const selectedId = e.target.value;
        setAnalistaId(selectedId);
        setIsOutrosSelected(selectedId === 'Outros');
    };

    return (
        <>
            <h2 id="modal-title-evento">{evento ? 'Editar Evento' : 'Novo Evento'}</h2>
            <form id="evento-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="evento-titulo">Título do Evento:</label>
                    <input type="text" id="evento-titulo" required value={titulo} onChange={e => setTitulo(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="evento-analista">Analista:</label>
                    <select id="evento-analista" required value={analistaId} onChange={handleAnalistaChange}>
                        <option value="">Selecione um analista</option>
                        {analistas.map(analista => (
                            <option key={analista.id} value={analista.id}>{analista.nome}</option>
                        ))}
                        <option value="Outros">Outros</option>
                    </select>
                    {isOutrosSelected && (
                        <input type="text" id="evento-outro-analista" placeholder="Nome do Analista" value={analistaOutros} onChange={e => setAnalistaOutros(e.target.value)} required />
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="evento-data">Data:</label>
                    <input type="date" id="evento-data" required value={data} onChange={e => setData(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="evento-hora-inicio">Hora:</label>
                    <input type="time" id="evento-hora-inicio" required value={horaInicio} onChange={e => setHoraInicio(e.target.value)} />
                </div>
                <div className="modal-buttons">
                    <button type="button" id="btnCancelarEvento" className="btn secondary" onClick={onCancel}>Cancelar</button>
                    <button type="submit" id="btnSalvarEvento" className="btn primary">Salvar Evento</button>
                </div>
            </form>
        </>
    );
};

export default EventoForm;