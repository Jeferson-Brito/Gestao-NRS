// src/components/EscalaTable.js
import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from './Modal';
import EditEscalaModal from './EditEscalaModal'; // Importando o novo componente

const EscalaTable = ({ analistas, turnos, folgasManuais, onAnalistaAdd, onTurnoManage, onEditAnalista, onDeleteAnalista, onSaveFolgaManual, user, showToastMessage }) => {
    const [mes, setMes] = useState('');
    const [tabelas, setTabelas] = useState(null);
    const [showWelcome, setShowWelcome] = useState(true);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isEditEscalaModalOpen, setIsEditEscalaModalOpen] = useState(false);
    const [editingCellData, setEditingCellData] = useState(null);

    const isUserAdmin = user && user.role === 'admin';

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
        if (showToastMessage) {
            showToastMessage('Escala gerada com sucesso!', 'fa-calendar-check');
        }
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
                                <div className="action-buttons" data-html2canvas-ignore="true">
                                    <button onClick={() => onEditAnalista(analista)} title="Editar"><i className="fa-solid fa-pen-to-square"></i></button>
                                    <button onClick={() => onDeleteAnalista(analista.id)} title="Excluir"><i className="fa-solid fa-trash-can"></i></button>
                                </div>
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
                                    const diasDesdeFolgaInicial = dia - analista.folgaInicial;
                                    const ciclo = (diasDesdeFolgaInicial % 8 + 8) % 8;
                                    if (ciclo === 0 || ciclo === 1) {
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
        const container = document.getElementById("tabelas");

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
            const elements = container.querySelectorAll('.table-wrap, .semana-title');
            
            let promiseChain = Promise.resolve();

            elements.forEach((el, index) => {
                promiseChain = promiseChain.then(() => {
                    const clone = el.cloneNode(true);
                    // Garante que o clone é visível para o html2canvas
                    clone.style.display = 'block';
                    clone.style.position = 'absolute';
                    clone.style.left = '-9999px';
                    document.body.appendChild(clone);

                    return html2canvas(clone, { scale: 1.5, useCORS: true, logging: false }).then(canvas => {
                        const imgData = canvas.toDataURL('image/jpeg', 1.0);
                        const imgWidth = 280;
                        const imgHeight = canvas.height * imgWidth / canvas.width;
                        if (index > 0) pdf.addPage();
                        pdf.addImage(imgData, 'JPEG', 10, 10, imgWidth, imgHeight);
                        document.body.removeChild(clone);
                    }).catch(err => {
                        console.error("Erro ao renderizar para PDF:", err);
                        document.body.removeChild(clone);
                        return Promise.reject(err);
                    });
                });
            });

            promiseChain.then(() => {
                pdf.save(nomeArquivo);
                showToastMessage('Escala exportada para PDF!', 'fa-file-pdf');
                setIsExportModalOpen(false);
            }).catch(() => {
                 showToastMessage('Erro ao exportar PDF. Tente novamente.', 'fa-exclamation-circle', true);
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
                             <button className="btn primary btn-gerar" onClick={generateTables}>
                                <i className="fa-solid fa-calendar-plus"></i> Gerar
                            </button>
                    </div>
                </div>
                <div className="page-actions">
                        <>
                            <button id="btnAdicionar" className="btn" onClick={onAnalistaAdd}><i className="fa-solid fa-user-plus"></i> Analista</button>
                            <button id="btnGerenciarTurnos" className="btn" onClick={onTurnoManage}><i className="fa-solid fa-clock"></i> Turnos</button>
                        </>
                    <button id="btnExportar" className="btn" onClick={() => setIsExportModalOpen(true)}><i className="fa-solid fa-download"></i> Exportar</button>
                </div>
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
            <div id="tabelas" className="tabelas">
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