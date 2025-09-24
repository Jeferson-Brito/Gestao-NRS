const { Pool } = require('pg');
const config = require('./config');

// Configuração do banco de dados PostgreSQL
const pool = new Pool(config.database);

// Função para testar a conexão
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Conectado ao PostgreSQL com sucesso!');
        client.release();
        return true;
    } catch (err) {
        console.error('Erro ao conectar com PostgreSQL:', err);
        return false;
    }
};

// Função para executar queries
const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Query executada', { text, duration, rows: res.rowCount });
        return res;
    } catch (err) {
        console.error('Erro na query:', err);
        throw err;
    }
};

// Função para criar as tabelas
const createTables = async () => {
    try {
        // Tabela de usuários
        await query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'common',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tabela de analistas
        await query(`
            CREATE TABLE IF NOT EXISTS analistas (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                turno VARCHAR(50) NOT NULL,
                pausa VARCHAR(50) NOT NULL,
                folgaInicial VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tabela de escalas
        await query(`
            CREATE TABLE IF NOT EXISTS escalas (
                id SERIAL PRIMARY KEY,
                analista_id INTEGER REFERENCES analistas(id),
                data DATE NOT NULL,
                turno VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tabela de turnos
        await query(`
            CREATE TABLE IF NOT EXISTS turnos (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                inicio TIME NOT NULL,
                fim TIME NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Tabelas criadas com sucesso!');
    } catch (err) {
        console.error('Erro ao criar tabelas:', err);
        throw err;
    }
};

// Função para inserir dados iniciais
const insertInitialData = async () => {
    try {
        // Verificar se já existem usuários
        const userCount = await query('SELECT COUNT(*) FROM users');
        if (userCount.rows[0].count > 0) {
            console.log('Dados iniciais já existem');
            return;
        }

        // Inserir usuários iniciais
        await query(`
            INSERT INTO users (username, email, password, role) VALUES
            ('Jeferson Brito', 'jeferson@grupohi.com.br', '@Lionnees14', 'admin'),
            ('Usuário Teste', 'user@example.com', 'password456', 'common')
        `);

        // Inserir turnos iniciais
        await query(`
            INSERT INTO turnos (nome, inicio, fim) VALUES
            ('Manhã', '06:00:00', '14:00:00'),
            ('Tarde', '14:00:00', '22:00:00'),
            ('Noite', '22:00:00', '06:00:00')
        `);

        console.log('Dados iniciais inseridos com sucesso!');
    } catch (err) {
        console.error('Erro ao inserir dados iniciais:', err);
        throw err;
    }
};

module.exports = {
    pool,
    query,
    testConnection,
    createTables,
    insertInitialData
};
