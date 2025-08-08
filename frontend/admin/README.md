# 🔧 BackOffice Admin - Health Tracker

## 📋 Descrição

O BackOffice Admin é uma interface de administração completa para o sistema Health Tracker, permitindo aos administradores gerir utilizadores, dados de saúde, configurações do sistema e visualizar analytics detalhados.

## 🚀 Funcionalidades

### 📊 Dashboard
- **Estatísticas Gerais**: Total de utilizadores, registos, utilizadores ativos e taxa de crescimento
- **Gráficos Interativos**: Registos por mês e distribuição de utilizadores por tipo
- **Atualização Automática**: Dados atualizados automaticamente a cada 5 minutos

### 👥 Gestão de Utilizadores
- **Lista Completa**: Visualizar todos os utilizadores do sistema
- **Filtros Avançados**: Buscar por nome, email, tipo e status
- **Ações por Utilizador**:
  - 👁️ Ver detalhes completos
  - ✏️ Editar informações
  - ⬆️ Promover para administrador
  - 🗑️ Eliminar utilizador
- **Exportação**: Exportar dados em formato CSV

### 📋 Gestão de Dados
- **Todos os Registos**: Visualizar todos os registos de saúde do sistema
- **Filtros Avançados**: Por utilizador, data, tipo de dados
- **Ações por Registo**:
  - 👁️ Ver detalhes completos
  - ✏️ Editar dados
  - 🗑️ Eliminar registo
- **Exportação**: Exportar dados em formato CSV

### 📈 Analytics Detalhados
- **Distribuição de IMC**: Gráfico de pizza com categorias de peso
- **Evolução de Peso**: Gráfico de linha por utilizador
- **Atividade por Hora**: Gráfico de barras da atividade do sistema
- **Top Utilizadores**: Ranking dos utilizadores mais ativos

### ⚙️ Configurações do Sistema
- **Configurações Gerais**: Nome do sistema, email de suporte, limites
- **Notificações**: Configurar alertas e relatórios automáticos
- **Persistência**: Configurações guardadas automaticamente

### 🔔 Sistema de Notificações
- **Notificações em Tempo Real**: Alertas sobre eventos do sistema
- **Tipos de Notificação**:
  - 👤 Utilizadores (novos registos, promoções)
  - 🖥️ Sistema (backups, manutenção)
  - ⚠️ Alertas (problemas, avisos)
  - 📊 Relatórios (relatórios disponíveis)
- **Gestão de Estado**: Marcar como lidas, limpar notificações

## 🛡️ Segurança

### 🔐 Autenticação
- **Verificação de Admin**: Apenas utilizadores com role 'admin' podem aceder
- **Token JWT**: Autenticação baseada em tokens
- **Middleware de Segurança**: Verificação automática de permissões

### 🚫 Permissões
- **Acesso Total**: Administradores têm acesso completo ao sistema
- **Gestão de Roles**: Promover/utilizadores para admin
- **Auditoria**: Logs de todas as ações administrativas

## 🎨 Interface

### 📱 Design Responsivo
- **Mobile-First**: Interface otimizada para dispositivos móveis
- **Tailwind CSS**: Design moderno e consistente
- **Componentes Reutilizáveis**: Interface modular e escalável

### 🎯 UX/UI
- **Navegação Intuitiva**: Menu lateral com seções organizadas
- **Feedback Visual**: Indicadores de carregamento e estados
- **Modais Interativos**: Formulários e detalhes em modais
- **Animações Suaves**: Transições e efeitos visuais

## 🔧 Tecnologias

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3/Tailwind**: Estilos modernos e responsivos
- **JavaScript ES6+**: Lógica de aplicação
- **Chart.js**: Gráficos interativos
- **ES6 Modules**: Organização modular do código

### Backend
- **Node.js/Express**: API RESTful
- **PostgreSQL**: Base de dados relacional
- **JWT**: Autenticação segura
- **Middleware**: Validação e autorização

## 📁 Estrutura de Ficheiros

```
admin/
├── admin.html              # Página principal
├── css/
│   └── admin.css          # Estilos específicos
├── js/
│   ├── adminAuth.js       # Autenticação admin
│   ├── adminDashboard.js  # Dashboard e estatísticas
│   ├── userManagement.js  # Gestão de utilizadores
│   ├── dataManagement.js  # Gestão de dados
│   ├── adminAnalytics.js  # Analytics e gráficos
│   ├── adminSettings.js   # Configurações
│   └── adminNotifications.js # Sistema de notificações
└── README.md              # Esta documentação
```

## 🚀 Instalação e Uso

### Pré-requisitos
1. **Backend Ativo**: Servidor Node.js a correr na porta 3000
2. **Base de Dados**: PostgreSQL com tabelas criadas
3. **Utilizador Admin**: Pelo menos um utilizador com role 'admin'

### Acesso
1. **URL**: `http://localhost:8000/admin/admin.html`
2. **Login**: Utilizar credenciais de um utilizador admin
3. **Verificação**: Sistema verifica automaticamente permissões

### Primeira Configuração
1. **Criar Utilizador Admin**:
   ```sql
   SELECT set_user_role('user-id', 'admin');
   ```

2. **Verificar Acesso**:
   ```sql
   SELECT get_user_role('user-id');
   ```

## 🔄 Endpoints da API

### Autenticação
- `GET /api/admin/check` - Verificar status de admin
- `GET /api/admin/dashboard` - Dados do dashboard
- `GET /api/admin/users` - Listar utilizadores
- `GET /api/admin/health-records` - Listar registos
- `GET /api/admin/analytics` - Dados de analytics
- `GET /api/admin/settings` - Configurações
- `GET /api/admin/notifications` - Notificações

### Gestão
- `PUT /api/admin/users/:id` - Atualizar utilizador
- `DELETE /api/admin/users/:id` - Eliminar utilizador
- `POST /api/admin/users/:id/promote` - Promover para admin
- `PUT /api/admin/health-records/:id` - Atualizar registo
- `DELETE /api/admin/health-records/:id` - Eliminar registo
- `PUT /api/admin/settings` - Guardar configurações
- `PUT /api/admin/notifications/:id/read` - Marcar notificação como lida

## 🐛 Troubleshooting

### Problemas Comuns

1. **Acesso Negado**:
   - Verificar se o utilizador tem role 'admin'
   - Verificar se o token JWT é válido

2. **Dados Não Carregam**:
   - Verificar se o backend está a correr
   - Verificar conexão com a base de dados

3. **Gráficos Não Aparecem**:
   - Verificar se Chart.js está carregado
   - Verificar console para erros JavaScript

### Logs
- **Frontend**: Abrir DevTools (F12) para ver logs
- **Backend**: Verificar logs do servidor Node.js
- **Base de Dados**: Verificar logs do PostgreSQL

## 🔮 Melhorias Futuras

### Funcionalidades Planeadas
- [ ] **Relatórios Avançados**: PDF, Excel, gráficos personalizados
- [ ] **Backup Automático**: Sistema de backup integrado
- [ ] **Logs de Auditoria**: Histórico completo de ações
- [ ] **Notificações Push**: Alertas em tempo real
- [ ] **API Externa**: Endpoints para integração com outros sistemas
- [ ] **Multi-tenant**: Suporte para múltiplas organizações

### Melhorias Técnicas
- [ ] **WebSockets**: Comunicação em tempo real
- [ ] **Service Workers**: Funcionamento offline
- [ ] **PWA**: Progressive Web App
- [ ] **Testes Automatizados**: Unit e integration tests
- [ ] **CI/CD**: Pipeline de deployment automático

## 📞 Suporte

Para questões técnicas ou problemas:
- **Email**: support@healthtracker.com
- **Documentação**: Ver README principal do projeto
- **Issues**: Criar issue no repositório GitHub

---

**Desenvolvido com ❤️ para o Health Tracker V4** 