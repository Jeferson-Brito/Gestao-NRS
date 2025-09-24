import React, { useState, useEffect } from 'react';

const Dashboard = ({ analistas = [], turnos = {}, eventos = [], user }) => {
    const [stats, setStats] = useState({
        totalAnalistas: 0,
        analistasAtivos: 0,
        totalTurnos: 0,
        eventosHoje: 0,
        proximasFollgas: []
    });

    useEffect(() => {
        calculateStats();
    }, [analistas, turnos, eventos]);

    const calculateStats = () => {
        const hoje = new Date();
        const eventosHoje = eventos.filter(evento => {
            const eventoData = new Date(evento.data);
            return eventoData.toDateString() === hoje.toDateString();
        });

        // Calcular próximas folgas (próximos 7 dias)
        const proximasFollgas = [];
        analistas.forEach(analista => {
            if (analista.folgaInicial) {
                const proximaFolga = calcularProximaFolga(analista.folgaInicial);
                if (proximaFolga <= 7) {
                    proximasFollgas.push({
                        nome: analista.nome,
                        diasRestantes: proximaFolga,
                        turno: analista.turno
                    });
                }
            }
        });

        setStats({
            totalAnalistas: analistas.length,
            analistasAtivos: analistas.filter(a => a.ativo !== false).length,
            totalTurnos: Object.keys(turnos).length,
            eventosHoje: eventosHoje.length,
            proximasFollgas: proximasFollgas.sort((a, b) => a.diasRestantes - b.diasRestantes)
        });
    };

    const calcularProximaFolga = (folgaInicial) => {
        const hoje = new Date();
        const diaAtual = hoje.getDate();
        
        let proximaFolga = folgaInicial;
        while (proximaFolga < diaAtual) {
            proximaFolga += 8; // Ciclo de 8 dias
        }
        
        return proximaFolga - diaAtual;
    };

    const getGreeting = () => {
        const hora = new Date().getHours();
        if (hora < 12) return 'Bom dia';
        if (hora < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    const getTurnoAtual = () => {
        const agora = new Date();
        const horaAtual = agora.getHours();
        
        for (const [nome, turno] of Object.entries(turnos)) {
            const [inicio, fim] = turno.horario.split(' - ');
            const [horaInicio] = inicio.split(':').map(Number);
            const [horaFim] = fim.split(':').map(Number);
            
            // Considera turnos que passam da meia-noite
            if (horaInicio > horaFim) {
                if (horaAtual >= horaInicio || horaAtual < horaFim) {
                    return { nome, ...turno };
                }
            } else {
                if (horaAtual >= horaInicio && horaAtual < horaFim) {
                    return { nome, ...turno };
                }
            }
        }
        return null;
    };

    const turnoAtual = getTurnoAtual();

    return (
        <div className="dashboard-container">
            {/* Header de Boas-vindas */}
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1 className="welcome-title">
                        {getGreeting()}, {user?.username || 'Usuário'}! 👋
                    </h1>
                    <p className="welcome-subtitle">
                        Aqui está um resumo da sua equipe NRS
                    </p>
                </div>
                <div className="current-time">
                    <div className="time-display">
                        {new Date().toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                    <div className="date-display">
                        {new Date().toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>
            </div>

            {/* Cards de Estatísticas */}
            <div className="stats-grid">
                <div className="stat-card primary">
                    <div className="stat-icon">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-number">{stats.totalAnalistas}</h3>
                        <p className="stat-label">Analistas Total</p>
                        <span className="stat-detail">
                            {stats.analistasAtivos} ativos
                        </span>
                    </div>
                </div>

                <div className="stat-card secondary">
                    <div className="stat-icon">
                        <i className="fas fa-clock"></i>
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-number">{stats.totalTurnos}</h3>
                        <p className="stat-label">Turnos</p>
                        <span className="stat-detail">
                            {turnoAtual ? `Atual: ${turnoAtual.nome}` : 'Fora do horário'}
                        </span>
                    </div>
                </div>

                <div className="stat-card success">
                    <div className="stat-icon">
                        <i className="fas fa-calendar-day"></i>
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-number">{stats.eventosHoje}</h3>
                        <p className="stat-label">Eventos Hoje</p>
                        <span className="stat-detail">
                            {stats.eventosHoje === 0 ? 'Nenhum evento' : 'Ver calendário'}
                        </span>
                    </div>
                </div>

                <div className="stat-card warning">
                    <div className="stat-icon">
                        <i className="fas fa-bed"></i>
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-number">{stats.proximasFollgas.length}</h3>
                        <p className="stat-label">Próximas Folgas</p>
                        <span className="stat-detail">
                            Próximos 7 dias
                        </span>
                    </div>
                </div>
            </div>

            {/* Seções Principais */}
            <div className="dashboard-main">
                {/* Turno Atual */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            <i className="fas fa-business-time"></i>
                            Turno Atual
                        </h2>
                    </div>
                    <div className="current-shift">
                        {turnoAtual ? (
                            <div className="shift-info" style={{ borderLeft: `4px solid ${turnoAtual.cor}` }}>
                                <div className="shift-details">
                                    <h3 className="shift-name">{turnoAtual.nome}</h3>
                                    <p className="shift-time">{turnoAtual.horario}</p>
                                    <div className="shift-analysts">
                                        <span className="analysts-count">
                                            {analistas.filter(a => a.turno === turnoAtual.nome).length} analistas
                                        </span>
                                    </div>
                                </div>
                                <div className="shift-badge" style={{ backgroundColor: turnoAtual.cor }}>
                                    Ativo
                                </div>
                            </div>
                        ) : (
                            <div className="no-shift">
                                <i className="fas fa-moon"></i>
                                <p>Nenhum turno ativo no momento</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Próximas Folgas */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            <i className="fas fa-calendar-week"></i>
                            Próximas Folgas
                        </h2>
                    </div>
                    <div className="upcoming-leaves">
                        {stats.proximasFollgas.length > 0 ? (
                            <div className="leaves-list">
                                {stats.proximasFollgas.slice(0, 5).map((folga, index) => (
                                    <div key={index} className="leave-item">
                                        <div className="leave-info">
                                            <span className="leave-name">{folga.nome}</span>
                                            <span className="leave-shift">{folga.turno}</span>
                                        </div>
                                        <div className="leave-countdown">
                                            <span className="days-count">{folga.diasRestantes}</span>
                                            <span className="days-label">
                                                {folga.diasRestantes === 1 ? 'dia' : 'dias'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-leaves">
                                <i className="fas fa-check-circle"></i>
                                <p>Nenhuma folga programada para os próximos dias</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Ações Rápidas */}
            <div className="dashboard-section">
                <div className="section-header">
                    <h2 className="section-title">
                        <i className="fas fa-bolt"></i>
                        Ações Rápidas
                    </h2>
                </div>
                <div className="quick-actions">
                    <button className="action-btn primary">
                        <i className="fas fa-table"></i>
                        <span>Gerar Escala</span>
                    </button>
                    <button className="action-btn secondary">
                        <i className="fas fa-plus"></i>
                        <span>Novo Evento</span>
                    </button>
                    <button className="action-btn success">
                        <i className="fas fa-user-plus"></i>
                        <span>Adicionar Analista</span>
                    </button>
                    <button className="action-btn info">
                        <i className="fas fa-download"></i>
                        <span>Exportar Dados</span>
                    </button>
                </div>
            </div>

            {/* Distribuição por Turnos */}
            <div className="dashboard-section">
                <div className="section-header">
                    <h2 className="section-title">
                        <i className="fas fa-chart-pie"></i>
                        Distribuição por Turnos
                    </h2>
                </div>
                <div className="shifts-distribution">
                    {Object.entries(turnos).map(([nome, turno]) => {
                        const analistasTurno = analistas.filter(a => a.turno === nome).length;
                        const porcentagem = stats.totalAnalistas > 0 ? 
                            Math.round((analistasTurno / stats.totalAnalistas) * 100) : 0;
                        
                        return (
                            <div key={nome} className="shift-distribution-item">
                                <div className="shift-header">
                                    <span className="shift-name">{nome}</span>
                                    <span className="shift-count">{analistasTurno} analistas</span>
                                </div>
                                <div className="shift-bar">
                                    <div 
                                        className="shift-progress" 
                                        style={{ 
                                            width: `${porcentagem}%`,
                                            backgroundColor: turno.cor
                                        }}
                                    ></div>
                                </div>
                                <div className="shift-details">
                                    <span className="shift-time">{turno.horario}</span>
                                    <span className="shift-percentage">{porcentagem}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

