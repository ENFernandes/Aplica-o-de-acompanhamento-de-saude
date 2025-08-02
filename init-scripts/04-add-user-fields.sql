-- Add missing user fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS height INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS tax_id VARCHAR(32);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(32);

-- Add comments for documentation
COMMENT ON COLUMN users.height IS 'Altura do utilizador (cm)';
COMMENT ON COLUMN users.tax_id IS 'Número de Identificação Fiscal';
COMMENT ON COLUMN users.address IS 'Morada do utilizador';
COMMENT ON COLUMN users.phone IS 'Número de telefone do utilizador'; 