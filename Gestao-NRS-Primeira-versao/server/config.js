// Configuração para diferentes ambientes
const config = {
    development: {
        database: {
            user: 'postgres',
            host: 'localhost',
            database: 'gestao_nrs',
            password: '@Lionnees14', // Senha do PostgreSQL
            port: 5432,
        },
        server: {
            port: 3001
        }
    },
    production: {
        database: {
            user: process.env.DB_USER || 'postgres',
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || 'gestao_nrs',
            password: process.env.DB_PASSWORD || '@Lionnees14',
            port: process.env.DB_PORT || 5432,
        },
        server: {
            port: process.env.PORT || 3001
        }
    }
};

const environment = process.env.NODE_ENV || 'development';
module.exports = config[environment];
