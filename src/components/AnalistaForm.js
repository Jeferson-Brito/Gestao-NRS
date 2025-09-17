import React, { useState, useEffect } from 'react';

const AnalistaForm = ({ analista, turnos, onSave, onCancel }) => {
  const [nome, setNome] = useState('');
  const [turno, setTurno] = useState('');
  const [pausa, setPausa] = useState('');
  const [folgaInicial, setFolgaInicial] = useState('');
  const [analistaId, setAnalistaId] = useState(null);

  useEffect(() => {
    if (analista) {
      setNome(analista.nome);
      setTurno(analista.turno);
      setPausa(analista.pausa);
      setFolgaInicial(analista.folgaInicial);
      setAnalistaId(analista.id);
    } else {
      setNome('');
      setTurno('');
      setPausa('');
      setFolgaInicial('');
      setAnalistaId(null);
    }
  }, [analista]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: analistaId,
      nome,
      turno,
      pausa,
      folgaInicial: parseInt(folgaInicial, 10),
    });
  };

  const turnosOrdenados = Object.keys(turnos).sort((a, b) => turnos[a].ordem - turnos[b].ordem);

  return (
    <>
      <h2 id="modal-title-analista">{analista ? 'Editar Analista' : 'Adicionar Analista'}</h2>
      <form id="analista-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome:</label>
          <input type="text" id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="turno-analista">Turno:</label>
          <select id="turno-analista" required value={turno} onChange={(e) => setTurno(e.target.value)}>
            <option value="">Selecione um turno</option>
            {turnosOrdenados.map((nomeTurno) => (
              <option key={nomeTurno} value={nomeTurno}>{nomeTurno}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="pausa">Horário de Pausa:</label>
          <input type="text" id="pausa" placeholder="Ex: 01:00 - 02:00" required value={pausa} onChange={(e) => setPausa(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="folga-inicial">Dia da Primeira Folga do Mês:</label>
          <input type="number" id="folga-inicial" min="1" max="31" required value={folgaInicial} onChange={(e) => setFolgaInicial(e.target.value)} />
        </div>
        <div className="modal-buttons">
          <button type="button" id="btnCancelarAnalista" className="btn secondary" onClick={onCancel}>Cancelar</button>
          <button type="submit" id="btnSalvarAnalista" className="btn primary">Salvar</button>
        </div>
      </form>
    </>
  );
};

export default AnalistaForm;