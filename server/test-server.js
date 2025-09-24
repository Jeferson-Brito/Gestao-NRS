// Servidor de teste simples
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Dados de usuários para teste
const users = [
  { id: '1', username: "Jeferson Brito", email: "jeferson@grupohi.com.br", password: "@Lionnees14", role: "admin" },
  { id: '2', username: "Teste", email: "teste@grupohi.com.br", password: "@Lionnees14", role: "common" }
];

// Login
app.post('/api/login', (req, res) => {
  try {
    console.log('🔐 POST /api/login');
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário
    const userFound = users.find(user => user.email === email && user.password === password);

    if (userFound) {
      // Não retornar a senha por segurança
      const { password: _, ...userWithoutPassword } = userFound;
      console.log('✅ Login bem-sucedido:', userWithoutPassword.email);
      res.json({ user: userWithoutPassword });
    } else {
      console.log('❌ Login falhou:', email);
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Usuários
app.get('/api/users', (req, res) => {
  try {
    console.log('📥 GET /api/users');
    const usersWithoutPassword = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res.json(usersWithoutPassword);
  } catch (error) {
    console.error('❌ Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Analistas
app.get('/api/analistas', (req, res) => {
  console.log('📥 GET /api/analistas');
  res.json([]);
});

// Turnos
app.get('/api/turnos', (req, res) => {
  console.log('📥 GET /api/turnos');
  res.json([]);
});

// Eventos
app.get('/api/eventos', (req, res) => {
  console.log('📥 GET /api/eventos');
  res.json([]);
});

// Folgas manuais
app.get('/api/folgas-manuais', (req, res) => {
  console.log('📥 GET /api/folgas-manuais');
  res.json({});
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de teste rodando em http://localhost:${PORT}`);
  console.log(`📱 Frontend: http://localhost:3000`);
  console.log('👥 Usuários disponíveis:');
  users.forEach(user => {
    console.log(`   - ${user.email} (${user.role})`);
  });
});
