// src/components/EscalaTable.js
<<<<<<< HEAD
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Modal from './Modal';
import EditEscalaModal from './EditEscalaModal';

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


=======
import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from './Modal';
import EditEscalaModal from './EditEscalaModal';

const EscalaTable = ({ analistas, turnos, folgasManuais, onManageAnalysts, onTurnoManage, onSaveFolgaManual, user, showToastMessage }) => {
>>>>>>> 3a7d2720fca6b866ea98c218f4404af359e27906
    const [mes, setMes] = useState('');
    const [tabelas, setTabelas] = useState(null);
    const [showWelcome, setShowWelcome] = useState(true);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isEditEscalaModalOpen, setIsEditEscalaModalOpen] = useState(false);
    const [editingCellData, setEditingCellData] = useState(null);

    const isUserAdmin = user && user.role === 'admin';
    const tabelasRef = useRef(null);

<<<<<<< HEAD
    const createTableBlock = useCallback((ano, mes, diaInicio, diasNoBloco, totalDays, semana) => {
=======
    // Função para calcular se é dia de folga considerando a continuidade entre meses
    const isDiaFolga = (analista, ano, mes, dia) => {
        // Criar data de referência (primeiro dia que o analista começou a trabalhar)
        // Assumindo que folgaInicial é relativo ao primeiro mês que o analista foi cadastrado
        const dataReferencia = new Date(ano, 0, 1); // 1º de janeiro do ano
        const dataAtual = new Date(ano, mes, dia);
        
        // Calcular quantos dias se passaram desde a data de referência
        const diasDesdeDelta = Math.floor((dataAtual - dataReferencia) / (1000 * 60 * 60 * 24));
        
        // Ajustar com base na folga inicial do analista
        const diasDesdeFolgaInicial = diasDesdeDelta - (analista.folgaInicial - 1);
        
        // Calcular o ciclo de 8 dias (6 trabalho + 2 folga)
        const posicaoNoCiclo = ((diasDesdeFolgaInicial % 8) + 8) % 8;
        
        // Posições 0 e 1 no ciclo são dias de folga
        return posicaoNoCiclo === 0 || posicaoNoCiclo === 1;
    };

    // Função alternativa mais precisa usando uma data base fixa
    const isDiaFolgaV2 = (analista, ano, mes, dia) => {
        const key = `${analista.id}-${ano}-${mes + 1}-${dia}`;
        const edicaoManual = folgasManuais[key];
        
        if (edicaoManual) {
            return edicaoManual.tipo !== 'trabalho';
        }

        // Usar uma data base fixa para todos os cálculos
        // Por exemplo: 1º de janeiro de 2024 como referência
        const dataBase = new Date(2024, 0, 1);
        const dataAtual = new Date(ano, mes, dia);
        
        // Calcular dias desde a data base
        const diasDesdeBase = Math.floor((dataAtual - dataBase) / (1000 * 60 * 60 * 24));
        
        // Ajustar pela folga inicial do analista
        // folgaInicial representa o primeiro dia de folga no ciclo
        const offset = (analista.folgaInicial - 1 + diasDesdeBase) % 8;
        
        return offset === 0 || offset === 1;
    };

    const generateTables = () => {
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
    };

    useEffect(() => {
        if (mes) {
            generateTables();
        } else {
            setTabelas(null);
            setShowWelcome(true);
        }
    }, [mes, analistas, turnos, folgasManuais]);

    const createTableBlock = (ano, mes, diaInicio, diasNoBloco, totalDays, semana) => {
>>>>>>> 3a7d2720fca6b866ea98c218f4404af359e27906
        const headers = ["Turno", "Analista", ...Array.from({ length: 10 }, (_, i) => {
            const dia = diaInicio + i;
            if (dia > totalDays) return "";
            const date = new Date(ano, mes, dia);
            const nomeDia = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][date.getDay()];
            return `${nomeDia} (${String(dia).padStart(2, "0")})`;
        }), "PAUSA"];

<<<<<<< HEAD
        const turnosOrdenados = Object.keys(turnosAtivos).sort((a, b) => turnosAtivos[a].ordem - turnosAtivos[b].ordem);

        const tableRows = [];
        turnosOrdenados.forEach((turnoNome, index) => {
            const analistasDoTurno = analistasAtivos.filter(a => a.turno === turnoNome);
=======
        const turnosOrdenados = Object.keys(turnos).sort((a, b) => turnos[a].ordem - turnos[b].ordem);

        const tableRows = [];
        turnosOrdenados.forEach((turnoNome, index) => {
            const analistasDoTurno = analistas.filter(a => a.turno === turnoNome);
>>>>>>> 3a7d2720fca6b866ea98c218f4404af359e27906
            const analistasNoTurno = analistasDoTurno.length;

            if (analistasNoTurno > 0) {
                analistasDoTurno.forEach((analista, idx) => {
                    const row = (
                        <tr key={analista.id} data-analista-id={analista.id}>
                            {idx === 0 && (
<<<<<<< HEAD
                                <td className="turno" rowSpan={analistasNoTurno} style={{ 
                                    backgroundColor: turnosAtivos[turnoNome]?.cor || 'var(--btn-primary-bg)',
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
                                        {turnoNome}
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
                                        {turnosAtivos[turnoNome]?.horario || ''}
                                    </div>
                                </td>
                            )}
                            <td className="analista" style={{ backgroundColor: turnosAtivos[turnoNome]?.cor || 'var(--btn-primary-bg)' }}>
=======
                                <td className="turno" rowSpan={analistasNoTurno} style={{ backgroundColor: turnos[turnoNome]?.cor || 'var(--btn-primary-bg)' }}>
                                    {turnoNome}
                                </td>
                            )}
                            <td className="analista" style={{ backgroundColor: turnos[turnoNome]?.cor || 'var(--btn-primary-bg)' }}>
>>>>>>> 3a7d2720fca6b866ea98c218f4404af359e27906
                                {analista.nome}
                            </td>
                            {Array.from({ length: 10 }, (_, i) => {
                                const dia = diaInicio + i;
                                if (dia > totalDays) {
                                    return <td key={i}></td>;
                                }

                                const key = `${analista.id}-${ano}-${mes + 1}-${dia}`;
                                const edicaoManual = folgasManuais[key];
                                let cellClass = 'trabalho';
<<<<<<< HEAD
                                let cellText = turnosAtivos[turnoNome]?.horario || "";
=======
                                let cellText = turnos[analista.turno]?.horario || "";
>>>>>>> 3a7d2720fca6b866ea98c218f4404af359e27906

                                if (edicaoManual) {
                                    cellClass = edicaoManual.tipo;
                                    switch (edicaoManual.tipo) {
                                        case 'folga': cellText = `FOLGA${edicaoManual.motivo ? ` (${edicaoManual.motivo})` : ''}`; break;
                                        case 'ferias': cellText = `FÉRIAS${edicaoManual.motivo ? ` (${edicaoManual.motivo})` : ''}`; break;
                                        case 'atestado': cellText = `ATESTADO${edicaoManual.motivo ? ` (${edicaoManual.motivo})` : ''}`; break;
                                        default: break;
                                    }
                                } else {
                                    // Nova lógica de cálculo de folgas
                                    const dataBase = new Date(2024, 0, 1); // 1º de janeiro de 2024 como referência
                                    const dataAtual = new Date(ano, mes, dia);
                                    
                                    // Calcular dias desde a data base
                                    const diasDesdeBase = Math.floor((dataAtual - dataBase) / (1000 * 60 * 60 * 24));
                                    
                                    // Ajustar pela folga inicial do analista
                                    const cicloAjustado = (diasDesdeBase - (analista.folgaInicial - 1)) % 8;
                                    const posicaoNoCiclo = ((cicloAjustado % 8) + 8) % 8;
                                    
                                    if (posicaoNoCiclo === 0 || posicaoNoCiclo === 1) {
                                        cellClass = 'folga';
                                        cellText = 'FOLGA';
                                    }
                                }

                                return (
                                    <td
                                        key={i}
                                        className={isUserAdmin ? cellClass : ''}
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
                            <td className="pausa">{analista.pausa}</td>
                        </tr>
                    );
                    tableRows.push(row);
                });
                if (index < turnosOrdenados.length - 1) {
                    tableRows.push(<tr key={`separator-${turnoNome}`} className="separator-row"><td colSpan={headers.length}></td></tr>);
                }
            } else {
                 tableRows.push(
                    <tr key={turnoNome}>
                        <td className="turno" style={{ backgroundColor: turnos[turnoNome]?.cor || 'var(--btn-primary-bg)' }}>{turnoNome}</td>
                        <td className="analista" style={{ backgroundColor: turnos[turnoNome]?.cor || 'var(--btn-primary-bg)' }}>(Nenhum analista)</td>
                        {Array(10).fill().map((_, i) => <td key={i}></td>)}
                        <td className="pausa"></td>
                    </tr>
                 );
                 if (index < turnosOrdenados.length - 1) {
                     tableRows.push(<tr key={`separator-${turnoNome}`} className="separator-row"><td colSpan={headers.length}></td></tr>);
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
<<<<<<< HEAD
    }, [analistasAtivos, turnosAtivos, isUserAdmin]);

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

    // Função handleExport corrigida para usar o servidor para PDFs
=======
    };

>>>>>>> 3a7d2720fca6b866ea98c218f4404af359e27906
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
<<<<<<< HEAD
            // Limpar o conteúdo HTML removendo elementos desnecessários para o PDF
            const cleanContainer = container.cloneNode(true);
            
            // Remover botões de ação e outros elementos não necessários
            const actionButtons = cleanContainer.querySelectorAll('.action-buttons, .btn, button');
            actionButtons.forEach(btn => btn.remove());
            
            // HTML simplificado para evitar problemas de corrupção no PDF
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="UTF-8">
                        <title>Escala NRS - ${mes}</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                font-size: 8px;
                                margin: 0;
                                padding: 10px;
                                background: white;
                            }
                            
                            h2 {
                                font-size: 12px;
                                text-align: center;
                                margin: 10px 0;
                                color: #333;
                            }
                            
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-bottom: 15px;
                            }
                            
                            th, td {
                                border: 1px solid #000;
                                padding: 2px;
                                text-align: center;
                                font-size: 7px;
                                vertical-align: middle;
                            }
                            
                            th {
                                background-color: #f0f0f0;
                                font-weight: bold;
                                font-size: 8px;
                            }
                            
                            .turno {
                                background-color: #d0d0d0;
                                font-weight: bold;
                                writing-mode: vertical-lr;
                                width: 25px;
                            }
                            
                            .analista {
                                background-color: #e0e0e0;
                                text-align: left;
                                padding-left: 3px;
                                font-weight: bold;
                                width: 70px;
                            }
                            
                            .folga {
                                background-color: #ffdddd;
                                color: #cc0000;
                                font-weight: bold;
                            }
                            
                            .ferias {
                                background-color: #fff2cc;
                                color: #cc6600;
                                font-weight: bold;
                            }
                            
                            .atestado {
                                background-color: #f2ccff;
                                color: #6600cc;
                                font-weight: bold;
                            }
                            
                            .separator-row {
                                height: 3px;
                            }
                            
                            .separator-row td {
                                border: none;
                                background: transparent;
                            }
                        </style>
                    </head>
                    <body>
                        ${cleanContainer.innerHTML}
                    </body>
                </html>
            `;
            
            // Verificar se o servidor está acessível antes de fazer a requisição
            fetch(`${API_URL}/analistas`, { 
                method: 'HEAD',
                signal: AbortSignal.timeout(5000) // Timeout de 5 segundos
            })
            .then(() => {
                // Servidor está respondendo, prosseguir com a geração do PDF
                return fetch(`${API_URL}/exportar-pdf`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ htmlContent }),
                    signal: AbortSignal.timeout(30000) // Timeout de 30 segundos para PDF
                });
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorText => {
                        let errorData;
                        try {
                            errorData = JSON.parse(errorText);
                        } catch {
                            errorData = { error: errorText };
                        }
                        throw new Error(`Erro do servidor (${response.status}): ${errorData.error || 'Erro desconhecido'}`);
                    });
                }
                return response.blob();
            })
            .then(blob => {
                if (blob.size === 0) {
                    throw new Error('PDF gerado está vazio');
                }
                
                console.log(`PDF recebido: ${blob.size} bytes, tipo: ${blob.type}`);
                
                // Criar URL e fazer download diretamente
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = nomeArquivo;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                // Aguardar um pouco antes de revogar a URL para garantir que o download começou
                setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                }, 1000);
                
                showToastMessage('Escala exportada para PDF com sucesso!', 'fa-file-pdf');
            })
            .catch(error => {
                console.error("Erro ao exportar PDF:", error);
                let errorMessage = 'Erro desconhecido ao exportar PDF';
                
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    errorMessage = 'Servidor não está respondendo. Verifique se o servidor backend está rodando na porta 3001.';
                } else if (error.name === 'AbortError') {
                    errorMessage = 'Timeout na geração do PDF. Tente novamente.';
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                showToastMessage(`Falha ao carregar documento PDF: ${errorMessage}`, 'fa-exclamation-circle', true);
            });
=======
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
>>>>>>> 3a7d2720fca6b866ea98c218f4404af359e27906
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
                        <button id="btnGerenciarAnalistas" className="btn" onClick={onManageAnalysts}><i className="fa-solid fa-users-gear"></i> Gerenciar Analistas</button>
                        <button id="btnGerenciarTurnos" className="btn" onClick={onTurnoManage}><i className="fa-solid fa-clock"></i> Turnos</button>
                        <button id="btnExportar" className="btn" onClick={() => setIsExportModalOpen(true)}><i className="fa-solid fa-download"></i> Exportar</button>
                    </div>
                )}
            </div>
            {showWelcome && (
                <div id="welcome-screen" className="welcome-screen">
                    <img src="/images/image_979eb5.png" alt="Logo Equipe NRS" className="logo-welcome" />
                    <div className="text-container">
                        <h2 className="welcome-title">Bem-vindo(a) à Escala NRS!</h2>
                        <p className="welcome-subtitle">Selecione o mês e clique em <strong>"Gerar Escala"</strong> para começar.</p>
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
                        analistas={analistas}
                        onSave={onSaveFolgaManual}
                        onCancel={() => setIsEditEscalaModalOpen(false)}
                        folgasManuais={folgasManuais}
                    />
                )}
            </Modal>
        </>
    );
};

export default EscalaTable;