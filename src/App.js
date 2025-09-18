import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
<<<<<<< HEAD
import config from './config';
=======
>>>>>>> 3a7d2720fca6b866ea98c218f4404af359e27906
import Navbar from './components/Navbar';
import EscalaTable from './components/EscalaTable';
import CalendarComponent from './components/Calendar';
import KnowledgeBase from './components/KnowledgeBase';
<<<<<<< HEAD
import Dashboard from './components/Dashboard';
=======
>>>>>>> 3a7d2720fca6b866ea98c218f4404af359e27906
import Modal from './components/Modal';
import AnalystManagementModal from './components/AnalystManagementModal';
import AnalistaForm from './components/AnalistaForm';
import TurnoModal from './components/TurnoModal';
import EventoForm from './components/EventoForm';
import SettingsModal from './components/SettingsModal';
import Login from './components/Login';
import UserManagement from './components/UserManagement';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import ResetPasswordModal from './components/ResetPasswordModal';
import { KNOWLEDGE_BASE } from './data/appData';
import Toast from './components/Toast';

const App = () => {
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
    const [isAnalystManagementModalOpen, setIsAnalystManagementModalOpen] = useState(false);
    const [isAnalistaModalOpen, setIsAnalistaModalOpen] = useState(false);
<<<<<<< HEAD
    const [editingAnalista] = useState(null);
    
    const API_URL = config.API_URL;
=======
    const [editingAnalista, setEditingAnalista] = useState(null);
    
    const API_URL = 'http://localhost:3001/api';
>>>>>>> 3a7d2720fca6b866ea98c218f4404af359e27906

    // Configura um cliente Axios com cabeçalhos padrão
    const api = axios.create({
        baseURL: API_URL
    });

    // Interceptor para adicionar o header em todas as requisições
    api.interceptors.request.use(config => {
        if (user && user.id) {
            config.headers['x-user-id'] = user.id;
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });
    
<<<<<<< HEAD
    const fetchData = useCallback(async () => {
=======
    const fetchData = async () => {
>>>>>>> 3a7d2720fca6b866ea98c218f4404af359e27906
        try {
            const [analistasRes, turnosRes, eventosRes, folgasManuaisRes, usersRes] = await Promise.all([
                api.get('/analistas'),
                api.get('/turnos'),
                api.get('/eventos'),
                api.get('/folgas-manuais'),
                api.get('/users')
            ]);

            const turnosData = turnosRes.data.reduce((acc, curr) => {
<<<<<<< HEAD
                // Usar 'nome' se existir, senão usar 'name' para compatibilidade
                const nomeTurno = curr.nome || curr.name;
                acc[nomeTurno] = curr;
=======
                acc[curr.name] = curr;
>>>>>>> 3a7d2720fca6b866ea98c218f4404af359e27906
                return acc;
            }, {});

            setData({
                analistas: analistasRes.data,
                turnos: turnosData,
                eventos: eventosRes.data,
                folgasManuais: folgasManuaisRes.data,
                users: usersRes.data
            });
        } catch (error) {
            console.error("Failed to fetch data from API", error);
        }
<<<<<<< HEAD
    }, []);
    
    useEffect(() => {
        // Carregar dados apenas uma vez na inicialização
        fetchData();
    }, [fetchData]);
=======
    };
    
    useEffect(() => {
        fetchData();
    }, [user]);
>>>>>>> 3a7d2720fca6b866ea98c218f4404af359e27906

    const [isTurnoModalOpen, setIsTurnoModalOpen] = useState(false);
    const [isEventoModalOpen, setIsEventoModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
    const [editingEvento, setEditingEvento] = useState(null);

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
<<<<<<< HEAD
            const response = await api.post('/login', { email, password });
            setUser(response.data.user);
            localStorage.setItem('currentUser', JSON.stringify(response.data.user));
            showToastMessage(`Olá, ${response.data.user.username}! Login realizado com sucesso.`, 'fa-check');
=======
            const response = await axios.post(`${API_URL}/login`, { email, password });
            setUser(response.data);
            localStorage.setItem('currentUser', JSON.stringify(response.data));
            showToastMessage(`Olá, ${response.data.username}! Login realizado com sucesso.`, 'fa-check');
>>>>>>> 3a7d2720fca6b866ea98c218f4404af359e27906
            setCurrentPage('dashboard');
        } catch (error) {
            showToastMessage('Dados de login incorretos. Por favor, tente novamente.', 'fa-exclamation-circle', true);
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
        showToastMessage('Você foi desconectado. Até a próxima!', 'fa-right-from-bracket');
    };

    const handleNavigation = (pageId) => {
        setCurrentPage(pageId);
    };

    const handleToggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const isUserAdmin = user && user.role === 'admin';

    const handleAddOrEditAnalista = async (analista) => {
        if (!isUserAdmin) {
            showToastMessage('Você não tem permissão para realizar esta ação.', 'fa-lock', true);
            return;
        }
        try {
            if (analista.id) {
                await api.put(`/analistas/${analista.id}`, analista);
                showToastMessage(`Analista ${analista.nome} foi atualizado com sucesso!`, 'fa-check');
            } else {
                await api.post(`/analistas`, analista);
                showToastMessage(`Novo analista ${analista.nome} adicionado à equipe!`, 'fa-check');
            }
            fetchData();
            setIsAnalistaModalOpen(false);
        } catch (error) {
            showToastMessage(error.response?.data?.error || 'Erro ao salvar analista.', 'fa-exclamation-circle', true);
        }
    };

    const handleDeleteAnalista = async (id) => {
        if (!isUserAdmin) {
            showToastMessage('Você não tem permissão para realizar esta ação.', 'fa-lock', true);
            return;
        }
        if (window.confirm("Tem certeza que deseja remover este analista?")) {
            try {
                await api.delete(`/analistas/${id}`);
                fetchData();
                showToastMessage('Analista removido da equipe com sucesso!', 'fa-trash-can');
            } catch (error) {
                 showToastMessage(error.response?.data?.error || 'Erro ao remover analista.', 'fa-exclamation-circle', true);
            }
        }
    };

    const handleAddOrEditTurno = async (turno) => {
        if (!isUserAdmin) {
            showToastMessage('Você não tem permissão para realizar esta ação.', 'fa-lock', true);
            return;
        }
        try {
            if (turno.originalName) {
                await api.put(`/turnos/${turno.originalName}`, { newName: turno.name, ...turno.details });
                showToastMessage(`Turno "${turno.name}" atualizado com sucesso!`, 'fa-check');
            } else {
                await api.post(`/turnos`, { name: turno.name, ...turno.details });
                showToastMessage(`Novo turno "${turno.name}" criado com sucesso!`, 'fa-check');
            }
            fetchData();
        } catch (error) {
            showToastMessage(error.response?.data?.error || 'Erro ao salvar turno.', 'fa-exclamation-circle', true);
        }
    };

    const handleDeleteTurno = async (name) => {
        if (!isUserAdmin) {
            showToastMessage('Você não tem permissão para realizar esta ação.', 'fa-lock', true);
            return;
        }
        if (window.confirm(`Tem certeza que deseja remover o turno "${name}"? Isso irá remover todos os analistas deste turno."`)) {
            try {
                await api.delete(`/turnos/${name}`);
                fetchData();
                showToastMessage(`O turno "${name}" foi removido com sucesso!`, 'fa-trash-can');
            } catch (error) {
                showToastMessage(error.response?.data?.error || 'Erro ao remover turno.', 'fa-exclamation-circle', true);
            }
        }
    };

    const handleReorderTurnos = async (newOrder) => {
        if (!isUserAdmin) {
            showToastMessage('Você não tem permissão para realizar esta ação.', 'fa-lock', true);
            return;
        }
        try {
            await api.post(`/turnos/reorder`, { newOrder });
            fetchData();
            showToastMessage('Ordem dos turnos salva com sucesso!', 'fa-arrows-up-down-left-right');
        } catch (error) {
            showToastMessage(error.response?.data?.error || 'Erro ao reordenar turnos.', 'fa-exclamation-circle', true);
        }
    };

    const handleAddOrEditEvento = async (evento) => {
        // Ação de adicionar evento é permitida para todos os usuários
        if (!isUserAdmin && evento.id) {
            showToastMessage('Você não tem permissão para realizar esta ação.', 'fa-lock', true);
            return;
        }
        try {
            if (evento.id) {
                await api.put(`/eventos/${evento.id}`, evento);
                showToastMessage(`Evento "${evento.titulo}" atualizado!`, 'fa-check');
            } else {
                await api.post(`/eventos`, evento);
                showToastMessage(`Evento "${evento.titulo}" adicionado ao calendário!`, 'fa-calendar-plus');
            }
            fetchData();
            setIsEventoModalOpen(false);
        } catch (error) {
            showToastMessage(error.response?.data?.error || 'Erro ao salvar evento.', 'fa-exclamation-circle', true);
        }
    };

    const handleDeleteEvento = async (id) => {
        if (!isUserAdmin) {
            showToastMessage('Você não tem permissão para realizar esta ação.', 'fa-lock', true);
            return;
        }
        if (window.confirm("Tem certeza que deseja remover este evento?")) {
            try {
                await api.delete(`/eventos/${id}`);
                fetchData();
                showToastMessage('Evento removido do calendário.', 'fa-trash-can');
            } catch (error) {
                showToastMessage(error.response?.data?.error || 'Erro ao remover evento.', 'fa-exclamation-circle', true);
            }
        }
    };

    const handleSaveFolgaManual = async (folgaData) => {
        if (!isUserAdmin) {
            showToastMessage('Você não tem permissão para realizar esta ação.', 'fa-lock', true);
            return;
        }
        try {
            await api.post(`/folgas-manuais`, folgaData);
            fetchData();
            showToastMessage('Dia alterado na escala com sucesso!', 'fa-check');
        } catch (error) {
            showToastMessage(error.response?.data?.error || 'Erro ao alterar dia.', 'fa-exclamation-circle', true);
        }
    };

    const handleSaveUser = async (newUser) => {
        if (!isUserAdmin) {
            showToastMessage('Você não tem permissão para realizar esta ação.', 'fa-lock', true);
            return;
        }
        try {
            if (newUser.id) {
                await api.put(`/users/${newUser.id}`, newUser);
                showToastMessage('Dados do usuário atualizados!', 'fa-check');
            } else {
                await api.post(`/users`, newUser);
                showToastMessage('Novo usuário criado com sucesso!', 'fa-user-plus');
            }
            fetchData();
        } catch (error) {
            showToastMessage(error.response?.data?.error || 'Erro ao salvar usuário.', 'fa-exclamation-circle', true);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!isUserAdmin) {
            showToastMessage('Você não tem permissão para realizar esta ação.', 'fa-lock', true);
            return;
        }
        if (window.confirm("Tem certeza que deseja remover este usuário?")) {
            try {
                await api.delete(`/users/${id}`);
                fetchData();
                showToastMessage('Usuário removido permanentemente.', 'fa-trash-can');
            } catch (error) {
                showToastMessage(error.response?.data?.error || 'Erro ao remover usuário.', 'fa-exclamation-circle', true);
            }
        }
    };

    const query = new URLSearchParams(window.location.search);
    const resetToken = query.get('token');
    const [isResetPasswordModalOpen, setIsResetPasswordModal] = useState(!!resetToken);

    if (resetToken && !user) {
      return (
        <ResetPasswordModal
          show={isResetPasswordModalOpen}
          token={resetToken}
          onClose={() => {
            setIsResetPasswordModal(false);
            window.history.replaceState({}, document.title, window.location.pathname);
          }}
        />
      );
    }

    if (!user) {
        return (
            <>
                <Login onLogin={handleLogin} onForgotPassword={() => setIsForgotPasswordModalOpen(true)} />
                <ForgotPasswordModal show={isForgotPasswordModalOpen} onClose={() => setIsForgotPasswordModalOpen(false)} showToastMessage={showToastMessage} />
                <Toast show={showToast} message={toastMessage} icon={toastIcon} isError={isToastError} />
            </>
        );
    }

    const pages = {
<<<<<<< HEAD
        'dashboard': <Dashboard 
                        analistas={data.analistas}
                        turnos={data.turnos}
                        eventos={data.eventos}
                        user={user}
                    />,
=======
        'dashboard': <div className="content-placeholder"><p>Página em desenvolvimento. Em breve, adicionaremos aqui as informações e ferramentas mais importantes para a sua gestão diária!</p></div>,
>>>>>>> 3a7d2720fca6b866ea98c218f4404af359e27906
        'escala': <EscalaTable
                    analistas={data.analistas}
                    turnos={data.turnos}
                    folgasManuais={data.folgasManuais}
                    onManageAnalysts={() => setIsAnalystManagementModalOpen(true)}
                    onTurnoManage={() => setIsTurnoModalOpen(true)}
                    onSaveFolgaManual={isUserAdmin ? handleSaveFolgaManual : null}
                    user={user}
                    showToastMessage={showToastMessage}
                />,
        'calendario': <CalendarComponent
                        analistas={data.analistas}
                        eventos={data.eventos}
                        feriados={KNOWLEDGE_BASE.feriados}
                        onAddEvent={() => { setEditingEvento(null); setIsEventoModalOpen(true); }}
                        onEditEvent={isUserAdmin ? (evento) => { setEditingEvento(evento); setIsEventoModalOpen(true); } : null}
                        onDeleteEvent={isUserAdmin ? handleDeleteEvento : null}
                        user={user}
                        showToastMessage={showToastMessage}
                    />,
        'base-conhecimentos': <KnowledgeBase
                                data={KNOWLEDGE_BASE}
                            />,
        'gerenciar-usuarios': <UserManagement
                                users={data.users}
                                onSaveUser={handleSaveUser}
                                onDeleteUser={handleDeleteUser}
                            />,
        'manuais-operacionais': <div className="content-placeholder"><p>Esta é a página dedicada aos manuais operacionais. Adicione aqui os seus documentos, guias e vídeos para a equipe.</p></div>
    };
    
    if (!isUserAdmin && currentPage === 'gerenciar-usuarios') {
        setCurrentPage('dashboard');
    }

    return (
        <div className="main-content">
            <Navbar onNavigate={handleNavigation} onSettingsToggle={() => setIsSettingsModalOpen(true)} currentPage={currentPage} user={user} onLogout={handleLogout} />
            <main id="app-container">
                {Object.keys(pages).map(pageId => (
                    <section key={pageId} id={pageId} className={`page ${currentPage === pageId ? 'active' : ''}`}>
                        {pages[pageId]}
                    </section>
                ))}
            </main>
            
            <Modal show={isAnalistaModalOpen} onClose={() => setIsAnalistaModalOpen(false)}>
                {isUserAdmin && <AnalistaForm 
                    analista={editingAnalista}
                    turnos={data.turnos}
                    onSave={handleAddOrEditAnalista}
                    onCancel={() => setIsAnalistaModalOpen(false)}
                />}
            </Modal>

            <Modal show={isTurnoModalOpen} onClose={() => setIsTurnoModalOpen(false)}>
                {isUserAdmin && <TurnoModal
                    turnos={data.turnos}
                    analistas={data.analistas}
                    onSave={handleAddOrEditTurno}
                    onDelete={handleDeleteTurno}
                    onReorder={handleReorderTurnos}
                    onCancel={() => setIsTurnoModalOpen(false)}
                />}
            </Modal>

            <Modal show={isEventoModalOpen} onClose={() => setIsEventoModalOpen(false)}>
                {isUserAdmin && <EventoForm
                    evento={editingEvento}
                    analistas={data.analistas}
                    onSave={handleAddOrEditEvento}
                    onCancel={() => setIsEventoModalOpen(false)}
                />}
            </Modal>
            
            <SettingsModal show={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} onToggleTheme={handleToggleTheme} theme={theme} />
            
            <Toast show={showToast} message={toastMessage} icon={toastIcon} isError={isToastError} />

            {/* Novo modal para gerenciar analistas */}
            <AnalystManagementModal
                show={isAnalystManagementModalOpen}
                onClose={() => setIsAnalystManagementModalOpen(false)}
                analysts={data.analistas}
                turnos={data.turnos}
                onSave={handleAddOrEditAnalista}
                onDelete={handleDeleteAnalista}
            />
        </div>
    );
};

export default App;