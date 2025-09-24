import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const ShiftManagementModal = ({ isOpen, onClose, shifts, onSave, onDelete, onReorder }) => {
    const [editingShift, setEditingShift] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        time: '',
        color: '#3498db'
    });
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const predefinedColors = [
        '#6a1b4d', '#8b4513', '#c49a30', '#1f4e79',
        '#3498db', '#e74c3c', '#2ecc71', '#f39c12',
        '#9b59b6', '#1abc9c', '#34495e', '#e67e22'
    ];

    useEffect(() => {
        if (editingShift) {
            setFormData({
                name: editingShift.name || '',
                time: editingShift.time || '',
                color: editingShift.color || '#3498db'
            });
        } else {
            setFormData({
                name: '',
                time: '',
                color: '#3498db'
            });
        }
    }, [editingShift]);

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.time.trim()) {
            showToastMessage('Nome e horário são obrigatórios');
            return;
        }

        try {
            const API_URL = 'https://gestao-nrs-backend.vercel.app/api';

            const shiftData = {
                name: formData.name.trim(),
                time: formData.time.trim(),
                color: formData.color,
                order: parseInt(formData.order) || 0
            };

            if (editingShift?.id) {
                // Atualizar turno existente
                const response = await fetch(`${API_URL}/shifts/${editingShift.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(shiftData)
                });
                
                if (!response.ok) throw new Error('Erro ao atualizar turno');
                
                const updatedShift = await response.json();
                onSave(updatedShift);
                showToastMessage('Turno atualizado com sucesso!');
            } else {
                // Criar novo turno
                const response = await fetch(`${API_URL}/shifts`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(shiftData)
                });
                
                if (!response.ok) throw new Error('Erro ao criar turno');
                
                const newShift = await response.json();
                onSave(newShift);
                showToastMessage('Turno criado com sucesso!');
            }
            
            setEditingShift(null);
            
        } catch (error) {
            console.error('Erro ao salvar turno:', error);
            showToastMessage('Erro ao salvar turno. Tente novamente.');
        }
    };

    const handleDelete = async (shift) => {
        if (window.confirm(`Tem certeza que deseja excluir o turno ${shift.name}?`)) {
            try {
                const API_URL = 'https://gestao-nrs-backend.vercel.app/api';

                const response = await fetch(`${API_URL}/shifts/${shift.id}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) throw new Error('Erro ao excluir turno');
                
                onDelete(shift.id);
                showToastMessage('Turno excluído com sucesso!');
                
            } catch (error) {
                console.error('Erro ao excluir turno:', error);
                showToastMessage('Erro ao excluir turno. Tente novamente.');
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
            showToastMessage('Ordem dos turnos atualizada!');
        }
        setDraggedIndex(null);
    };

    return (
        <>
            <Modal show={isOpen} onClose={onClose}>
                <h2>Gerenciar Turnos</h2>
                <div className="shift-management">
                    <div className="management-header">
                        <button 
                            className="btn primary"
                            onClick={() => setEditingShift({})}
                        >
                            <i className="fa-solid fa-plus"></i> Novo Turno
                        </button>
                    </div>

                    <div className="shifts-list">
                        {shifts.map((shift, index) => (
                            <div
                                key={shift.id}
                                className="shift-item"
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                            >
                                <div className="shift-preview">
                                    <div 
                                        className="shift-color"
                                        style={{ backgroundColor: shift.color }}
                                    ></div>
                                    <div className="shift-info">
                                        <h4>{shift.name}</h4>
                                        <span className="shift-time">{shift.time}</span>
                                    </div>
                                </div>
                                
                                <div className="shift-actions">
                                    <button 
                                        className="btn-edit"
                                        onClick={() => setEditingShift(shift)}
                                        title="Editar"
                                    >
                                        <i className="fa-solid fa-edit"></i>
                                    </button>
                                    <button 
                                        className="btn-delete"
                                        onClick={() => handleDelete(shift)}
                                        title="Excluir"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        {shifts.length === 0 && (
                            <div className="empty-shifts">
                                <i className="fa-solid fa-clock"></i>
                                <span>Nenhum turno cadastrado</span>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>

            {/* Modal de Edição */}
            <Modal 
                show={!!editingShift} 
                onClose={() => setEditingShift(null)}
            >
                <h2>{editingShift?.id ? 'Editar Turno' : 'Novo Turno'}</h2>
                <form onSubmit={handleSubmit} className="shift-form">
                    <div className="form-group">
                        <label htmlFor="name">Nome do Turno *</label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Ex: Madrugada, Matinal, Manhã, Tarde"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="time">Horário *</label>
                        <input
                            type="text"
                            id="time"
                            value={formData.time}
                            onChange={(e) => setFormData({...formData, time: e.target.value})}
                            placeholder="Ex: 22:00 - 06:00"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="color">Cor do Turno</label>
                        <div className="color-picker">
                            <input
                                type="color"
                                id="color"
                                value={formData.color}
                                onChange={(e) => setFormData({...formData, color: e.target.value})}
                            />
                            <div className="predefined-colors">
                                {predefinedColors.map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={`color-option ${formData.color === color ? 'selected' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setFormData({...formData, color})}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Preview</label>
                        <div className="shift-preview">
                            <div 
                                className="shift-color"
                                style={{ backgroundColor: formData.color }}
                            ></div>
                            <div className="shift-info">
                                <h4>{formData.name || 'Nome do Turno'}</h4>
                                <span className="shift-time">{formData.time || '00:00 - 00:00'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn secondary" onClick={() => setEditingShift(null)}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn primary">
                            {editingShift?.id ? 'Atualizar' : 'Adicionar'}
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

export default ShiftManagementModal;
