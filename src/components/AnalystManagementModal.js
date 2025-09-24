import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const AnalystManagementModal = ({ isOpen, onClose, analysts, onSave, onDelete, onReorder }) => {
  const [editingAnalyst, setEditingAnalyst] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        shift: 'Madrugada',
        breakTime: '01:00 - 02:00',
        startDay: 1
    });
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const shifts = [
        { id: 'Madrugada', name: 'Madrugada', color: '#6a1b4d', time: '22:00 - 06:00' },
        { id: 'Matinal', name: 'Matinal', color: '#8b4513', time: '05:40 - 14:00' },
        { id: 'Manhã', name: 'Manhã', color: '#c49a30', time: '07:00 - 15:20' },
        { id: 'Tarde', name: 'Tarde', color: '#1f4e79', time: '13:40 - 22:00' }
    ];

    const breakTimes = [
        '01:00 - 02:00',
        '02:00 - 03:00',
        '09:30 - 10:30',
        '10:30 - 11:30',
        '15:00 - 16:00',
        '16:00 - 17:00'
    ];

    useEffect(() => {
        if (editingAnalyst) {
            setFormData({
                name: editingAnalyst.name || '',
                shift: editingAnalyst.shift || 'Madrugada',
                breakTime: editingAnalyst.breakTime || '01:00 - 02:00',
                startDay: editingAnalyst.startDay || 1
            });
        } else {
            setFormData({
                name: '',
                shift: 'Madrugada',
                breakTime: '01:00 - 02:00',
                startDay: 1
            });
        }
    }, [editingAnalyst]);

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            showToastMessage('Nome do analista é obrigatório');
            return;
        }

        try {
            const analystData = {
                id: editingAnalyst?.id || Date.now().toString(),
                name: formData.name.trim(),
                shift: formData.shift,
                breakTime: formData.breakTime,
                startDay: parseInt(formData.startDay)
            };

            console.log('📤 Processando analista:', analystData);

            // Tentar Firebase primeiro, usar localStorage como fallback
            try {
                const API_URL = 'https://gestao-nrs-backend.vercel.app/api';

                if (editingAnalyst?.id) {
                    // Atualizar analista existente
                    const response = await fetch(`${API_URL}/analysts/${editingAnalyst.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(analystData)
                    });
                    
                    if (!response.ok) throw new Error('Firebase indisponível');
                    
                    const updatedAnalyst = await response.json();
                    console.log('✅ Analista atualizado no Firebase:', updatedAnalyst);
                    onSave(updatedAnalyst);
                    showToastMessage('Analista atualizado com sucesso!');
                } else {
                    // Criar novo analista
                    const response = await fetch(`${API_URL}/analysts`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(analystData)
                    });
                    
                    if (!response.ok) throw new Error('Firebase indisponível');
                    
                    const newAnalyst = await response.json();
                    console.log('✅ Analista criado no Firebase:', newAnalyst);
                    onSave(newAnalyst);
                    showToastMessage('Analista criado com sucesso!');
                }
                
            } catch (firebaseError) {
                // Firebase falhou, usar localStorage
                console.warn('⚠️ Firebase indisponível, usando localStorage:', firebaseError.message);
                
                // Salvar no localStorage
                const analysts = JSON.parse(localStorage.getItem('nexus_analysts') || '[]');
                
                if (editingAnalyst?.id) {
                    // Atualizar existente
                    const index = analysts.findIndex(a => a.id === editingAnalyst.id);
                    if (index >= 0) {
                        analysts[index] = analystData;
                    }
                } else {
                    // Adicionar novo
                    analysts.push(analystData);
                }
                
                localStorage.setItem('nexus_analysts', JSON.stringify(analysts));
                onSave(analystData);
                showToastMessage('Analista salvo localmente (Firebase temporariamente indisponível)');
            }
            
            setEditingAnalyst(null);
            
        } catch (error) {
            console.error('Erro ao salvar analista:', error);
            showToastMessage('Erro ao salvar analista. Tente novamente.');
        }
    };

    const handleDelete = async (analyst) => {
        if (window.confirm(`Tem certeza que deseja excluir o analista ${analyst.name}?`)) {
            try {
                // Tentar Firebase primeiro, usar localStorage como fallback
                try {
                    const API_URL = 'https://gestao-nrs-backend.vercel.app/api';

                    const response = await fetch(`${API_URL}/analysts/${analyst.id}`, {
                        method: 'DELETE'
                    });
                    
                    if (!response.ok) throw new Error('Firebase indisponível');
                    
                    console.log('✅ Analista excluído do Firebase:', analyst.id);
                    onDelete(analyst.id);
                    showToastMessage('Analista excluído com sucesso!');
                    
                } catch (firebaseError) {
                    // Firebase falhou, usar localStorage
                    console.warn('⚠️ Firebase indisponível, usando localStorage:', firebaseError.message);
                    
                    // Remover do localStorage
                    const analysts = JSON.parse(localStorage.getItem('nexus_analysts') || '[]');
                    const filteredAnalysts = analysts.filter(a => a.id !== analyst.id);
                    localStorage.setItem('nexus_analysts', JSON.stringify(filteredAnalysts));
                    
                    onDelete(analyst.id);
                    showToastMessage('Analista excluído localmente (Firebase temporariamente indisponível)');
                }
                
            } catch (error) {
                console.error('Erro ao excluir analista:', error);
                showToastMessage('Erro ao excluir analista. Tente novamente.');
            }
        }
    };

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== dropIndex) {
            onReorder(draggedIndex, dropIndex);
            showToastMessage('Ordem dos analistas atualizada!');
        }
        setDraggedIndex(null);
    };

    const filteredAnalysts = analysts.filter(analyst => 
        analyst.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedAnalysts = shifts.reduce((acc, shift) => {
        acc[shift.id] = filteredAnalysts.filter(analyst => analyst.shift === shift.id);
        return acc;
    }, {});

  return (
    <>
            <Modal show={isOpen} onClose={onClose}>
                <h2>Gerenciar Analistas</h2>
                <div className="analyst-management">
                    <div className="management-header">
                        <div className="search-container">
                            <i className="fa-solid fa-search search-icon"></i>
                            <input
                                type="text"
                                placeholder="Buscar analista..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <button 
                            className="btn primary"
                            onClick={() => setEditingAnalyst({})}
                        >
                            <i className="fa-solid fa-plus"></i> Novo Analista
                        </button>
                    </div>

                    <div className="shifts-container">
                        {shifts.map(shift => (
                            <div key={shift.id} className="shift-group">
                                <div 
                                    className="shift-header"
                                    style={{ backgroundColor: shift.color }}
                                >
                                    <h3>{shift.name}</h3>
                                    <span className="shift-time">{shift.time}</span>
                                </div>
                                
                                <div 
                                    className="analysts-list"
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, 0)}
                                >
                                    {groupedAnalysts[shift.id]?.map((analyst, index) => (
                                        <div
                                            key={analyst.id}
                                            className="analyst-item"
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, analysts.indexOf(analyst))}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, analysts.indexOf(analyst))}
                                        >
                                            <div className="analyst-info">
                                                <span className="analyst-name">{analyst.name}</span>
                                                <span className="analyst-break">Pausa: {analyst.breakTime}</span>
                                                <span className="analyst-start">Início: Dia {analyst.startDay}</span>
                                            </div>
                                            <div className="analyst-actions">
                                                <button 
                                                    className="btn-edit"
                                                    onClick={() => setEditingAnalyst(analyst)}
                                                    title="Editar"
                                                >
                                                    <i className="fa-solid fa-edit"></i>
                                                </button>
                                                <button 
                                                    className="btn-delete"
                                                    onClick={() => handleDelete(analyst)}
                                                    title="Excluir"
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {(!groupedAnalysts[shift.id] || groupedAnalysts[shift.id].length === 0) && (
                                        <div className="empty-shift">
                                            <i className="fa-solid fa-users"></i>
                                            <span>Nenhum analista neste turno</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
        </div>
        </div>
      </Modal>

            {/* Modal de Edição */}
            <Modal 
                show={!!editingAnalyst} 
                onClose={() => setEditingAnalyst(null)}
            >
                <h2>{editingAnalyst?.id ? 'Editar Analista' : 'Novo Analista'}</h2>
                <form onSubmit={handleSubmit} className="analyst-form">
                    <div className="form-group">
                        <label htmlFor="name">Nome do Analista *</label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Digite o nome do analista"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="shift">Turno</label>
                        <select
                            id="shift"
                            value={formData.shift}
                            onChange={(e) => setFormData({...formData, shift: e.target.value})}
                        >
                            {shifts.map(shift => (
                                <option key={shift.id} value={shift.id}>
                                    {shift.name} ({shift.time})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="breakTime">Horário de Pausa</label>
                        <select
                            id="breakTime"
                            value={formData.breakTime}
                            onChange={(e) => setFormData({...formData, breakTime: e.target.value})}
                        >
                            {breakTimes.map(time => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="startDay">Dia Inicial da Folga (6x2)</label>
                        <input
                            type="number"
                            id="startDay"
                            value={formData.startDay}
                            onChange={(e) => setFormData({...formData, startDay: parseInt(e.target.value)})}
                            min="1"
                            max="7"
                            placeholder="Dia da semana (1-7)"
                        />
                        <small>Dia 1 = Segunda-feira, Dia 7 = Domingo</small>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn secondary" onClick={() => setEditingAnalyst(null)}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn primary">
                            {editingAnalyst?.id ? 'Atualizar' : 'Adicionar'}
                        </button>
                    </div>
                </form>
      </Modal>

            {/* Toast */}
            {showToast && (
                <div className="toast success">
                    <i className="fa-solid fa-check-circle"></i>
                    {toastMessage}
                </div>
            )}
    </>
  );
};

export default AnalystManagementModal;