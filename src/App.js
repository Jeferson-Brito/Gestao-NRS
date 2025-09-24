import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from './config';
import Login from './components/Login';
import Navbar from './components/Navbar';
import EscalaTable from './components/EscalaTable';
import CalendarComponent from './components/Calendar';
import KnowledgeBase from './components/KnowledgeBase';
import UserManagement from './components/UserManagement';
import SettingsModal from './components/SettingsModal';
import Toast from './components/Toast';
import { KNOWLEDGE_BASE } from './data/appData';
import './styles/nexus.css';

const App = () => {
    console.log('🚀 Nexus - Smart Management Solutions iniciando...');
    
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastIcon, setToastIcon] = useState('');
    const [isToastError, setIsToastError] = useState(false);
    
    const [data, setData] = useState({
        analistas: [],
        turnos: {},
        eventos: [],
        folgasManuais: {},
        users: []
    });

    const getInitialUser = () => {
        try {
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                return JSON.parse(savedUser);
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
        }
        return null;
    };
    
    const [user, setUser] = useState(getInitialUser());
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    
    const API_URL = config.API_URL;
    console.log('🔗 API URL:', API_URL);

    const api = axios.create({
        baseURL: API_URL
    });

    api.interceptors.request.use(config => {
        if (user && user.id) {
            config.headers['x-user-id'] = user.id;
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });
    
    const fetchData = useCallback(async () => {
        try {
            console.log('🔄 Buscando dados da API...');
            const [analistasRes, turnosRes, eventosRes, folgasManuaisRes, usersRes] = await Promise.all([
                api.get('/analistas'),
                api.get('/turnos'),
                api.get('/eventos'),
                api.get('/folgas-manuais'),
                api.get('/users')
            ]);

            const turnosData = turnosRes.data.reduce((acc, curr) => {
                const nomeTurno = curr.nome || curr.name;
                acc[nomeTurno] = curr;
                return acc;
            }, {});

            setData({
                analistas: analistasRes.data || [],
                turnos: turnosData || {},
                eventos: eventosRes.data || [],
                folgasManuais: folgasManuaisRes.data || {},
                users: usersRes.data || []
            });
            console.log('✅ Dados carregados com sucesso');
        } catch (error) {
            console.error("❌ Erro ao buscar dados da API:", error);
            setData({
                analistas: [],
                turnos: {},
                eventos: [],
                folgasManuais: {},
                users: []
            });
        }
    }, [api]);
    
    useEffect(() => {
        if (user) {
            console.log('🔄 Carregando dados para usuário logado...');
            fetchData();
        }
    }, [user, fetchData]);

    const showToastMessage = useCallback((message, icon, isError = false) => {
        setToastMessage(message);
        setToastIcon(icon);
        setIsToastError(isError);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    const handleLogin = async (email, password) => {
        try {
            console.log('🔐 Tentando fazer login...');
            
            // Validação básica
            if (!email || !password) {
                showToastMessage('Por favor, preencha todos os campos.', 'fa-exclamation-triangle', true);
                return;
            }
            
            if (!email.includes('@')) {
                showToastMessage('Por favor, insira um email válido.', 'fa-exclamation-triangle', true);
                return;
            }
            
            showToastMessage('Verificando credenciais...', 'fa-spinner fa-spin');
            
            const response = await api.post('/login', { email, password });
            setUser(response.data.user);
            localStorage.setItem('currentUser', JSON.stringify(response.data.user));
            showToastMessage(`Olá, ${response.data.user.username}! Login realizado com sucesso.`, 'fa-check');
            setCurrentPage('dashboard');
            console.log('✅ Login realizado com sucesso');
        } catch (error) {
            console.error('❌ Erro no login:', error);
            
            if (error.response?.status === 401) {
                showToastMessage('Email ou senha incorretos. Verifique suas credenciais.', 'fa-exclamation-circle', true);
            } else if (error.response?.status === 400) {
                showToastMessage('Dados inválidos. Verifique o formato do email e senha.', 'fa-exclamation-triangle', true);
            } else if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
                showToastMessage('Erro de conexão. Verifique sua internet e tente novamente.', 'fa-wifi', true);
            } else {
                showToastMessage('Erro interno do servidor. Tente novamente em alguns minutos.', 'fa-server', true);
            }
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
        showToastMessage('Você foi desconectado. Até a próxima!', 'fa-right-from-bracket');
    };

    const handleNavigation = (pageId) => {
        console.log('🔄 Navegando para:', pageId);
        setCurrentPage(pageId);
    };

    const handleToggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        showToastMessage(
            newTheme === 'dark' ? 'Tema escuro ativado!' : 'Tema claro ativado!', 
            newTheme === 'dark' ? 'fa-moon' : 'fa-sun'
        );
    };

    const isUserAdmin = user && user.role === 'admin';
    const canManageUsers = user && user.role === 'admin';

    const handleSaveUser = async (newUser) => {
        console.log('💾 Salvando usuário:', newUser);
        
        if (!canManageUsers) {
            showToastMessage('Você não tem permissão para realizar esta ação.', 'fa-lock', true);
            return;
        }
        
        
        try {
            console.log('🔄 Enviando dados para API...');
            
            // Usar fetch diretamente para evitar problemas com axios
            const baseUrl = config.API_URL;
            const url = newUser.id 
                ? `${baseUrl}/users/${newUser.id}`
                : `${baseUrl}/users`;
            
            const method = newUser.id ? 'PUT' : 'POST';
            
            console.log('🌐 URL:', url);
            console.log('📡 Método:', method);
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser)
            });
            
            console.log('📊 Status da resposta:', response.status);
            
            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}`;
                try {
                    const errorText = await response.text();
                    console.error('❌ Resposta de erro:', errorText);
                    // Tentar fazer parse do JSON se possível
                    try {
                        const errorData = JSON.parse(errorText);
                        errorMessage = errorData.error || errorMessage;
                    } catch {
                        errorMessage = `Erro do servidor: ${response.status}`;
                    }
                } catch (textError) {
                    console.error('❌ Erro ao ler resposta:', textError);
                    errorMessage = `Erro do servidor: ${response.status}`;
                }
                throw new Error(errorMessage);
            }
            
            const result = await response.json();
            console.log('✅ Resposta da API:', result);
            
            if (newUser.id) {
                showToastMessage('Dados do usuário atualizados!', 'fa-check');
            } else {
                showToastMessage('Novo usuário criado com sucesso!', 'fa-user-plus');
            }
            
            console.log('🔄 Recarregando dados...');
            await fetchData();
            console.log('✅ Usuário salvo com sucesso');
        } catch (error) {
            console.error('❌ Erro ao salvar usuário:', error);
            showToastMessage(error.message || 'Erro ao salvar usuário.', 'fa-exclamation-circle', true);
        }
    };

    const handleDeleteUser = async (id) => {
        console.log('🗑️ Deletando usuário:', id);
        
        if (!canManageUsers) {
            showToastMessage('Você não tem permissão para realizar esta ação.', 'fa-lock', true);
            return;
        }
        
        // Encontrar o usuário a ser deletado
        const userToDelete = data.users?.find(u => u.id === id);
        if (userToDelete && userToDelete.role === 'admin') {
            showToastMessage('Administradores não podem ser excluídos.', 'fa-shield', true);
            return;
        }
        
        
        if (window.confirm("Tem certeza que deseja remover este usuário?")) {
            try {
                console.log('🔄 Enviando requisição de exclusão...');
                
                const baseUrl = config.API_URL;
                const url = `${baseUrl}/users/${id}`;
                console.log('🌐 URL:', url);
                
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                console.log('📊 Status da resposta:', response.status);
                
                if (!response.ok) {
                    let errorMessage = `HTTP ${response.status}`;
                    try {
                        const errorText = await response.text();
                        console.error('❌ Resposta de erro:', errorText);
                        // Tentar fazer parse do JSON se possível
                        try {
                            const errorData = JSON.parse(errorText);
                            errorMessage = errorData.error || errorMessage;
                        } catch {
                            errorMessage = `Erro do servidor: ${response.status}`;
                        }
                    } catch (textError) {
                        console.error('❌ Erro ao ler resposta:', textError);
                        errorMessage = `Erro do servidor: ${response.status}`;
                    }
                    throw new Error(errorMessage);
                }
                
                console.log('🔄 Recarregando dados...');
                await fetchData();
                showToastMessage('Usuário removido permanentemente.', 'fa-trash-can');
                console.log('✅ Usuário deletado com sucesso');
            } catch (error) {
                console.error('❌ Erro ao deletar usuário:', error);
                showToastMessage(error.message || 'Erro ao remover usuário.', 'fa-exclamation-circle', true);
            }
        }
    };

    if (!user) {
        console.log('🔐 Usuário não logado, mostrando tela de login');
        return (
            <>
                <Login onLogin={handleLogin} onForgotPassword={() => {}} />
                <Toast show={showToast} message={toastMessage} icon={toastIcon} isError={isToastError} />
            </>
        );
    }

    console.log('👤 Usuário logado:', user);
    console.log('📊 Dados carregados:', data);
    console.log('📄 Página atual:', currentPage);

    const renderPage = () => {
        switch(currentPage) {
            case 'dashboard':
                return (
                    <div className="nexus-dashboard">
                        <div className="dashboard-hero">
                            <div className="hero-content">
                                <div className="hero-text">
                                    <h1>Bem-vindo ao <span className="nexus-brand">Nexus</span></h1>
                                    <p className="hero-subtitle">Smart Management Solutions</p>
                                    <p className="hero-description">
                                        Gerencie sua equipe com eficiência e inteligência. 
                                        Controle escalas, eventos e recursos em uma plataforma unificada.
                                    </p>
                                </div>
                                <div className="hero-illustration">
                                    <div className="floating-cards">
                                        <div className="floating-card card-1">
                                            <i className="fa-solid fa-calendar-days"></i>
                                        </div>
                                        <div className="floating-card card-2">
                                            <i className="fa-solid fa-users"></i>
                                        </div>
                                        <div className="floating-card card-3">
                                            <i className="fa-solid fa-chart-line"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-stats">
                            <div className="stat-card featured">
                                <div className="stat-icon">
                                    <i className="fa-solid fa-users"></i>
                                </div>
                                <div className="stat-content">
                                    <h3>{data.analistas?.length || 0}</h3>
                                    <p>Analistas Ativos</p>
                                    <div className="stat-trend">
                                        <i className="fa-solid fa-arrow-up"></i>
                                        <span>+12% este mês</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fa-solid fa-clock"></i>
                                </div>
                                <div className="stat-content">
                                    <h3>{Object.keys(data.turnos || {}).length}</h3>
                                    <p>Turnos</p>
                                </div>
                            </div>
                            
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fa-solid fa-calendar"></i>
                                </div>
                                <div className="stat-content">
                                    <h3>{data.eventos?.length || 0}</h3>
                                    <p>Eventos</p>
                                </div>
                            </div>
                            
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fa-solid fa-chart-line"></i>
                                </div>
                                <div className="stat-content">
                                    <h3>98%</h3>
                                    <p>Eficiência</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="dashboard-actions">
                            <div className="action-card primary">
                                <div className="action-icon">
                                    <i className="fa-solid fa-calendar-days"></i>
                                </div>
                                <div className="action-content">
                                    <h3>Escala de Trabalho</h3>
                                    <p>Gerencie escalas e turnos da equipe com precisão e flexibilidade</p>
                                    <button onClick={() => setCurrentPage('escala')} className="action-button">
                                        <i className="fa-solid fa-arrow-right"></i>
                                        Acessar Escala
                                    </button>
                                </div>
                            </div>
                            
                            <div className="action-card">
                                <div className="action-icon">
                                    <i className="fa-solid fa-calendar-check"></i>
                                </div>
                                <div className="action-content">
                                    <h3>Calendário</h3>
                                    <p>Visualize eventos e agendamentos em tempo real</p>
                                    <button onClick={() => setCurrentPage('calendario')} className="action-button">
                                        <i className="fa-solid fa-arrow-right"></i>
                                        Ver Calendário
                                    </button>
                                </div>
                            </div>
                            
                            <div className="action-card">
                                <div className="action-icon">
                                    <i className="fa-solid fa-book"></i>
                                </div>
                                <div className="action-content">
                                    <h3>Base de Conhecimentos</h3>
                                    <p>Documentação e recursos da equipe centralizados</p>
                                    <button onClick={() => setCurrentPage('base-conhecimentos')} className="action-button">
                                        <i className="fa-solid fa-arrow-right"></i>
                                        Acessar Base
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-footer">
                            <div className="user-info-card">
                                <div className="user-avatar">
                                    <i className="fa-solid fa-user"></i>
                                </div>
                                <div className="user-details">
                                    <h3>{user.username}</h3>
                                    <p>{user.email}</p>
                                    <span className="user-role">{user.role}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'escala':
                return (
                    <EscalaTable
                        analistas={data.analistas}
                        turnos={data.turnos}
                        folgasManuais={data.folgasManuais}
                        onManageAnalysts={() => showToastMessage('Funcionalidade em desenvolvimento', 'fa-info-circle')}
                        onTurnoManage={() => showToastMessage('Funcionalidade em desenvolvimento', 'fa-info-circle')}
                        onSaveFolgaManual={isUserAdmin ? () => showToastMessage('Funcionalidade em desenvolvimento', 'fa-info-circle') : null}
                        user={user}
                        showToastMessage={showToastMessage}
                    />
                );
            case 'calendario':
                return (
                    <CalendarComponent
                        analistas={data.analistas}
                        eventos={data.eventos}
                        feriados={KNOWLEDGE_BASE.feriados}
                        onAddEvent={() => {}}
                        onEditEvent={isUserAdmin ? () => {} : null}
                        onDeleteEvent={isUserAdmin ? () => {} : null}
                        user={user}
                        showToastMessage={showToastMessage}
                    />
                );
            case 'base-conhecimentos':
                return (
                    <KnowledgeBase
                        data={KNOWLEDGE_BASE}
                    />
                );
            case 'gerenciar-usuarios':
                return (
                    <UserManagement
                        users={data.users || []}
                        onSaveUser={handleSaveUser}
                        onDeleteUser={handleDeleteUser}
                    />
                );
            default:
                return (
                    <div className="content-placeholder">
                        <h2>Página não encontrada</h2>
                        <p>A página solicitada não existe.</p>
                    </div>
                );
        }
    };

    console.log('🎨 Renderizando interface principal...');
    return (
        <div className="main-content">
            <Navbar 
                onNavigate={handleNavigation} 
                onSettingsToggle={() => setIsSettingsModalOpen(true)} 
                currentPage={currentPage} 
                user={user} 
                onLogout={handleLogout} 
            />
            <main id="app-container">
                <section id={currentPage} className="page active">
                    {renderPage()}
                </section>
            </main>
            
            <SettingsModal 
                show={isSettingsModalOpen} 
                onClose={() => setIsSettingsModalOpen(false)} 
                onToggleTheme={handleToggleTheme} 
                theme={theme}
                user={user}
                showToastMessage={showToastMessage}
            />
            
            <Toast show={showToast} message={toastMessage} icon={toastIcon} isError={isToastError} />
        </div>
    );
};

export default App;