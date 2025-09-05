// src/components/EscalaTable.js
import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from './Modal';
import EditEscalaModal from './EditEscalaModal';

const EscalaTable = ({ analistas, turnos, folgasManuais, onManageAnalysts, onTurnoManage, onSaveFolgaManual, user, showToastMessage }) => {
    const [mes, setMes] = useState('');
    const [tabelas, setTabelas] = useState(null);
    const [showWelcome, setShowWelcome] = useState(true);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isEditEscalaModalOpen, setIsEditEscalaModalOpen] = useState(false);
    const [editingCellData, setEditingCellData] = useState(null);

    const isUserAdmin = user && user.role === 'admin';
    const tabelasRef = useRef(null);

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
        const headers = ["Turno", "Analista", ...Array.from({ length: 10 }, (_, i) => {
            const dia = diaInicio + i;
            if (dia > totalDays) return "";
            const date = new Date(ano, mes, dia);
            const nomeDia = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][date.getDay()];
            return `${nomeDia} (${String(dia).padStart(2, "0")})`;
        }), "PAUSA"];

        const turnosOrdenados = Object.keys(turnos).sort((a, b) => turnos[a].ordem - turnos[b].ordem);

        const tableRows = [];
        turnosOrdenados.forEach((turnoNome, index) => {
            const analistasDoTurno = analistas.filter(a => a.turno === turnoNome);
            const analistasNoTurno = analistasDoTurno.length;

            if (analistasNoTurno > 0) {
                analistasDoTurno.forEach((analista, idx) => {
                    const row = (
                        <tr key={analista.id} data-analista-id={analista.id}>
                            {idx === 0 && (
                                <td className="turno" rowSpan={analistasNoTurno} style={{ backgroundColor: turnos[turnoNome]?.cor || 'var(--btn-primary-bg)' }}>
                                    {turnoNome}
                                </td>
                            )}
                            <td className="analista" style={{ backgroundColor: turnos[turnoNome]?.cor || 'var(--btn-primary-bg)' }}>
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
                                let cellText = turnos[analista.turno]?.horario || "";

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
    };

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