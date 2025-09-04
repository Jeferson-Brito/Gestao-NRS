import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const EditEscalaModal = ({ data, analistas, onSave, onCancel, folgasManuais }) => {
    const { analistaId, dia, mes, ano } = data;
    const analista = analistas.find(a => a.id === analistaId);

    const key = `${analistaId}-${ano}-${mes}-${dia}`;
    const edicaoManual = folgasManuais[key];
    
    const [tipoDia, setTipoDia] = useState('');
    const [motivo, setMotivo] = useState('');

    useEffect(() => {
        if (data) {
            const edicaoManual = folgasManuais[`${data.analistaId}-${data.ano}-${data.mes}-${data.dia}`];
            if (edicaoManual) {
                setTipoDia(edicaoManual.tipo);
                setMotivo(edicaoManual.motivo || '');
            } else {
                const analista = analistas.find(a => a.id === data.analistaId);
                if (analista) {
                    const diasDesdeFolgaInicial = data.dia - analista.folgaInicial;
                    const ciclo = (diasDesdeFolgaInicial % 8 + 8) % 8;
                    if (ciclo === 0 || ciclo === 1) {
                        setTipoDia('folga');
                        setMotivo('Folga 6x2');
                    } else {
                        setTipoDia('trabalho');
                        setMotivo('');
                    }
                }
            }
        }
    }, [data, analistas, folgasManuais]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            analistaId,
            dia,
            mes,
            ano,
            tipo: tipoDia,
            motivo: tipoDia === 'trabalho' ? '' : motivo
        });
        onCancel();
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 id="modal-title-editar-escala">Editar Dia</h2>
            <input type="hidden" value={analistaId} />
            <input type="hidden" value={dia} />
            <input type="hidden" value={mes} />
            <input type="hidden" value={ano} />
            
            <div className="form-group">
                <label htmlFor="edit-nome-analista">Analista:</label>
                <input type="text" id="edit-nome-analista" disabled value={analista?.nome || ''} />
            </div>
            
            <div className="form-group">
                <label htmlFor="edit-data">Data:</label>
                <input type="text" id="edit-data" disabled value={new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR')} />
            </div>
            
            <div className="form-group">
                <label htmlFor="edit-tipo-dia">Tipo de Dia:</label>
                <select id="edit-tipo-dia" value={tipoDia} onChange={e => setTipoDia(e.target.value)}>
                    <option value="trabalho">Trabalho</option>
                    <option value="folga">Folga</option>
                    <option value="ferias">Férias</option>
                    <option value="atestado">Atestado</option>
                </select>
            </div>

            {(tipoDia === 'folga' || tipoDia === 'ferias' || tipoDia === 'atestado') && (
                <div className="form-group">
                    <label htmlFor="edit-motivo-folga">Motivo:</label>
                    <input type="text" id="edit-motivo-folga" placeholder="Opcional" value={motivo} onChange={e => setMotivo(e.target.value)} />
                </div>
            )}

            <div className="modal-buttons">
                <button type="button" className="btn secondary" onClick={onCancel}>Cancelar</button>
                <button type="submit" className="btn primary">Salvar Alterações</button>
            </div>
        </form>
    );
};

export default EditEscalaModal;