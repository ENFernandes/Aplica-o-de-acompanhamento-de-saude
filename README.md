# Health Tracker - Acompanhamento de Saúde

Uma aplicação web moderna para acompanhamento de saúde pessoal com backend PostgreSQL.

## 🚀 Funcionalidades

- **Registro de Dados de Saúde**: Peso, altura, IMC, massa muscular, gordura corporal, etc.
- **Visualização Gráfica**: Gráficos interativos mostrando evolução dos dados
- **Sugestões Personalizadas**: Recomendações baseadas nos seus dados
- **Interface Responsiva**: Otimizada para desktop e mobile
- **Edição Inline**: Edite registros diretamente na tabela
- **Autenticação Segura**: Sistema de login e registro de usuários
- **Perfil de Usuário**: Edição de dados pessoais

## 📁 Estrutura do Projeto

```
Aplicação de Acompanhamento de Saúde/
├── index.html                 # Página principal da aplicação
├── login.html                 # Página de login e registro
├── README.md                  # Este arquivo
├── docker-compose.yml         # Configuração Docker
├── init-scripts/              # Scripts de inicialização da BD
│   ├── 01-init-database.sql  # Schema inicial
│   ├── 02-update-database.sql # Atualizações do schema
│   ├── 03-add-birthday-column.sql # Adição de coluna birthday
│   └── 04-add-user-fields.sql # Campos adicionais de usuário
├── backend/                   # Backend API
│   ├── package.json           # Dependências Node.js
│   ├── server.js              # Servidor Express
│   ├── env.example            # Variáveis de ambiente
│   ├── config/
│   │   └── database.js        # Configuração PostgreSQL
│   ├── routes/
│   │   ├── auth_simple.js     # Rotas de autenticação
│   │   ├── healthRecords.js   # Rotas de registros de saúde
│   │   └── users_simple.js    # Rotas de usuários
│   └── middleware/
│       ├── auth.js            # Middleware de autenticação
│       └── validation.js      # Validação de dados
└── src/
    ├── css/
    │   ├── styles.css         # Estilos da aplicação principal
    │   └── login.css          # Estilos da página de login
    ├── js/
    │   ├── main.js            # Ponto de entrada da aplicação
    │   ├── appService.js      # Serviço principal da aplicação
    │   ├── databaseService.js # Serviço de comunicação com API
    │   ├── authService.js     # Serviço de autenticação
    │   ├── authManager.js     # Gerenciador de autenticação
    │   ├── validationService.js # Validação de dados
    │   ├── uiService.js       # Utilitários de interface
    │   └── login.js           # Lógica da página de login
    ├── components/
    │   └── authComponents.js  # Componentes de autenticação
    └── data/
        └── initialData.js     # Dados iniciais e configurações
```

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+, Tailwind CSS, Chart.js
- **Backend**: Node.js/Express, PostgreSQL, JWT, bcryptjs, Joi
- **Segurança**: express-rate-limit, helmet, cors
- **Containerização**: Docker
- **Autenticação**: JWT (JSON Web Tokens)

## 🚀 Como Usar

### 1. Configuração da Base de Dados

#### Opção A: Docker Compose (Recomendado)
```bash
# Inicie o PostgreSQL e pgAdmin
docker-compose up -d

# Acesse pgAdmin em: http://localhost:5050
# Email: admin@healthtracker.com
# Password: admin_password_2024
```

#### Opção B: PostgreSQL Local
```bash
# Instale PostgreSQL e configure as variáveis de ambiente
# Copie backend/env.example para backend/.env e configure
```

### 2. Configuração do Backend
```bash
# Instale as dependências do backend
cd backend
npm install

# Configure as variáveis de ambiente
cp env.example .env
# Edite o arquivo .env com suas configurações

# Inicie o servidor de desenvolvimento
npm start
```

### 3. Execução do Frontend
```bash
# Navegue para a pasta do projeto
cd "Aplicação de Acompanhamento de Saúde"

# Inicie um servidor local
python -m http.server 8000

# Abra no navegador
# http://localhost:8000
```

## 📊 Funcionalidades Principais

### Autenticação
- ✅ Registro de novos usuários
- ✅ Login seguro com JWT
- ✅ Recuperação de senha
- ✅ Perfil de usuário editável

### Registros de Saúde
- ✅ Adicionar novos registros
- ✅ Editar registros existentes
- ✅ Excluir registros
- ✅ Visualização em tabela

### Gráficos e Análises
- ✅ Evolução do peso e IMC
- ✅ Composição corporal
- ✅ Distribuição de gordura

### Interface
- ✅ Design responsivo
- ✅ Edição inline na tabela
- ✅ Validação em tempo real
- ✅ Feedback visual

## 🎨 Interface

### Página de Login
- Formulário de login e registro
- Recuperação de senha
- Design moderno com glass effect

### Aplicação Principal
- Header com título centralizado
- Menu de usuário no canto superior direito
- Formulário de registro de dados
- Tabela de histórico com edição inline
- Gráficos interativos

## 🔧 Desenvolvimento

### Estrutura Modular
O código foi organizado em módulos para facilitar manutenção:

- **Services**: Lógica de negócio (AppService, AuthService, DatabaseService)
- **UI**: Componentes de interface (UIService, AuthManager)
- **Validation**: Validação de dados (ValidationService)
- **Components**: Componentes reutilizáveis (authComponents)

### Padrões Utilizados
- **Service Pattern**: Separação de responsabilidades
- **Observer Pattern**: Atualizações em tempo real
- **Factory Pattern**: Criação de elementos UI
- **Module Pattern**: Organização em módulos ES6

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile
- ✅ Diferentes navegadores

## 🔒 Segurança

- **JWT Authentication**: Tokens seguros para autenticação
- **Password Hashing**: Senhas criptografadas com bcryptjs
- **Input Validation**: Validação rigorosa de dados
- **Rate Limiting**: Proteção contra ataques de força bruta
- **CORS**: Configuração segura de cross-origin

## 🐛 Solução de Problemas

### Aplicação não carrega
1. Verifique se o backend está rodando (porta 3000)
2. Verifique se o servidor frontend está rodando (porta 8000)
3. Limpe o cache do navegador
4. Verifique o console para erros

### Erro de autenticação
1. Verifique se o token está válido
2. Tente fazer logout e login novamente
3. Verifique se o backend está acessível

### Dados não salvam
1. Verifique se está logado
2. Verifique se o backend está rodando
3. Verifique o console para erros de API

## 📄 Licença

Este projeto é de código aberto e pode ser usado livremente.

## 🤝 Contribuições

Contribuições são bem-vindas! Por favor:
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para suporte ou dúvidas, abra uma issue no repositório. 