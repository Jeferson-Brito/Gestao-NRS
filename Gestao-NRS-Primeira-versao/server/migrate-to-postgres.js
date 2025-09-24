const { query, testConnection, createTables, insertInitialData } = require('./db-postgres');

async function migrate() {
    console.log('🚀 Iniciando migração para PostgreSQL...');
    
    try {
        // Testar conexão
        console.log('1. Testando conexão com PostgreSQL...');
        await testConnection();
        
        // Criar tabelas
        console.log('2. Criando tabelas...');
        await createTables();
        
        // Inserir dados iniciais
        console.log('3. Inserindo dados iniciais...');
        await insertInitialData();
        
        console.log('✅ Migração concluída com sucesso!');
        console.log('📊 Dados migrados:');
        
        // Verificar dados
        const users = await query('SELECT COUNT(*) FROM users');
        const analistas = await query('SELECT COUNT(*) FROM analistas');
        const turnos = await query('SELECT COUNT(*) FROM turnos');
        
        console.log(`   - Usuários: ${users.rows[0].count}`);
        console.log(`   - Analistas: ${analistas.rows[0].count}`);
        console.log(`   - Turnos: ${turnos.rows[0].count}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro na migração:', error);
        process.exit(1);
    }
}

migrate();
