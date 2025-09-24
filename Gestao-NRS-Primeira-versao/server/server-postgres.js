const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const { query, testConnection, createTables, insertInitialData } = require('./db-postgres');
const config = require('./config');

const app = express();
const PORT = config.server.port;

app.use(cors());
app.use(express.json());

// Middleware de verificação de ADMIN
const isAdmin = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(401).json({ error: 'ID de usuário não fornecido nos cabeçalhos.' });
    }

    query('SELECT role FROM users WHERE id = $1', [userId])
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(401).json({ error: 'Usuário não autenticado.' });
            }
            if (result.rows[0].role !== 'admin') {
                return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
            }
            next();
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};

// API Endpoints para Analistas
app.get('/api/analistas', (req, res) => {
    query("SELECT * FROM analistas ORDER BY nome")
        .then(result => res.json(result.rows))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.post('/api/analistas', isAdmin, (req, res) => {
    const { nome, turno, pausa, folgaInicial } = req.body;
    query(`INSERT INTO analistas (nome, turno, pausa, folgaInicial) VALUES ($1, $2, $3, $4) RETURNING *`,
        [nome, turno, pausa, folgaInicial])
        .then(result => res.json(result.rows[0]))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.put('/api/analistas/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    const { nome, turno, pausa, folgaInicial } = req.body;
    query(`UPDATE analistas SET nome = $1, turno = $2, pausa = $3, folgaInicial = $4 WHERE id = $5 RETURNING *`,
        [nome, turno, pausa, folgaInicial, id])
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Analista não encontrado' });
            }
            res.json(result.rows[0]);
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

app.delete('/api/analistas/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    query('DELETE FROM analistas WHERE id = $1', [id])
        .then(result => {
            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Analista não encontrado' });
            }
            res.json({ message: 'Analista removido com sucesso' });
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// API Endpoints para Escalas
app.get('/api/escalas', (req, res) => {
    query(`
        SELECT e.*, a.nome as analista_nome 
        FROM escalas e 
        LEFT JOIN analistas a ON e.analista_id = a.id 
        ORDER BY e.data DESC
    `)
        .then(result => res.json(result.rows))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.post('/api/escalas', isAdmin, (req, res) => {
    const { analista_id, data, turno } = req.body;
    query(`INSERT INTO escalas (analista_id, data, turno) VALUES ($1, $2, $3) RETURNING *`,
        [analista_id, data, turno])
        .then(result => res.json(result.rows[0]))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.put('/api/escalas/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    const { analista_id, data, turno } = req.body;
    query(`UPDATE escalas SET analista_id = $1, data = $2, turno = $3 WHERE id = $4 RETURNING *`,
        [analista_id, data, turno, id])
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Escala não encontrada' });
            }
            res.json(result.rows[0]);
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

app.delete('/api/escalas/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    query('DELETE FROM escalas WHERE id = $1', [id])
        .then(result => {
            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Escala não encontrada' });
            }
            res.json({ message: 'Escala removida com sucesso' });
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// API Endpoints para Turnos
app.get('/api/turnos', (req, res) => {
    query("SELECT * FROM turnos ORDER BY inicio")
        .then(result => res.json(result.rows))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.post('/api/turnos', isAdmin, (req, res) => {
    const { nome, inicio, fim } = req.body;
    query(`INSERT INTO turnos (nome, inicio, fim) VALUES ($1, $2, $3) RETURNING *`,
        [nome, inicio, fim])
        .then(result => res.json(result.rows[0]))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.put('/api/turnos/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    const { nome, inicio, fim } = req.body;
    query(`UPDATE turnos SET nome = $1, inicio = $2, fim = $3 WHERE id = $4 RETURNING *`,
        [nome, inicio, fim, id])
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Turno não encontrado' });
            }
            res.json(result.rows[0]);
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

app.delete('/api/turnos/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    query('DELETE FROM turnos WHERE id = $1', [id])
        .then(result => {
            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Turno não encontrado' });
            }
            res.json({ message: 'Turno removido com sucesso' });
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// Endpoint de Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    query(`SELECT * FROM users WHERE email = $1`, [email])
        .then(result => {
            if (result.rows.length === 0 || result.rows[0].password !== password) {
                return res.status(401).json({ error: 'Email ou senha incorretos' });
            }
            const { id, username, email: userEmail, role } = result.rows[0];
            res.json({ id, username, email: userEmail, role });
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// Endpoint para criar usuário
app.post('/api/users', isAdmin, (req, res) => {
    const { username, email, password, role = 'common' } = req.body;
    query(`INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *`,
        [username, email, password, role])
        .then(result => res.json(result.rows[0]))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Endpoint para listar usuários
app.get('/api/users', isAdmin, (req, res) => {
    query("SELECT id, username, email, role, created_at FROM users ORDER BY username")
        .then(result => res.json(result.rows))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Endpoint para atualizar usuário
app.put('/api/users/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    const { username, email, role } = req.body;
    query(`UPDATE users SET username = $1, email = $2, role = $3 WHERE id = $4 RETURNING *`,
        [username, email, role, id])
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            res.json(result.rows[0]);
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// Endpoint para deletar usuário
app.delete('/api/users/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    query('DELETE FROM users WHERE id = $1', [id])
        .then(result => {
            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            res.json({ message: 'Usuário removido com sucesso' });
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// Endpoint para resetar senha
app.post('/api/reset-password', (req, res) => {
    const { email, newPassword } = req.body;
    query(`UPDATE users SET password = $1 WHERE email = $2 RETURNING *`,
        [newPassword, email])
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Email não encontrado' });
            }
            res.json({ message: 'Senha atualizada com sucesso' });
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// Inicializar banco de dados
const initializeDatabase = async () => {
    try {
        await testConnection();
        await createTables();
        await insertInitialData();
        console.log('Banco de dados inicializado com sucesso!');
    } catch (err) {
        console.error('Erro ao inicializar banco de dados:', err);
        process.exit(1);
    }
};

// Inicializar servidor
const startServer = async () => {
    await initializeDatabase();
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
};

startServer();
