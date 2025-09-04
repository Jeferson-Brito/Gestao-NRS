const express = require('express');
const cors = require('cors');
const db = require('./db');
const { nanoid } = require('nanoid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Middleware de verificação de ADMIN mais seguro, usando headers
const isAdmin = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(401).json({ error: 'ID de usuário não fornecido nos cabeçalhos.' });
    }

    db.get('SELECT role FROM users WHERE id = ?', [userId], (err, row) => {
        if (err || !row) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }
        if (row.role !== 'admin') {
            return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
        }
        next();
    });
};

// API Endpoints para Analistas
app.get('/api/analistas', (req, res) => {
    db.all("SELECT * FROM analistas", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/analistas', isAdmin, (req, res) => {
    const { nome, turno, pausa, folgaInicial } = req.body;
    db.run(`INSERT INTO analistas (nome, turno, pausa, folgaInicial) VALUES (?, ?, ?, ?)`,
        [nome, turno, pausa, folgaInicial], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, ...req.body });
    });
});

app.put('/api/analistas/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    const { nome, turno, pausa, folgaInicial } = req.body;
    db.run(`UPDATE analistas SET nome = ?, turno = ?, pausa = ?, folgaInicial = ? WHERE id = ?`,
        [nome, turno, pausa, folgaInicial, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Analista atualizado com sucesso' });
    });
});

app.delete('/api/analistas/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM analistas WHERE id = ?`, id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Analista removido com sucesso' });
    });
});

// API Endpoints para Turnos
app.get('/api/turnos', (req, res) => {
    db.all("SELECT * FROM turnos ORDER BY ordem", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/turnos', isAdmin, (req, res) => {
    const { name, horario, cor, ordem } = req.body;
    db.run(`INSERT INTO turnos (name, horario, cor, ordem) VALUES (?, ?, ?, ?)`,
        [name, horario, cor, ordem], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Turno adicionado com sucesso' });
    });
});

app.put('/api/turnos/:name', isAdmin, (req, res) => {
    const { name } = req.params;
    const { newName, horario, cor, ordem } = req.body;
    db.serialize(() => {
        db.run(`UPDATE turnos SET name = ?, horario = ?, cor = ?, ordem = ? WHERE name = ?`,
            [newName, horario, cor, ordem, name], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (name !== newName) {
                db.run(`UPDATE analistas SET turno = ? WHERE turno = ?`, [newName, name]);
            }
            res.json({ message: 'Turno atualizado com sucesso' });
        });
    });
});

app.delete('/api/turnos/:name', isAdmin, (req, res) => {
    const { name } = req.params;
    db.serialize(() => {
        db.run(`DELETE FROM turnos WHERE name = ?`, name, function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            db.run(`DELETE FROM analistas WHERE turno = ?`, name);
            res.json({ message: 'Turno removido com sucesso' });
        });
    });
});

app.post('/api/turnos/reorder', isAdmin, (req, res) => {
    const { newOrder } = req.body;
    db.serialize(() => {
        db.run("BEGIN TRANSACTION;");
        newOrder.forEach((name, index) => {
            db.run(`UPDATE turnos SET ordem = ? WHERE name = ?`, [index + 1, name]);
        });
        db.run("COMMIT;", (err) => {
            if (err) {
                res.status(500).json({ error: 'Erro ao reordenar turnos' });
            } else {
                res.json({ message: 'Turnos reordenados com sucesso' });
            }
        });
    });
});

// API Endpoints para Eventos
app.get('/api/eventos', (req, res) => {
    db.all("SELECT * FROM eventos", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/eventos', (req, res) => {
    const { titulo, analistaId, analistaOutros, data, horaInicio } = req.body;
    db.run(`INSERT INTO eventos (titulo, analistaId, analistaOutros, data, horaInicio) VALUES (?, ?, ?, ?, ?)`,
        [titulo, analistaId, analistaOutros, data, horaInicio], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, ...req.body });
    });
});

app.put('/api/eventos/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    const { titulo, analistaId, analistaOutros, data, horaInicio } = req.body;
    db.run(`UPDATE eventos SET titulo = ?, analistaId = ?, analistaOutros = ?, data = ?, horaInicio = ? WHERE id = ?`,
        [titulo, analistaId, analistaOutros, data, horaInicio, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Evento atualizado com sucesso' });
    });
});

app.delete('/api/eventos/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM eventos WHERE id = ?`, id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Evento removido com sucesso' });
    });
});

// API Endpoints para Folgas Manuais
app.get('/api/folgas-manuais', (req, res) => {
    db.all("SELECT * FROM folgasManuais", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const folgasManuais = rows.reduce((acc, row) => {
            acc[row.key] = { tipo: row.tipo, motivo: row.motivo };
            return acc;
        }, {});
        res.json(folgasManuais);
    });
});

app.post('/api/folgas-manuais', isAdmin, (req, res) => {
    const { analistaId, ano, mes, dia, tipo, motivo } = req.body;
    const key = `${analistaId}-${ano}-${mes}-${dia}`;

    if (tipo === 'trabalho') {
        db.run(`DELETE FROM folgasManuais WHERE key = ?`, key, function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Folga manual removida' });
        });
    } else {
        db.run(`INSERT OR REPLACE INTO folgasManuais (key, analistaId, ano, mes, dia, tipo, motivo) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [key, analistaId, ano, mes, dia, tipo, motivo], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Folga manual adicionada/atualizada' });
        });
    }
});

// API Endpoints para Usuários
app.get('/api/users', (req, res) => {
    db.all("SELECT id, username, email, role FROM users", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/users', isAdmin, (req, res) => {
    const { username, email, password, role } = req.body;
    db.run(`INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`,
        [username, email, password, role], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                res.status(409).json({ error: 'Username or email already exists' });
            } else {
                res.status(500).json({ error: err.message });
            }
            return;
        }
        res.json({ id: this.lastID, username, email, role });
    });
});

app.put('/api/users/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    const { username, email, password, role } = req.body;
    db.run(`UPDATE users SET username = ?, email = ?, password = ?, role = ? WHERE id = ?`,
        [username, email, password, role, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Usuário atualizado com sucesso' });
    });
});

app.delete('/api/users/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM users WHERE id = ?`, id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Usuário removido com sucesso' });
    });
});

// Endpoint de Login (agora com email)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row && row.password === password) {
            const { id, username, email, role } = row;
            res.json({ id, username, email, role });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    });
});

// Endpoint para 'Esqueci a Senha'
app.post('/api/forgot-password', (req, res) => {
    const { email } = req.body;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(404).json({ error: 'E-mail não encontrado.' });
        }

        const token = nanoid(32);
        const expires = Date.now() + 3600000; // 1 hora de validade

        db.run(`UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?`,
            [token, expires, email], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                const resetLink = `http://localhost:3000/reset-password?token=${token}`;
                console.log(`\n--- LINK DE RECUPERAÇÃO DE SENHA ---\nToken para ${email}: ${resetLink}\n--------------------------------------\n`);
                res.json({ message: 'Um link para redefinir sua senha foi enviado para o seu email (impresso no console para desenvolvimento).' });
            });
    });
});

// Endpoint para redefinir a senha
app.post('/api/reset-password', (req, res) => {
    const { token, password } = req.body;
    db.get(`SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?`,
        [token, Date.now()], (err, user) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!user) {
                return res.status(400).json({ error: 'Token de redefinição de senha é inválido ou expirou.' });
            }

            db.run(`UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?`,
                [password, user.id], (err) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({ message: 'Sua senha foi redefinida com sucesso. Você já pode fazer login.' });
                });
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});