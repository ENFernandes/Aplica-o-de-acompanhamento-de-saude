# Railway Database Setup Guide

Este guia explica como configurar automaticamente a base de dados no Railway.

## 🚀 Configuração Automática

O projeto está configurado para executar automaticamente os scripts de inicialização da base de dados quando o backend é iniciado no Railway.

### Como Funciona

1. **Script de Setup**: `backend/scripts/setup-database.js`
2. **Execução Automática**: O Railway executa `npm run setup-db` antes de iniciar o servidor
3. **Scripts SQL**: Executa todos os ficheiros da pasta `init-scripts/` na ordem correta

## 📋 Scripts Executados

O script executa automaticamente:

1. `01-init-database.sql` - Estrutura base da base de dados
2. `02-update-database.sql` - Atualizações da estrutura
3. `03-add-birthday-column.sql` - Adiciona coluna de aniversário
4. `04-add-user-fields.sql` - Adiciona campos adicionais de utilizador
5. `05-add-user-roles.sql` - Sistema de roles e permissões
6. `06-create-admin-user.sql` - Cria utilizador admin padrão

## 🔧 Execução Manual

Se precisar de executar o setup manualmente:

### Via Railway CLI
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Fazer login e conectar ao projeto
railway login
railway link

# Executar setup da base de dados
railway run npm run setup-db
```

### Via Railway Dashboard
1. Aceder ao projeto no Railway
2. Ir para o serviço `backend`
3. Abrir o terminal
4. Executar: `npm run setup-db`

## 👑 Utilizador Admin Padrão

Após o setup, a aplicação terá um utilizador admin criado automaticamente:

- **Email**: `admin@healthtracker.com`
- **Password**: `admin123`
- **Role**: `admin`

## 🚨 Troubleshooting

### Erro de Conexão
- Verificar se as variáveis de ambiente `DB_*` estão configuradas no Railway
- Confirmar que o serviço PostgreSQL está ativo

### Scripts Falham
- Verificar logs do backend no Railway
- Os scripts continuam mesmo se algumas operações falharem (tabelas já existem)

### Base de Dados Vazia
- O script é idempotente - pode ser executado múltiplas vezes
- Se necessário, executar manualmente: `npm run setup-db`

## 📝 Logs

O script produz logs detalhados:
- ✅ Scripts executados com sucesso
- ⚠️ Avisos (operações que falharam mas não são críticas)
- ❌ Erros críticos que impedem o setup

## 🔄 Re-execução

Para re-executar o setup:
1. Parar o serviço backend
2. Executar `npm run setup-db`
3. Reiniciar o serviço

O script é seguro para executar múltiplas vezes - não duplica dados existentes.
