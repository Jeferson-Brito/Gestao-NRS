// Simple Firebase Server
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
  query,
  where
} from 'firebase/firestore';

const app = express();
const PORT = 3001;

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
    const analistasSnapshot = await getDocs(collection(db, 'analistas'));
    if (analistasSnapshot.empty) {
      console.log('👨‍💼 Adicionando analistas iniciais...');
      for (const analista of dadosIniciais.analistas) {
        await addDoc(collection(db, 'analistas'), analista);
      }
    }

    // Verificar se já existem turnos
    const turnosSnapshot = await getDocs(collection(db, 'turnos'));
    if (turnosSnapshot.empty) {
      console.log('⏰ Adicionando turnos iniciais...');
      for (const turno of dadosIniciais.turnos) {
        await addDoc(collection(db, 'turnos'), turno);
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

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor Firebase rodando em http://localhost:${PORT}`);
  console.log(`📱 Frontend: http://localhost:3000`);
  await popularDadosIniciais();
});








