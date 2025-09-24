// src/components/EscalaTable.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from './Modal';
import EditEscalaModal from './EditEscalaModal';
import AnalystManagementModal from './AnalystManagementModal';
import ShiftManagementModal from './ShiftManagementModal';

const API_URL = 'http://localhost:3001/api';

const EscalaTable = ({ analistas, turnos, folgasManuais, onManageAnalysts, onTurnoManage, onSaveFolgaManual, user, showToastMessage }) => {
    // Dados temporários para demonstração (serão substituídos pelos dados do Firebase)
    const dadosTemporarios = {
        analistas: [
            { id: 1, nome: "Mahori Silva", turno: "Madrugada", pausa: "01:00 - 02:00", folgaInicial: 7, ativo: true },
            { id: 2, nome: "Gean Nogueira", turno: "Madrugada", pausa: "02:00 - 03:00", folgaInicial: 3, ativo: true },
            { id: 3, nome: "José Matheus", turno: "Matinal", pausa: "09:30 - 10:30", folgaInicial: 2, ativo: true },
            { id: 4, nome: "João Carlos", turno: "Matinal", pausa: "09:00 - 10:00", folgaInicial: 6, ativo: true },
            { id: 5, nome: "Leanderson Mascena", turno: "Manhã", pausa: "13:00 - 14:00", folgaInicial: 7, ativo: true },
            { id: 6, nome: "Rafael Macêdo", turno: "Manhã", pausa: "11:30 - 12:30", folgaInicial: 6, ativo: true },
            { id: 7, nome: "Alesandro Silva", turno: "Tarde", pausa: "19:30 - 20:30", folgaInicial: 6, ativo: true },
            { id: 8, nome: "Paulo Vinícius", turno: "Tarde", pausa: "16:30 - 17:30", folgaInicial: 7, ativo: true },
            { id: 9, nome: "Jailso Maxwell", turno: "Tarde", pausa: "15:30 - 16:30", folgaInicial: 4, ativo: true },
            { id: 10, nome: "Rafael Sousa", turno: "Tarde", pausa: "15:00 - 16:00", folgaInicial: 3, ativo: true }
        ],
        turnos: {
            "Madrugada": { nome: "Madrugada", horario: "22:00 - 06:00", cor: "#6a1b4d", ordem: 1 },
            "Matinal": { nome: "Matinal", horario: "05:40 - 14:00", cor: "#8b4513", ordem: 2 },
            "Manhã": { nome: "Manhã", horario: "07:00 - 15:20", cor: "#c49a30", ordem: 3 },
            "Tarde": { nome: "Tarde", horario: "13:40 - 22:00", cor: "#1f4e79", ordem: 4 }
        },
        folgasManuais: []
    };

    // Usar dados do Firebase se disponíveis, senão usar dados temporários
    const analistasAtivos = (analistas && analistas.length > 0) ? analistas : dadosTemporarios.analistas;
    const turnosAtivos = (turnos && Object.keys(turnos).length > 0) ? turnos : dadosTemporarios.turnos;
    const folgasManuaisAtivas = folgasManuais || dadosTemporarios.folgasManuais;

    const [mes, setMes] = useState('');
    const [tabelas, setTabelas] = useState(null);
    const [showWelcome, setShowWelcome] = useState(true);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isEditEscalaModalOpen, setIsEditEscalaModalOpen] = useState(false);
    const [editingCellData, setEditingCellData] = useState(null);
    const [isAnalystModalOpen, setIsAnalystModalOpen] = useState(false);
    const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
    
    console.log('Estado dos modais:', { isAnalystModalOpen, isShiftModalOpen });
    const [analysts, setAnalysts] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Carregar dados do Firebase ou localStorage na inicialização
    useEffect(() => {
        const loadData = async () => {
            try {
                // Tentar carregar do Firebase primeiro
                const API_URL = 'https://gestao-nrs-backend.vercel.app/api';
                const response = await fetch(`${API_URL}/sync`);
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Atualizar analistas do Firebase
                    if (data.analysts && data.analysts.length > 0) {
                        setAnalysts(data.analysts);
                        localStorage.setItem('nexus_analysts', JSON.stringify(data.analysts));
                    }

                    // Atualizar turnos do Firebase
                    if (data.shifts && data.shifts.length > 0) {
                        setShifts(data.shifts);
                        localStorage.setItem('nexus_shifts', JSON.stringify(data.shifts));
                    }
                    
                    console.log('✅ Dados carregados do Firebase:', { 
                        analysts: data.analysts?.length || 0, 
                        shifts: data.shifts?.length || 0 
                    });
                } else {
                    throw new Error('Firebase indisponível');
                }
            } catch (error) {
                // Firebase falhou, usar localStorage
                console.warn('⚠️ Firebase indisponível, carregando do localStorage:', error.message);
                
                // Carregar analistas do localStorage
                const localAnalysts = JSON.parse(localStorage.getItem('nexus_analysts') || '[]');
                if (localAnalysts.length > 0) {
                    setAnalysts(localAnalysts);
                } else if (analistasAtivos && analistasAtivos.length > 0) {
                    // Fallback para dados iniciais
                    const initialAnalysts = analistasAtivos.map(analyst => ({
                        id: analyst.id?.toString() || Date.now().toString(),
                        name: analyst.nome || analyst.name,
                        shift: analyst.turno || analyst.shift || 'Madrugada',
                        breakTime: analyst.pausa || analyst.breakTime || '01:00 - 02:00',
                        startDay: analyst.folgaInicial || analyst.startDay || 1
                    }));
                    setAnalysts(initialAnalysts);
                    localStorage.setItem('nexus_analysts', JSON.stringify(initialAnalysts));
                }

                // Carregar turnos do localStorage
                const localShifts = JSON.parse(localStorage.getItem('nexus_shifts') || '[]');
                if (localShifts.length > 0) {
                    setShifts(localShifts);
                } else {
                    // Turnos padrão
                    const defaultShifts = [
                        { id: '1', name: 'Madrugada', time: '22:00 - 06:00', color: '#6a1b4d', order: 1 },
                        { id: '2', name: 'Matinal', time: '05:40 - 14:00', color: '#8b4513', order: 2 },
                        { id: '3', name: 'Manhã', time: '07:00 - 15:20', color: '#c49a30', order: 3 },
                        { id: '4', name: 'Tarde', time: '13:40 - 22:00', color: '#1f4e79', order: 4 }
                    ];
                    setShifts(defaultShifts);
                    localStorage.setItem('nexus_shifts', JSON.stringify(defaultShifts));
                }
                
                console.log('📱 Dados carregados do localStorage');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [analistasAtivos]);

    const isUserAdmin = user && user.role === 'admin';
    const tabelasRef = useRef(null);

    // Funções de gerenciamento de analistas
    const handleSaveAnalyst = (analystData) => {
        // Atualizar estado local
        if (analystData.id && analysts.find(a => a.id === analystData.id)) {
            setAnalysts(prev => prev.map(a => a.id === analystData.id ? analystData : a));
        } else {
            setAnalysts(prev => [...prev, analystData]);
        }
        
        // Salvar no localStorage para persistência
        const updatedAnalysts = analystData.id && analysts.find(a => a.id === analystData.id)
            ? analysts.map(a => a.id === analystData.id ? analystData : a)
            : [...analysts, analystData];
        localStorage.setItem('nexus_analysts', JSON.stringify(updatedAnalysts));
        
        console.log('💾 Analista salvo localmente:', analystData);
    };

    const handleDeleteAnalyst = (analystId) => {
        // Atualizar estado local
        const updatedAnalysts = analysts.filter(a => a.id !== analystId);
        setAnalysts(updatedAnalysts);
        
        // Salvar no localStorage para persistência
        localStorage.setItem('nexus_analysts', JSON.stringify(updatedAnalysts));
        
        console.log('🗑️ Analista removido localmente:', analystId);
    };

    const handleReorderAnalysts = (fromIndex, toIndex) => {
        setAnalysts(prev => {
            const newAnalysts = [...prev];
            const [movedAnalyst] = newAnalysts.splice(fromIndex, 1);
            newAnalysts.splice(toIndex, 0, movedAnalyst);
            return newAnalysts;
        });
    };

    // Funções de gerenciamento de turnos
    const handleSaveShift = async (shiftData) => {
        // Atualizar localmente primeiro para feedback imediato
        if (shiftData.id && shifts.find(s => s.id === shiftData.id)) {
            setShifts(prev => prev.map(s => s.id === shiftData.id ? shiftData : s));
        } else {
            setShifts(prev => [...prev, shiftData]);
        }
        
        // Recarregar dados do Firebase para sincronizar
        setTimeout(reloadFirebaseData, 1000);
    };

    const handleDeleteShift = async (shiftId) => {
        // Atualizar localmente primeiro para feedback imediato
        setShifts(prev => prev.filter(s => s.id !== shiftId));
        
        // Recarregar dados do Firebase para sincronizar
        setTimeout(reloadFirebaseData, 1000);
    };

    const handleReorderShifts = (fromIndex, toIndex) => {
        setShifts(prev => {
            const newShifts = [...prev];
            const [movedShift] = newShifts.splice(fromIndex, 1);
            newShifts.splice(toIndex, 0, movedShift);
            return newShifts;
        });
    };

    const createTableBlock = useCallback((ano, mes, diaInicio, diasNoBloco, totalDays, semana) => {
        const headers = ["Turno", "Analista", ...Array.from({ length: 10 }, (_, i) => {
            const dia = diaInicio + i;
            if (dia > totalDays) return "";
            const date = new Date(ano, mes, dia);
            const nomeDia = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][date.getDay()];
            return `${nomeDia} (${String(dia).padStart(2, "0")})`;
        }), "PAUSA"];

        const turnosOrdenados = shifts.sort((a, b) => a.name.localeCompare(b.name));

        const tableRows = [];
        turnosOrdenados.forEach((turno, index) => {
            const analistasDoTurno = analysts.filter(a => a.shift === turno.name);
            const analistasNoTurno = analistasDoTurno.length;

            if (analistasNoTurno > 0) {
                analistasDoTurno.forEach((analista, idx) => {
                    const row = (
                        <tr key={analista.id} data-analista-id={analista.id}>
                            {idx === 0 && (
                                <td className="turno" rowSpan={analistasNoTurno} style={{ 
                                    backgroundColor: turno.color || 'var(--btn-primary-bg)',
                                    color: 'white',
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                    padding: '8px 4px'
                                }}>
                                    <div style={{ 
                                        fontWeight: 'bold', 
                                        marginBottom: '4px',
                                        fontSize: '12px',
                                        lineHeight: '1.2'
                                    }}>
                                        {turno.name}
                                    </div>
                                    <div style={{ 
                                        fontSize: '10px', 
                                        opacity: 1,
                                        lineHeight: '1.1',
                                        fontWeight: 'bold',
                                        color: 'white',
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        padding: '2px 4px',
                                        borderRadius: '3px',
                                        marginTop: '2px'
                                    }}>
                                        {turno.time || ''}
                                    </div>
                                </td>
                            )}
                            <td className="analista" style={{ backgroundColor: turno.color || 'var(--btn-primary-bg)' }}>
                                {analista.name}
                            </td>
                            {Array.from({ length: 10 }, (_, i) => {
                                const dia = diaInicio + i;
                                if (dia > totalDays) {
                                    return <td key={i}></td>;
                                }

                                const key = `${analista.id}-${ano}-${mes + 1}-${dia}`;
                                const edicaoManual = folgasManuaisAtivas[key];
                                let cellClass = 'trabalho';
                                let cellText = turno.time || "";
                                let cellStyle = {};

                                if (edicaoManual) {
                                    cellClass = edicaoManual.tipo;
                                    switch (edicaoManual.tipo) {
                                        case 'folga': cellText = `FOLGA${edicaoManual.motivo ? ` (${edicaoManual.motivo})` : ''}`; break;
                                        case 'ferias': cellText = `FÉRIAS${edicaoManual.motivo ? ` (${edicaoManual.motivo})` : ''}`; break;
                                        case 'atestado': cellText = `ATESTADO${edicaoManual.motivo ? ` (${edicaoManual.motivo})` : ''}`; break;
                                        default: break;
                                    }
                                } else {
                                    // Sistema 6x2: 6 dias trabalhando, 2 de folga
                                    // Se a folga inicial é no dia 1, as folgas serão nos dias 1,2,8,9,16,17,24,25...
                                    const diaSemana = new Date(ano, mes, dia).getDay();
                                    
                                    // Calcular a posição no ciclo de 8 dias (6 trabalho + 2 folga)
                                    const diasDesdeInicio = (dia - analista.startDay + 7) % 7;
                                    const cicloCompleto = Math.floor((dia - analista.startDay) / 7);
                                    const posicaoNoCiclo = (dia - analista.startDay) % 8;
                                    
                                    // Se a posição no ciclo é 0 ou 1 (primeiros 2 dias do ciclo de 8), é folga
                                    if (posicaoNoCiclo === 0 || posicaoNoCiclo === 1) {
                                        cellClass = 'folga';
                                        cellText = 'FOLGA';
                                    } else {
                                        cellText = turno.time || '';
                                    }
                                }

                                return (
                                    <td
                                        key={i}
                                        className={cellClass}
                                        style={cellStyle}
                                        onClick={() => {
                                            if (isUserAdmin) {
                                                setEditingCellData({ analistaId: analista.id, dia, mes: mes + 1, ano });
                                                setIsEditEscalaModalOpen(true);
                                            }
                                        }}
                                    >
                                        {cellText}
                                    </td>
                                );
                            })}
                            <td className="pausa">{analista.breakTime}</td>
                        </tr>
                    );
                    tableRows.push(row);
                });
                if (index < turnosOrdenados.length - 1) {
                    tableRows.push(<tr key={`separator-${turno.name}`} className="separator-row"><td colSpan={headers.length}></td></tr>);
                }
            } else {
                 tableRows.push(
                    <tr key={turno.name}>
                        <td className="turno" style={{ backgroundColor: turno.color || 'var(--btn-primary-bg)' }}>{turno.name}</td>
                        <td className="analista" style={{ backgroundColor: turno.color || 'var(--btn-primary-bg)' }}>(Nenhum analista)</td>
                        {Array(10).fill().map((_, i) => <td key={i}></td>)}
                        <td className="pausa"></td>
                    </tr>
                 );
                 if (index < turnosOrdenados.length - 1) {
                     tableRows.push(<tr key={`separator-${turno.name}`} className="separator-row"><td colSpan={headers.length}></td></tr>);
                 }
            }
        });

        return (
            <div className="table-wrap" key={`semana-${semana}`}>
                <h2 className="semana-title">Semana {semana}</h2>
                <table>
                    <thead>
                        <tr>
                            {headers.map((header, index) => <th key={index}>{header}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows}
                    </tbody>
                </table>
            </div>
        );
    }, [analistasAtivos, turnosAtivos, folgasManuaisAtivas, isUserAdmin]);

    const generateTables = useCallback(() => {
        if (!mes) return;
        setShowWelcome(false);
        const [anoStr, mesStr] = mes.split("-");
        const ano = parseInt(anoStr, 10);
        const month = parseInt(mesStr, 10) - 1;
        const totalDays = new Date(ano, month + 1, 0).getDate();

        const newTables = [];
        let dayAtual = 1;
        let semana = 1;
        while (dayAtual <= totalDays) {
            const daysInBlock = Math.min(10, totalDays - dayAtual + 1);
            newTables.push(createTableBlock(ano, month, dayAtual, daysInBlock, totalDays, semana));
            dayAtual += daysInBlock;
            semana++;
        }
        setTabelas(newTables);
    }, [mes, createTableBlock]);

    useEffect(() => {
        if (mes) {
            generateTables();
        } else {
            setTabelas(null);
            setShowWelcome(true);
        }
    }, [mes, generateTables]);

    const handleExport = (format) => {
        if (!tabelas) {
            alert("Gere a escala antes de exportar.");
            return;
        }

        const nomeArquivo = `escala-${mes || "mes"}.${format}`;
        const container = tabelasRef.current;

        if (format === 'xls') {
            const htmlContent = `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                    <head><meta charset="utf-8" /></head>
                    <body>${container.innerHTML.replace(/<div class="action-buttons".*?<\/div>/g, '')}</body>
                </html>
            `;
            const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = nomeArquivo;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToastMessage('Escala exportada para Excel!', 'fa-file-excel');
        } else if (format === 'pdf') {
             const pdf = new jsPDF('l', 'mm', 'a4');
             const pageHeight = pdf.internal.pageSize.getHeight();
             let y = 10;

             const elements = Array.from(container.children);

             const processElements = (index) => {
                 if (index >= elements.length) {
                     pdf.save(nomeArquivo);
                     showToastMessage('Escala exportada para PDF!', 'fa-file-pdf');
                     setIsExportModalOpen(false);
                     return Promise.resolve();
                 }
                 const el = elements[index];
                 return html2canvas(el, {
                     scale: 1.5,
                     useCORS: true,
                     logging: false,
                     ignoreElements: (element) => element.getAttribute('data-html2canvas-ignore') === 'true'
                 }).then(canvas => {
                     const imgData = canvas.toDataURL('image/jpeg', 1.0);
                     const imgHeight = canvas.height * 200 / canvas.width;

                     if (y + imgHeight > pageHeight) {
                         pdf.addPage();
                         y = 10;
                     }

                     pdf.addImage(imgData, 'JPEG', 5, y, 200, imgHeight);
                     y += imgHeight + 10;

                     return processElements(index + 1);
                 });
             };

             processElements(0).catch(err => {
                 console.error("Erro ao renderizar para PDF:", err);
                 showToastMessage('Erro ao exportar PDF. Tente novamente.', 'fa-exclamation-circle', true);
                 setIsExportModalOpen(false);
             });
        }
        setIsExportModalOpen(false);
    };

    return (
        <>
            <div className="page-header">
                <h1 className="page-title"><i className="fa-solid fa-calendar-alt"></i> Gerador de Escala</h1>
                <div className="page-controls">
                    <div className="input-group-mes">
                        <i className="fa-solid fa-calendar-day icon-mes"></i>
                        <input type="month" id="mes" value={mes} onChange={e => setMes(e.target.value)} />
                        <button className="btn primary btn-gerar" onClick={() => { generateTables(); showToastMessage('Escala gerada com sucesso!', 'fa-calendar-check'); }}>
                            <i className="fa-solid fa-calendar-plus"></i> Gerar
                        </button>
                    </div>
                </div>
                {isUserAdmin && (
                    <div className="page-actions">
                        <button id="btnGerenciarAnalistas" className="btn" onClick={() => {
                            console.log('Abrindo modal de analistas');
                            setIsAnalystModalOpen(true);
                        }}><i className="fa-solid fa-users-gear"></i> Gerenciar Analistas</button>
                        <button id="btnGerenciarTurnos" className="btn" onClick={() => {
                            console.log('Abrindo modal de turnos');
                            setIsShiftModalOpen(true);
                        }}><i className="fa-solid fa-clock"></i> Turnos</button>
                        <button id="btnExportar" className="btn" onClick={() => setIsExportModalOpen(true)}><i className="fa-solid fa-download"></i> Exportar</button>
                    </div>
                )}
            </div>
            {showWelcome && (
                <div id="welcome-screen" className="escala-generator">
                    <div className="generator-header">
                        <div className="header-icon">
                            <i className="fas fa-magic"></i>
                        </div>
                        <h2>Gerador Inteligente de Escalas</h2>
                        <p>Configure e gere escalas otimizadas automaticamente</p>
                    </div>

                    <div className="generator-content">
                        {/* Configurações Rápidas */}
                        <div className="quick-config">
                            <h3><i className="fas fa-bolt"></i> Configuração Rápida</h3>
                            <div className="config-grid">
                                <div className="config-card active">
                                    <div className="config-icon">
                                        <i className="fas fa-balance-scale"></i>
                                    </div>
                                    <h4>Balanceada</h4>
                                    <p>Distribui uniformemente as folgas</p>
                                </div>
                                <div className="config-card">
                                    <div className="config-icon">
                                        <i className="fas fa-calendar-weekend"></i>
                                    </div>
                                    <h4>Fins de Semana</h4>
                                    <p>Prioriza folgas nos fins de semana</p>
                                </div>
                                <div className="config-card">
                                    <div className="config-icon">
                                        <i className="fas fa-sync-alt"></i>
                                    </div>
                                    <h4>Rotativa</h4>
                                    <p>Alterna folgas entre analistas</p>
                                </div>
                            </div>
                        </div>

                        {/* Estatísticas Pré-visualização */}
                        <div className="preview-stats">
                            <h3><i className="fas fa-chart-pie"></i> Estatísticas do Mês</h3>
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <div className="stat-number">{analysts.length}</div>
                                    <div className="stat-label">Analistas Ativos</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">{shifts.length}</div>
                                    <div className="stat-label">Turnos</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">{mes ? new Date(mes.split('-')[0], mes.split('-')[1], 0).getDate() : 30}</div>
                                    <div className="stat-label">Dias no Mês</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">{mes ? Math.ceil(new Date(mes.split('-')[0], mes.split('-')[1], 0).getDate() * analysts.length / 4) : Math.ceil(30 * analysts.length / 4)}</div>
                                    <div className="stat-label">Total de Folgas</div>
                                </div>
                            </div>
                        </div>

                        {/* Opções Avançadas */}
                        <div className="advanced-options">
                            <h3><i className="fas fa-cogs"></i> Opções Avançadas</h3>
                            <div className="options-grid">
                                <label className="option-checkbox">
                                    <input type="checkbox" defaultChecked />
                                    <span className="checkmark"></span>
                                    <div className="option-info">
                                        <strong>Balanceamento Automático</strong>
                                        <small>Ajusta automaticamente para distribuir folgas igualmente</small>
                                    </div>
                                </label>
                                <label className="option-checkbox">
                                    <input type="checkbox" defaultChecked />
                                    <span className="checkmark"></span>
                                    <div className="option-info">
                                        <strong>Evitar Folgas Consecutivas</strong>
                                        <small>Minimiza folgas seguidas para o mesmo analista</small>
                                    </div>
                                </label>
                                <label className="option-checkbox">
                                    <input type="checkbox" />
                                    <span className="checkmark"></span>
                                    <div className="option-info">
                                        <strong>Priorizar Fins de Semana</strong>
                                        <small>Tenta colocar mais folgas nos sábados e domingos</small>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Botões de Ação */}
                        <div className="generator-actions">
                            <button className="btn-preview">
                                <i className="fas fa-eye"></i>
                                Visualizar Preview
                            </button>
                            <button className="btn-generate primary" onClick={() => { generateTables(); showToastMessage('Escala gerada com sucesso!', 'fa-calendar-check'); }}>
                                <i className="fas fa-magic"></i>
                                Gerar Escala Inteligente
                            </button>
                        </div>

                        {/* Templates Salvos */}
                        <div className="saved-templates">
                            <h3><i className="fas fa-bookmark"></i> Templates Salvos</h3>
                            <div className="templates-list">
                                <div className="template-item">
                                    <i className="fas fa-star"></i>
                                    <span>Escala Padrão NRS</span>
                                    <button className="btn-load">Carregar</button>
                                </div>
                                <div className="template-item">
                                    <i className="fas fa-calendar-alt"></i>
                                    <span>Feriados 2024</span>
                                    <button className="btn-load">Carregar</button>
                                </div>
                                <div className="template-item">
                                    <i className="fas fa-users"></i>
                                    <span>Férias Coletivas</span>
                                    <button className="btn-load">Carregar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div id="tabelas" className="tabelas" ref={tabelasRef}>
                {tabelas}
            </div>

            <Modal show={isExportModalOpen} onClose={() => setIsExportModalOpen(false)}>
                <h2>Exportar Escala</h2>
                <p>Selecione o formato de exportação desejado.</p>
                <div className="export-options">
                    <button className="btn primary" onClick={() => handleExport('xls')}><i className="fa-solid fa-file-excel"></i> Exportar para Excel</button>
                    <button className="btn primary" onClick={() => handleExport('pdf')}><i className="fa-solid fa-file-pdf"></i> Exportar para PDF</button>
                </div>
            </Modal>

            <Modal show={isEditEscalaModalOpen} onClose={() => setIsEditEscalaModalOpen(false)}>
                {editingCellData && (
                    <EditEscalaModal
                        data={editingCellData}
                        analistas={analistasAtivos}
                        onSave={onSaveFolgaManual}
                        onCancel={() => setIsEditEscalaModalOpen(false)}
                        folgasManuais={folgasManuaisAtivas}
                    />
                )}
            </Modal>

            {/* Modal de Gerenciamento de Analistas */}
            <AnalystManagementModal
                isOpen={isAnalystModalOpen}
                onClose={() => setIsAnalystModalOpen(false)}
                analysts={analysts}
                onSave={handleSaveAnalyst}
                onDelete={handleDeleteAnalyst}
                onReorder={handleReorderAnalysts}
            />

            {/* Modal de Gerenciamento de Turnos */}
            <ShiftManagementModal
                isOpen={isShiftModalOpen}
                onClose={() => setIsShiftModalOpen(false)}
                shifts={shifts}
                onSave={handleSaveShift}
                onDelete={handleDeleteShift}
                onReorder={handleReorderShifts}
            />
        </>
    );
};

export default EscalaTable;