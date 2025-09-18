const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');

        db.serialize(() => {
            // Criação de tabelas
            db.run(`CREATE TABLE IF NOT EXISTS analistas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT,
                turno TEXT,
                pausa TEXT,
                folgaInicial INTEGER
            )`, (err) => {
                if (err) console.error("Error creating 'analistas' table:", err.message);
            });

            db.run(`CREATE TABLE IF NOT EXISTS turnos (
                name TEXT PRIMARY KEY,
                horario TEXT,
                cor TEXT,
                ordem INTEGER
            )`, (err) => {
                if (err) console.error("Error creating 'turnos' table:", err.message);
            });

            db.run(`CREATE TABLE IF NOT EXISTS eventos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT,
                analistaId INTEGER,
                analistaOutros TEXT,
                data TEXT,
                horaInicio TEXT
            )`, (err) => {
                if (err) console.error("Error creating 'eventos' table:", err.message);
            });

            db.run(`CREATE TABLE IF NOT EXISTS folgasManuais (
                key TEXT PRIMARY KEY,
                analistaId INTEGER,
                ano INTEGER,
                mes INTEGER,
                dia INTEGER,
                tipo TEXT,
                motivo TEXT
            )`, (err) => {
                if (err) console.error("Error creating 'folgasManuais' table:", err.message);
            });

            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                email TEXT UNIQUE,
                password TEXT,
                role TEXT,
                resetPasswordToken TEXT,
                resetPasswordExpires INTEGER
            )`, (err) => {
                if (err) console.error("Error creating 'users' table:", err.message);
            });

            // Inserção de dados iniciais se as tabelas estiverem vazias
            db.get("SELECT count(*) AS count FROM analistas", (err, row) => {
                if (err) {
                    console.error("Error checking 'analistas' table count:", err.message);
                    return;
                }
                if (row.count === 0) {
                    const initialAnalistas = [
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
                    ];
                    const stmt = db.prepare(`INSERT INTO analistas (nome, turno, pausa, folgaInicial) VALUES (?, ?, ?, ?)`);
                    initialAnalistas.forEach(analista => {
                        stmt.run(analista.nome, analista.turno, analista.pausa, analista.folgaInicial);
                    });
                    stmt.finalize();
                }
            });

            db.get("SELECT count(*) AS count FROM turnos", (err, row) => {
                if (err) {
                    console.error("Error checking 'turnos' table count:", err.message);
                    return;
                }
                if (row.count === 0) {
                    const initialTurnos = [
                        { name: "Madrugada", horario: "22:00 - 06:00", cor: "#6a1b4d", ordem: 1 },
                        { name: "Matinal", horario: "05:40 - 14:00", cor: "#8b4513", ordem: 2 },
                        { name: "Manhã", horario: "07:00 - 15:20", cor: "#c49a30", ordem: 3 },
                        { name: "Tarde", horario: "13:40 - 22:00", cor: "#1f4e79", ordem: 4 }
                    ];
                    const stmt = db.prepare(`INSERT INTO turnos (name, horario, cor, ordem) VALUES (?, ?, ?, ?)`);
                    initialTurnos.forEach(turno => {
                        stmt.run(turno.name, turno.horario, turno.cor, turno.ordem);
                    });
                    stmt.finalize();
                }
            });

            db.get("SELECT count(*) AS count FROM users", (err, row) => {
                if (err) {
                    console.error("Error checking 'users' table count:", err.message);
                    return;
                }
                if (row.count === 0) {
                    const initialUsers = [
                        { username: "Jeferson Brito", email: "jeferson@example.com", password: "@Lionnees14", role: "admin" },
                        { username: "user", email: "user@example.com", password: "password456", role: "common" }
                    ];
                    const stmt = db.prepare(`INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`);
                    initialUsers.forEach(user => {
                        stmt.run(user.username, user.email, user.password, user.role);
                    });
                    stmt.finalize();
                }
            });
        });
    }
});

module.exports = db;