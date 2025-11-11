# SustentaTech - Documentação de Tecnologias e Arquitetura

## 📋 Visão Geral do Projeto

O **SustentaTech** é uma plataforma educacional voltada para sustentabilidade e educação ambiental. O sistema possui dois tipos de usuários principais: **professores** (com painel administrativo) e **alunos** (com painel estudantil), permitindo o gerenciamento de turmas, atividades e materiais educativos.

### Principais Funcionalidades:
- **Gestão de Turmas**: Criação e administração de salas de aula
- **Atividades Educativas**: Criação, atribuição e acompanhamento de atividades
- **Materiais Didáticos**: Gerenciamento de recursos educacionais
- **Sistema de Notificações**: Comunicação entre professores e alunos
- **Autenticação e Autorização**: Sistema seguro de login com diferentes perfis

---

## 🏗️ Arquitetura do Sistema

### Estrutura Geral
```
sustenta-tech/
├── frontend/          # Aplicação React (Interface do Usuário)
├── backend/           # API REST em Node.js
└── compose.yml        # Configuração do banco de dados PostgreSQL
```

### Padrão Arquitetural
- **Frontend**: SPA (Single Page Application) com React
- **Backend**: API REST seguindo Clean Architecture
- **Banco de Dados**: PostgreSQL com Docker
- **Comunicação**: HTTP/HTTPS com JSON

---

## 🎨 Frontend - Tecnologias e Conceitos

### React 19.1.0
**O que é**: React é uma biblioteca JavaScript para construção de interfaces de usuário interativas.

**Por que usar**: 
- Componentização reutilizável
- Virtual DOM para performance otimizada
- Ecossistema robusto e comunidade ativa
- Facilita a manutenção de aplicações complexas

**Como é usado no projeto**:
- Criação de componentes reutilizáveis (botões, cards, formulários)
- Gerenciamento de estado da aplicação
- Renderização dinâmica baseada em dados do backend

### TypeScript 5.8.3
**O que é**: Superset do JavaScript que adiciona tipagem estática.

**Por que usar**:
- Detecção de erros em tempo de desenvolvimento
- Melhor experiência de desenvolvimento com autocomplete
- Código mais legível e documentado
- Refatoração mais segura

**Como é usado**:
- Tipagem de props dos componentes
- Interfaces para dados da API
- Validação de tipos em tempo de compilação

### Vite 6.3.5
**O que é**: Ferramenta de build moderna e rápida para aplicações web.

**Por que usar**:
- Hot Module Replacement (HMR) instantâneo
- Build otimizado para produção
- Configuração simples
- Suporte nativo ao TypeScript

**Como é usado**:
- Servidor de desenvolvimento local
- Bundling e otimização para produção
- Processamento de assets (imagens, CSS)

### Tailwind CSS 4.1.14
**O que é**: Framework CSS utility-first para estilização rápida.

**Por que usar**:
- Desenvolvimento rápido com classes utilitárias
- Design system consistente
- Purge automático de CSS não utilizado
- Responsividade fácil

**Como é usado**:
- Estilização de todos os componentes
- Sistema de cores personalizado (tons de verde para sustentabilidade)
- Layout responsivo
- Animações e transições

### React Router 7.9.4
**O que é**: Biblioteca para roteamento em aplicações React.

**Por que usar**:
- Navegação SPA sem recarregamento de página
- Roteamento baseado em componentes
- Proteção de rotas
- URLs amigáveis

**Como é usado**:
- Navegação entre páginas (login, dashboard, turmas, atividades)
- Rotas protegidas por autenticação
- Parâmetros dinâmicos (IDs de turmas, estudantes)

### Principais Dependências do Frontend

#### Gerenciamento de Estado e Formulários
- **React Hook Form 7.65.0**: Gerenciamento eficiente de formulários
- **Zod 4.1.12**: Validação de schemas e dados
- **@hookform/resolvers 5.2.2**: Integração entre React Hook Form e Zod

#### Interface do Usuário
- **Radix UI**: Componentes acessíveis e customizáveis
  - Dialog, Label, Select, Separator, Slot, Tabs
- **Lucide React 0.546.0**: Ícones SVG modernos
- **Framer Motion 12.23.24**: Animações fluidas
- **Sonner 2.0.7**: Sistema de notificações toast

#### Utilitários
- **Axios 1.12.2**: Cliente HTTP para comunicação com API
- **clsx 2.1.1**: Utilitário para classes CSS condicionais
- **class-variance-authority 0.7.1**: Variantes de componentes

---

## ⚙️ Backend - Tecnologias e Conceitos

### Node.js com TypeScript
**O que é**: Runtime JavaScript server-side com tipagem estática.

**Por que usar**:
- Mesma linguagem no frontend e backend
- Ecossistema NPM rico
- Performance adequada para APIs REST
- Tipagem para maior segurança

**Como é usado**:
- Servidor HTTP para API REST
- Processamento de lógica de negócio
- Integração com banco de dados

### Express.js 5.1.0
**O que é**: Framework web minimalista para Node.js.

**Por que usar**:
- Simplicidade e flexibilidade
- Middleware ecosystem robusto
- Roteamento eficiente
- Amplamente adotado na comunidade

**Como é usado**:
- Criação de rotas da API (/login, /classroom, /activity, etc.)
- Middleware de autenticação JWT
- Tratamento de erros
- Parsing de JSON e CORS

### PostgreSQL 15
**O que é**: Sistema de gerenciamento de banco de dados relacional.

**Por que usar**:
- ACID compliance (transações seguras)
- Suporte a JSON e tipos complexos
- Performance robusta
- Open source e confiável

**Como é usado**:
- Armazenamento de dados de usuários, turmas, atividades
- Relacionamentos entre entidades
- Queries complexas com JOINs
- Migrations para versionamento do schema

### Principais Dependências do Backend

#### Autenticação e Segurança
- **jsonwebtoken 9.0.2**: Tokens JWT para autenticação
- **bcrypt 6.0.0**: Hash seguro de senhas
- **cors 2.8.5**: Controle de acesso entre origens

#### Banco de Dados
- **pg 8.16.3**: Driver PostgreSQL para Node.js
- **node-pg-migrate 8.0.3**: Sistema de migrations

#### Validação e Utilitários
- **zod 4.0.17**: Validação de schemas (compartilhado com frontend)
- **uuid 11.1.0**: Geração de identificadores únicos

#### Desenvolvimento
- **tsx 4.20.4**: Execução direta de TypeScript
- **vitest 3.1.3**: Framework de testes unitários

---

## 🏛️ Arquitetura do Backend - Clean Architecture

### Estrutura de Módulos
```
backend/src/modules/
├── Authentication/     # Autenticação e autorização
├── Activities/        # Gestão de atividades educativas
├── Classroom/         # Gestão de turmas e usuários
├── Materials/         # Materiais didáticos
└── Notifications/     # Sistema de notificações
```

### Camadas da Arquitetura

#### 1. **Adapters (Adaptadores)**
- **Express Controllers**: Recebem requisições HTTP
- **Gateways**: Comunicação com banco de dados
- **Responsabilidade**: Traduzir dados externos para o domínio

#### 2. **Application (Aplicação)**
- **Use Cases**: Lógica de negócio específica
- **Responsabilidade**: Orquestrar operações e regras de negócio

#### 3. **Domain (Domínio)**
- **Entities**: Modelos de dados principais
- **Responsabilidade**: Regras de negócio centrais

### Principais Use Cases

#### Autenticação
- **Login**: Validação de credenciais e geração de JWT
- **EditOwnProfile**: Edição de perfil do usuário
- **DeleteAccount**: Exclusão de conta

#### Gestão de Turmas
- **CreateClassroom**: Criação de novas turmas
- **CreateStudent/CreateTeacher**: Cadastro de usuários
- **ListClassroomStudents**: Listagem de alunos por turma

#### Atividades
- **CreateActivity**: Criação de atividades educativas
- **CompleteActivity**: Marcação de atividade como concluída
- **ListActivities**: Listagem de atividades por usuário

#### Materiais
- **ListStudentMaterials**: Listagem de materiais por aluno
- **CompleteMaterialAssignment**: Marcação de material como estudado

---

## 🔄 Fluxo de Dados e Comunicação

### Frontend → Backend
1. **Autenticação**: Login com email/senha → JWT token
2. **Requisições**: Axios com token JWT no header Authorization
3. **Dados**: JSON para criação/edição de recursos
4. **Respostas**: JSON com dados ou mensagens de erro

### Backend → Database
1. **Migrations**: Versionamento do schema do banco
2. **Gateways**: Abstração para queries SQL
3. **Transações**: Operações atômicas para consistência
4. **Relacionamentos**: Foreign keys entre tabelas

---

## 🎯 Principais Funcionalidades por Módulo

### Módulo de Autenticação (IAM)
- Login com email e senha
- Diferenciação entre Professor e Aluno
- Proteção de rotas por role
- Gerenciamento de perfil

### Módulo de Turmas (Classroom)
- Criação e edição de turmas
- Cadastro de professores e alunos
- Associação professor-turma
- Visualização de detalhes do aluno

### Módulo de Atividades (Activities)
- Criação de atividades pelos professores
- Atribuição para turmas específicas
- Conclusão de atividades pelos alunos
- Notificações automáticas

### Módulo de Materiais (Materials)
- Listagem de materiais educativos
- Marcação de materiais como estudados
- Acompanhamento de progresso

### Módulo de Notificações
- Notificações de novas atividades
- Avisos para professores e alunos
- Sistema de badges e contadores

---

## 🛠️ Ferramentas de Desenvolvimento

### Frontend
- **ESLint**: Linting de código JavaScript/TypeScript
- **Prettier**: Formatação automática de código
- **Vite**: Build tool e servidor de desenvolvimento

### Backend
- **TSX**: Execução direta de TypeScript
- **Vitest**: Testes unitários
- **Node-pg-migrate**: Migrations do banco de dados

### DevOps
- **Docker Compose**: Orquestração do PostgreSQL
- **Yarn**: Gerenciador de pacotes
- **Git**: Controle de versão

---

## 🎨 Design System e UX

### Paleta de Cores
- **Verde Primário**: Tons de lime (sustentabilidade)
- **Branco**: Backgrounds e cards
- **Cinza**: Textos secundários

### Componentes Reutilizáveis
- **Cards**: Exibição de informações
- **Buttons**: Ações do usuário
- **Forms**: Entrada de dados
- **Modals**: Interações contextuais

### Experiência do Usuário
- **Responsividade**: Adaptação a diferentes telas
- **Animações**: Transições suaves com Framer Motion
- **Feedback**: Notificações toast para ações
- **Acessibilidade**: Componentes Radix UI

---

## 🚀 Pontos Fortes da Arquitetura

### Escalabilidade
- Módulos independentes e bem definidos
- Clean Architecture facilita manutenção
- Componentes React reutilizáveis

### Performance
- Vite para builds rápidos
- Virtual DOM do React
- Queries otimizadas no PostgreSQL

### Segurança
- JWT para autenticação stateless
- Bcrypt para hash de senhas
- Validação com Zod em ambas as pontas

### Manutenibilidade
- TypeScript em todo o stack
- Testes unitários com Vitest
- Migrations versionadas do banco

### Developer Experience
- Hot reload no desenvolvimento
- Tipagem forte previne erros
- ESLint e Prettier para código consistente

---

## 📚 Conceitos Educacionais Aplicados

### Gamificação
- Sistema de conclusão de atividades
- Progresso visual de materiais
- Notificações de conquistas

### Gestão Educacional
- Separação clara entre professor e aluno
- Acompanhamento individual de progresso
- Organização por turmas

### Sustentabilidade Digital
- Interface verde e natural
- Foco em educação ambiental
- Plataforma paperless

---

Esta documentação apresenta uma visão completa das tecnologias e conceitos utilizados no projeto SustentaTech, destacando como cada ferramenta contribui para criar uma plataforma educacional robusta, escalável e focada na experiência do usuário.
