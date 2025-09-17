// server/vercel-server.js - Versão simplificada para Vercel
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Dados simulados para funcionar sem Firebase
const mockData = {
  users: [
    {
      id: '1',
      username: 'admin',
      email: 'admin@gestao-nrs.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      id: '2',
      username: 'user',
      email: 'user@gestao-nrs.com',
      password: 'user123',
      role: 'user'
    }
  ],
  analistas: [
    { id: '1', nome: "Mahori Silva", turno: "Madrugada", pausa: "01:00 - 02:00", folgaInicial: 7, ativo: true },
    { id: '2', nome: "Gean Nogueira", turno: "Madrugada", pausa: "02:00 - 03:00", folgaInicial: 3, ativo: true },
    { id: '3', nome: "José Matheus", turno: "Matinal", pausa: "09:30 - 10:30", folgaInicial: 2, ativo: true },
    { id: '4', nome: "João Carlos", turno: "Matinal", pausa: "09:00 - 10:00", folgaInicial: 6, ativo: true },
    { id: '5', nome: "Leanderson Mascena", turno: "Manhã", pausa: "13:00 - 14:00", folgaInicial: 7, ativo: true },
    { id: '6', nome: "Rafael Macêdo", turno: "Manhã", pausa: "11:30 - 12:30", folgaInicial: 6, ativo: true },
    { id: '7', nome: "Alesandro Silva", turno: "Tarde", pausa: "19:30 - 20:30", folgaInicial: 6, ativo: true },
    { id: '8', nome: "Paulo Vinícius", turno: "Tarde", pausa: "16:30 - 17:30", folgaInicial: 7, ativo: true },
    { id: '9', nome: "Jailso Maxwell", turno: "Tarde", pausa: "15:30 - 16:30", folgaInicial: 4, ativo: true },
    { id: '10', nome: "Rafael Sousa", turno: "Tarde", pausa: "15:00 - 16:00", folgaInicial: 3, ativo: true }
  ],
  turnos: [
    { id: '1', name: "Madrugada", nome: "Madrugada", horario: "22:00 - 06:00", cor: "#6a1b4d", ordem: 1 },
    { id: '2', name: "Matinal", nome: "Matinal", horario: "05:40 - 14:00", cor: "#8b4513", ordem: 2 },
    { id: '3', name: "Manhã", nome: "Manhã", horario: "07:00 - 15:20", cor: "#c49a30", ordem: 3 },
    { id: '4', name: "Tarde", nome: "Tarde", horario: "13:40 - 22:00", cor: "#1f4e79", ordem: 4 }
  ],
  eventos: [],
  folgasManuais: {}
};

// ============================================================================
// API ENDPOINTS
// ============================================================================

// Endpoint de teste
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend funcionando!', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Login
app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Tentativa de login:', { email });
    
    const user = mockData.users.find(u => u.email === email);
    
    if (!user) {
      console.log('❌ Usuário não encontrado:', email);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    if (user.password !== password) {
      console.log('❌ Senha incorreta para:', email);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    console.log('✅ Login bem-sucedido:', email);
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({ error: error.message });
  }
});

// Analistas
app.get('/api/analistas', (req, res) => {
  res.json(mockData.analistas);
});

// Turnos
app.get('/api/turnos', (req, res) => {
  res.json(mockData.turnos);
});

// Eventos
app.get('/api/eventos', (req, res) => {
  res.json(mockData.eventos);
});

// Folgas Manuais
app.get('/api/folgas-manuais', (req, res) => {
  res.json(mockData.folgasManuais);
});

// Users
app.get('/api/users', (req, res) => {
  const users = mockData.users.map(user => ({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: new Date()
  }));
  res.json(users);
});

// POST /api/users - Criar usuário
app.post('/api/users', (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Validar dados obrigatórios
    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    // Verificar se email já existe
    const existingUser = mockData.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    
    // Criar novo usuário
    const newUser = {
      id: (mockData.users.length + 1).toString(),
      username,
      email,
      password,
      role,
      createdAt: new Date().toISOString()
    };
    
    mockData.users.push(newUser);
    
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/users/:id - Atualizar usuário
app.put('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role } = req.body;
    
    const userIndex = mockData.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Verificar se email já existe em outro usuário
    const existingUser = mockData.users.find(u => u.email === email && u.id !== id);
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    
    // Atualizar usuário
    const updateData = { username, email, role };
    if (password && password.trim() !== '') {
      updateData.password = password;
    }
    
    mockData.users[userIndex] = { ...mockData.users[userIndex], ...updateData };
    
    res.json({
      id: mockData.users[userIndex].id,
      username: mockData.users[userIndex].username,
      email: mockData.users[userIndex].email,
      role: mockData.users[userIndex].role,
      createdAt: mockData.users[userIndex].createdAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/users/:id - Deletar usuário
app.delete('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const userIndex = mockData.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Não permitir deletar o último admin
    const user = mockData.users[userIndex];
    if (user.role === 'admin') {
      const adminCount = mockData.users.filter(u => u.role === 'admin').length;
      if (adminCount <= 1) {
        return res.status(400).json({ error: 'Não é possível deletar o último administrador' });
      }
    }
    
    mockData.users.splice(userIndex, 1);
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PDF Export (simplificado)
app.post('/api/exportar-pdf', (req, res) => {
  try {
    // Para simplificar, vamos retornar um erro amigável
    res.status(503).json({ 
      error: 'Funcionalidade de PDF temporariamente indisponível.',
      message: 'Esta funcionalidade será restaurada em breve. Use a visualização na tela por enquanto.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Catch all para outras rotas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint não encontrado',
    message: `Rota ${req.method} ${req.originalUrl} não existe`,
    availableEndpoints: [
      'GET /api/test',
      'POST /api/login',
      'GET /api/analistas',
      'GET /api/turnos',
      'GET /api/eventos',
      'GET /api/folgas-manuais',
      'GET /api/users'
    ]
  });
});

// Para funcionar localmente e no Vercel
const PORT = process.env.PORT || 3001;

// Se não for Vercel, iniciar servidor local
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}/api/test`);
    console.log(`📧 Login de teste: admin@gestao-nrs.com / admin123`);
  });
}

// Export default para Vercel
export default app;
