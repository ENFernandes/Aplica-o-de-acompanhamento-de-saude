const { pool } = require('./config/database');

async function checkTableStructure() {
    try {
        console.log('Verificando estrutura da tabela health_records...');
        
        const result = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'health_records'
            ORDER BY ordinal_position
        `);
        
        console.log('Colunas da tabela health_records:');
        result.rows.forEach(row => {
            console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
        });
        
    } catch (error) {
        console.error('Erro ao verificar estrutura da tabela:', error);
    } finally {
        await pool.end();
    }
}

checkTableStructure(); 