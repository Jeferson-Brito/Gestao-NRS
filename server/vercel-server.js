// Vercel Server - Otimizado para produção
import express from 'express';
import cors from 'cors';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  setDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';

const app = express();

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAXCkIKFujIx9bh6CdVNR_GvUivFjDvGck",
  authDomain: "gestao-nrs.firebaseapp.com",
  projectId: "gestao-nrs",
  storageBucket: "gestao-nrs.firebasestorage.app",
  messagingSenderId: "249338430540",
  appId: "1:249338430540:web:c968affbf717a7af6ce0e9",
  measurementId: "G-XS8B5V8SMG"
};

// Inicializar Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Middleware
app.use(cors());
app.use(express.json());

// Dados iniciais
const dadosIniciais = {
  users: [
    { username: "Jeferson Brito", email: "jeferson@grupohi.com.br", password: "@Lionnees14", role: "admin" },
    { username: "Teste", email: "teste@grupohi.com.br", password: "@Lionnees14", role: "common" }
  ],
  analistas: [
    { nome: "Mahori Silva", turno: "Madrugada", pausa: "01:00 - 02:00", folgaInicial: 7 },
    { nome: "Gean Nogueira", turno: "Madrugada", pausa: "02:00 - 03:00", folgaInicial: 3 },
    { nome: "José Matheus", turno: "Matinal", pausa: "09:30 - 10:30", folgaInicial: 2 },
    { nome: "João Carlos", turno: "Matinal", pausa: "09:00 - 10:00", folgaInicial: 6 },
    { nome: "Leanderson Mascena", turno: "Manhã", pausa: "13:00 - 14:00", folgaInicial: 7 },
    { nome: "Rafael Macêdo", turno: "Manhã", pausa: "11:30 - 12:30", folgaInicial: 6 },
    { nome: "Rodolfo Matias", turno: "Manhã", pausa: "10:00 - 11:00", folgaInicial: 7 },
    { nome: "Micael Moura", turno: "Manhã", pausa: "12:00 - 13:00", folgaInicial: 9 },
    { nome: "Thiago Lins", turno: "Manhã", pausa: "10:30 - 11:30", folgaInicial: 3 },
    { nome: "Faumar Câmara", turno: "Manhã", pausa: "10:30 - 11:30", folgaInicial: 2 },
    { nome: "Alesandro Silva", turno: "Tarde", pausa: "19:30 - 20:30", folgaInicial: 6 },
    { nome: "Paulo Vinícius", turno: "Tarde", pausa: "16:30 - 17:30", folgaInicial: 7 },
    { nome: "Jailso Maxwell", turno: "Tarde", pausa: "15:30 - 16:30", folgaInicial: 4 },
    { nome: "Rafael Sousa", turno: "Tarde", pausa: "15:00 - 16:00", folgaInicial: 3 },
    { nome: "Gustavo Hudson", turno: "Tarde", pausa: "17:30 - 18:30", folgaInicial: 2 },
    { nome: "Anderson Menezes", turno: "Tarde", pausa: "13:15 - 14:15", folgaInicial: 3 },
    { nome: "Samuel Lima", turno: "Tarde", pausa: "11:00 - 12:00", folgaInicial: 8 }
  ],
  turnos: [
    { name: "Madrugada", horario: "22:00 - 06:00", cor: "#6a1b4d", ordem: 1 },
    { name: "Matinal", horario: "05:40 - 14:00", cor: "#8b4513", ordem: 2 },
    { name: "Manhã", horario: "07:00 - 15:20", cor: "#c49a30", ordem: 3 },
    { name: "Tarde", horario: "13:40 - 22:00", cor: "#1f4e79", ordem: 4 }
  ]
};

// Função para popular dados iniciais
async function popularDadosIniciais() {
  try {
    console.log('🔄 Verificando dados iniciais...');
    
    // Verificar se já existem usuários
    const usersSnapshot = await getDocs(collection(db, 'users'));
    if (usersSnapshot.empty) {
      console.log('👥 Adicionando usuários iniciais...');
      for (const user of dadosIniciais.users) {
        await addDoc(collection(db, 'users'), user);
      }
    }

    // Verificar se já existem analistas
    const analystsSnapshot = await getDocs(collection(db, 'analysts'));
    if (analystsSnapshot.empty) {
      console.log('👨‍💼 Adicionando analistas iniciais...');
      for (const analista of dadosIniciais.analistas) {
        const analystData = {
          name: analista.nome,
          shift: analista.turno,
          breakTime: analista.pausa,
          startDay: analista.folgaInicial,
          active: true,
          createdAt: new Date().toISOString()
        };
        await addDoc(collection(db, 'analysts'), analystData);
      }
    }

    // Verificar se já existem turnos
    const shiftsSnapshot = await getDocs(collection(db, 'shifts'));
    if (shiftsSnapshot.empty) {
      console.log('⏰ Adicionando turnos iniciais...');
      const turnosIniciais = [
        { name: 'Madrugada', time: '22:00 - 06:00', color: '#6a1b4d', order: 1 },
        { name: 'Matinal', time: '05:40 - 14:00', color: '#8b4513', order: 2 },
        { name: 'Manhã', time: '07:00 - 15:20', color: '#c49a30', order: 3 },
        { name: 'Tarde', time: '13:40 - 22:00', color: '#1f4e79', order: 4 }
      ];
      
      for (const turno of turnosIniciais) {
        const shiftData = {
          ...turno,
          active: true,
          createdAt: new Date().toISOString()
        };
        await addDoc(collection(db, 'shifts'), shiftData);
      }
    }

    console.log('✅ Dados iniciais configurados!');
  } catch (error) {
    console.error('❌ Erro ao popular dados iniciais:', error);
  }
}

// ============================================================================
// ENDPOINTS
// ============================================================================

// Login
app.post('/api/login', async (req, res) => {
  try {
    console.log('🔐 POST /api/login');
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário no Firebase
    const usersSnapshot = await getDocs(collection(db, 'users'));
    let userFound = null;
    
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.email === email && userData.password === password) {
        userFound = { id: doc.id, ...userData };
      }
    });

    // Se não encontrou, criar usuário de teste para jeferson@grupohi.com.br
    if (!userFound && email === 'jeferson@grupohi.com.br' && password === '@Lionnees14') {
      console.log('👤 Criando usuário de teste...');
      const newUser = {
        username: "Jeferson Brito",
        email: "jeferson@grupohi.com.br",
        password: "@Lionnees14",
        role: "admin"
      };
      const docRef = await addDoc(collection(db, 'users'), newUser);
      userFound = { id: docRef.id, ...newUser };
    }

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

// Analistas
app.get('/api/analistas', async (req, res) => {
  try {
    console.log('📥 GET /api/analistas');
    const analistasSnapshot = await getDocs(collection(db, 'analistas'));
    const analistas = [];
    analistasSnapshot.forEach((doc) => {
      analistas.push({ id: doc.id, ...doc.data() });
    });
    res.json(analistas);
  } catch (error) {
    console.error('❌ Erro ao buscar analistas:', error);
    res.status(500).json({ error: 'Erro ao buscar analistas' });
  }
});

// Turnos
app.get('/api/turnos', async (req, res) => {
  try {
    console.log('📥 GET /api/turnos');
    const turnosSnapshot = await getDocs(collection(db, 'turnos'));
    const turnos = [];
    turnosSnapshot.forEach((doc) => {
      turnos.push(doc.data());
    });
    res.json(turnos);
  } catch (error) {
    console.error('❌ Erro ao buscar turnos:', error);
    res.status(500).json({ error: 'Erro ao buscar turnos' });
  }
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

// Usuários
app.get('/api/users', async (req, res) => {
  try {
    console.log('📥 GET /api/users');
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = [];
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      // Não retornar a senha por segurança
      const { password, ...userWithoutPassword } = userData;
      users.push({ id: doc.id, ...userWithoutPassword });
    });
    res.json(users);
  } catch (error) {
    console.error('❌ Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Criar usuário
app.post('/api/users', async (req, res) => {
  try {
    console.log('📝 POST /api/users');
    const { username, email, password, role } = req.body;
    
    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    const newUser = {
      username,
      email,
      password,
      role,
      createdAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'users'), newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({ id: docRef.id, ...userWithoutPassword });
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// Atualizar usuário
app.put('/api/users/:id', async (req, res) => {
  try {
    console.log('📝 PUT /api/users/' + req.params.id);
    const { id } = req.params;
    const { username, email, password, role } = req.body;
    
    const userData = { username, email, role };
    if (password) {
      userData.password = password;
    }
    
    await setDoc(doc(db, 'users', id), userData, { merge: true });
    
    res.json({ id, ...userData });
  } catch (error) {
    console.error('❌ Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// Deletar usuário
app.delete('/api/users/:id', async (req, res) => {
  try {
    console.log('🗑️ DELETE /api/users/' + req.params.id);
    const { id } = req.params;
    
    await deleteDoc(doc(db, 'users', id));
    
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Inicializar dados quando o servidor começar
popularDadosIniciais();

// === ENDPOINTS PARA ANALISTAS ===

// GET - Buscar todos os analistas
app.get('/api/analysts', async (req, res) => {
  try {
    const analystsRef = collection(db, 'analysts');
    const snapshot = await getDocs(analystsRef);
    const analysts = [];
    
    snapshot.forEach((doc) => {
      analysts.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(analysts);
  } catch (error) {
    console.error('Erro ao buscar analistas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST - Criar novo analista
app.post('/api/analysts', async (req, res) => {
  try {
    const { name, shift, breakTime, startDay } = req.body;
    
    if (!name || !shift) {
      return res.status(400).json({ error: 'Nome e turno são obrigatórios' });
    }
    
    const analystData = {
      name: name,
      shift: shift,
      breakTime: breakTime || '',
      startDay: parseInt(startDay) || 1,
      active: true,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'analysts'), analystData);
    
    res.status(201).json({ 
      id: docRef.id, 
      ...analystData,
      message: 'Analista criado com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao criar analista:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT - Atualizar analista existente
app.put('/api/analysts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, shift, breakTime, startDay, active } = req.body;
    
    if (!name || !shift) {
      return res.status(400).json({ error: 'Nome e turno são obrigatórios' });
    }
    
    const analystData = {
      name: name,
      shift: shift,
      breakTime: breakTime || '',
      startDay: parseInt(startDay) || 1,
      active: active !== undefined ? active : true,
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, 'analysts', id), analystData, { merge: true });
    
    res.json({ 
      id: id, 
      ...analystData,
      message: 'Analista atualizado com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao atualizar analista:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE - Excluir analista
app.delete('/api/analysts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await deleteDoc(doc(db, 'analysts', id));
    
    res.json({ message: 'Analista excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir analista:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// === ENDPOINTS PARA TURNOS ===

// GET - Buscar todos os turnos
app.get('/api/shifts', async (req, res) => {
  try {
    const shiftsRef = collection(db, 'shifts');
    const snapshot = await getDocs(shiftsRef);
    const shifts = [];
    
    snapshot.forEach((doc) => {
      shifts.push({ id: doc.id, ...doc.data() });
    });
    
    // Ordenar por ordem se disponível
    shifts.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    res.json(shifts);
  } catch (error) {
    console.error('Erro ao buscar turnos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST - Criar novo turno
app.post('/api/shifts', async (req, res) => {
  try {
    const { name, time, color, order } = req.body;
    
    if (!name || !time) {
      return res.status(400).json({ error: 'Nome e horário são obrigatórios' });
    }
    
    const shiftData = {
      name: name,
      time: time,
      color: color || '#3498db',
      order: parseInt(order) || 0,
      active: true,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'shifts'), shiftData);
    
    res.status(201).json({ 
      id: docRef.id, 
      ...shiftData,
      message: 'Turno criado com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao criar turno:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT - Atualizar turno existente
app.put('/api/shifts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, time, color, order, active } = req.body;
    
    if (!name || !time) {
      return res.status(400).json({ error: 'Nome e horário são obrigatórios' });
    }
    
    const shiftData = {
      name: name,
      time: time,
      color: color || '#3498db',
      order: parseInt(order) || 0,
      active: active !== undefined ? active : true,
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, 'shifts', id), shiftData, { merge: true });
    
    res.json({ 
      id: id, 
      ...shiftData,
      message: 'Turno atualizado com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao atualizar turno:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE - Excluir turno
app.delete('/api/shifts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await deleteDoc(doc(db, 'shifts', id));
    
    res.json({ message: 'Turno excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir turno:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// === ENDPOINT PARA SINCRONIZAÇÃO DE DADOS ===

// GET - Buscar todos os dados (analistas, turnos, etc.)
app.get('/api/sync', async (req, res) => {
  try {
    // Buscar analistas
    const analystsRef = collection(db, 'analysts');
    const analystsSnapshot = await getDocs(analystsRef);
    const analysts = [];
    analystsSnapshot.forEach((doc) => {
      analysts.push({ id: doc.id, ...doc.data() });
    });

    // Buscar turnos
    const shiftsRef = collection(db, 'shifts');
    const shiftsSnapshot = await getDocs(shiftsRef);
    const shifts = [];
    shiftsSnapshot.forEach((doc) => {
      shifts.push({ id: doc.id, ...doc.data() });
    });

    // Buscar usuários
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    const users = [];
    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    res.json({
      analysts: analysts,
      shifts: shifts.sort((a, b) => (a.order || 0) - (b.order || 0)),
      users: users,
      lastSync: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro na sincronização:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Exportar para Vercel
export default app;