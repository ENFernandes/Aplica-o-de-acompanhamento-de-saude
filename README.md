# Health Tracker - Acompanhamento de Saúde

Uma aplicação web moderna para acompanhamento de saúde pessoal, com suporte a dados locais e Firebase.

## 🚀 Funcionalidades

- **Registro de Dados de Saúde**: Peso, altura, IMC, massa muscular, gordura corporal, etc.
- **Visualização Gráfica**: Gráficos interativos mostrando evolução dos dados
- **Sugestões Personalizadas**: Recomendações baseadas nos seus dados
- **Modo Local**: Funciona sem internet, salvando dados no navegador
- **Modo Firebase**: Sincronização em nuvem (quando configurado)
- **Interface Responsiva**: Otimizada para desktop e mobile
- **Edição Inline**: Edite registros diretamente na tabela

## 📁 Estrutura do Projeto

```
Aplicação de Acompanhamento de Saúde/
├── index.html                 # Página principal
├── README.md                  # Este arquivo
├── docker-compose.yml         # Configuração Docker
├── init-scripts/              # Scripts de inicialização da BD
│   └── 01-init-database.sql  # Schema e dados iniciais
├── backend/                   # Backend API
│   ├── package.json           # Dependências Node.js
│   ├── server.js              # Servidor Express
│   ├── env.example            # Variáveis de ambiente
│   ├── config/
│   │   └── database.js        # Configuração PostgreSQL
│   ├── routes/
│   │   ├── auth.js            # Rotas de autenticação
│   │   ├── healthRecords.js   # Rotas de registros de saúde
│   │   └── users.js           # Rotas de usuários
│   └── middleware/
│       └── validation.js      # Validação de dados
└── src/
    ├── css/
    │   └── styles.css        # Estilos CSS
    ├── js/
    │   ├── main.js           # Ponto de entrada da aplicação
    │   ├── appService.js     # Serviço principal da aplicação
    │   ├── databaseService.js # Serviço de comunicação com API
    │   ├── authService.js    # Serviço de autenticação
    │   ├── authManager.js    # Gerenciador de autenticação
    │   ├── firebaseConfig.js # Configuração do Firebase
    │   ├── localStorageService.js # Serviço de armazenamento local
    │   ├── validationService.js   # Validação de dados
    │   ├── chartService.js        # Renderização de gráficos
    │   ├── suggestionsService.js  # Geração de sugestões
    │   └── uiService.js           # Utilitários de interface
    ├── components/
    │   └── authComponents.js # Componentes de autenticação
    └── data/
        └── initialData.js    # Dados iniciais e configurações
```

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura da página
- **CSS3**: Estilos e responsividade
- **JavaScript ES6+**: Lógica da aplicação
- **Tailwind CSS**: Framework CSS utilitário
- **Chart.js**: Biblioteca de gráficos
- **PostgreSQL**: Base de dados principal
- **Node.js/Express**: Backend API
- **JWT**: Autenticação segura
- **Docker**: Containerização da base de dados
- **Firebase**: Backend em nuvem (opcional)
- **LocalStorage**: Armazenamento local (fallback)

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
npm run dev
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

### 2. Configuração Firebase (Opcional)
Para usar com Firebase, adicione as seguintes variáveis globais:

```javascript
// No console do navegador ou em um script
window.__firebase_config = {
    apiKey: "sua-api-key",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "seu-app-id"
};
```

## 📊 Funcionalidades Principais

### Modo Local
- ✅ Funciona sem internet
- ✅ Dados salvos no navegador
- ✅ Todos os recursos disponíveis
- ✅ Dados persistem entre sessões

### Modo Firebase
- ✅ Sincronização em nuvem
- ✅ Autenticação anônima
- ✅ Dados compartilhados entre dispositivos
- ✅ Backup automático

## 🎨 Interface

### Formulário de Registro
- Campos para todos os dados de saúde
- Validação automática
- Preenchimento automático da data

### Tabela de Histórico
- Visualização de todos os registros
- Edição inline
- Exclusão com confirmação
- Validação de dados

### Gráficos
- Evolução do peso e IMC
- Composição corporal
- Distribuição de gordura

### Sugestões
- Recomendações personalizadas
- Baseadas nos dados mais recentes
- Ícones visuais

## 🔧 Desenvolvimento

### Estrutura Modular
O código foi organizado em módulos para facilitar manutenção:

- **Services**: Lógica de negócio
- **Data**: Configurações e dados
- **UI**: Componentes de interface
- **Validation**: Validação de dados

### Padrões Utilizados
- **Service Pattern**: Separação de responsabilidades
- **Observer Pattern**: Atualizações em tempo real
- **Factory Pattern**: Criação de elementos UI
- **Strategy Pattern**: Diferentes modos de armazenamento

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile
- ✅ Diferentes navegadores

## 🔒 Privacidade

- **Modo Local**: Dados ficam apenas no seu dispositivo
- **Modo Firebase**: Dados sincronizados com sua conta
- **Sem rastreamento**: Não coletamos dados pessoais

## 🐛 Solução de Problemas

### Aplicação não carrega
1. Verifique se está usando um servidor local
2. Limpe o cache do navegador
3. Verifique o console para erros

### Dados não salvam
1. Verifique se o LocalStorage está habilitado
2. Tente em modo incógnito
3. Verifique espaço disponível

### Gráficos não aparecem
1. Verifique se Chart.js carregou
2. Recarregue a página
3. Verifique se há dados para exibir

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