const { pool } = require('./config/database');

async function insertTestData() {
    try {
        console.log('Inserindo dados de teste para elder.fernandes@outlook.pt...');
        
        // Primeiro, vamos verificar se o utilizador existe
        const userCheck = await pool.query(
            'SELECT id, name, email FROM users WHERE email = $1',
            ['elder.fernandes@outlook.pt']
        );
        
        if (userCheck.rows.length === 0) {
            console.log('Utilizador elder.fernandes@outlook.pt não encontrado!');
            return;
        }
        
        const userId = userCheck.rows[0].id;
        console.log('Utilizador encontrado:', userCheck.rows[0]);
        
        // Atualizar dados do perfil
        const updateProfile = await pool.query(`
            UPDATE users 
            SET 
                name = 'Elder Fernandes',
                address = 'Rua João Paulo II, nº 695, casa 26, Marinhas Esposende',
                tax_id = '241543002',
                height = 175,
                birthday = '1990-08-01',
                phone = '912345678'
            WHERE id = $1
        `, [userId]);
        
        console.log('Perfil atualizado com sucesso!');
        
        // Inserir alguns registos de saúde de teste
        const healthRecords = [
            {
                date: '2024-01-15',
                weight: 75.5,
                bmi: 24.7,
                muscle_mass: 45.3,
                visceral_fat: 8,
                bone_mass: 3.2,
                water_percentage: 55.8
            },
            {
                date: '2024-02-15',
                weight: 74.8,
                bmi: 24.5,
                muscle_mass: 45.8,
                visceral_fat: 8,
                bone_mass: 3.2,
                water_percentage: 56.2
            },
            {
                date: '2024-03-15',
                weight: 74.2,
                bmi: 24.3,
                muscle_mass: 46.1,
                visceral_fat: 8,
                bone_mass: 3.2,
                water_percentage: 56.5
            },
            {
                date: '2024-04-15',
                weight: 73.8,
                bmi: 24.1,
                muscle_mass: 46.3,
                visceral_fat: 7,
                bone_mass: 3.2,
                water_percentage: 56.8
            },
            {
                date: '2024-05-15',
                weight: 73.5,
                bmi: 24.0,
                muscle_mass: 46.5,
                visceral_fat: 7,
                bone_mass: 3.2,
                water_percentage: 57.0
            }
        ];
        
        // Inserir registos de saúde
        for (const record of healthRecords) {
            await pool.query(`
                INSERT INTO health_records (
                    user_id, date, weight, bmi, muscle_mass, 
                    visceral_fat, bone_mass, water_percentage
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, [
                userId, record.date, record.weight, record.bmi,
                record.muscle_mass, record.visceral_fat, record.bone_mass,
                record.water_percentage
            ]);
        }
        
        console.log(`${healthRecords.length} registos de saúde inseridos com sucesso!`);
        
        // Verificar dados inseridos
        const finalCheck = await pool.query(`
            SELECT 
                u.name, u.email, u.address, u.tax_id, u.height, 
                u.birthday, u.phone,
                COUNT(hr.id) as health_records_count
            FROM users u
            LEFT JOIN health_records hr ON u.id = hr.user_id
            WHERE u.email = $1
            GROUP BY u.id, u.name, u.email, u.address, u.tax_id, u.height, u.birthday, u.phone
        `, ['elder.fernandes@outlook.pt']);
        
        console.log('Dados finais do utilizador:');
        console.log(finalCheck.rows[0]);
        
        console.log('✅ Dados de teste inseridos com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao inserir dados de teste:', error);
    } finally {
        await pool.end();
    }
}

insertTestData(); 