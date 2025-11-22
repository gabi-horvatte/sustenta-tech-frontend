# SustentaTech - Guia Completo de Funcionalidades

## 📋 Visão Geral

O **SustentaTech** é uma plataforma educacional completa que oferece diferentes experiências para **Professores** e **Alunos**. Este guia apresenta todas as funcionalidades disponíveis com instruções passo a passo para utilização.

### 🎯 Tipos de Usuário
- **👨‍🏫 Professor**: Acesso ao painel administrativo com ferramentas de gestão
- **👨‍🎓 Aluno**: Acesso ao painel estudantil com atividades e materiais

---

## 🔐 Sistema de Autenticação

### Login na Plataforma

**Passo a passo:**
1. Acesse a página inicial da plataforma
2. Clique em "Entrar" ou acesse `/login`
3. Digite seu **email** e **senha**
4. Clique em "Entrar"

**Redirecionamento automático:**
- **Professores** → `/management/home` (Painel Administrativo)
- **Alunos** → `/student/home` (Painel do Aluno)

**Recursos de segurança:**
- Autenticação via JWT (JSON Web Token)
- Sessão persistente (mantém login após fechar navegador)
- Redirecionamento baseado no tipo de usuário
- Logout seguro com limpeza de dados

---

## 👨‍🏫 Funcionalidades para Professores

### 🏠 Painel Administrativo (`/management/home`)

**Visão geral:**
- Dashboard principal com acesso a todas as funcionalidades
- Navegação intuitiva por cards temáticos
- Botão para cadastro de novos professores

#### Cadastrar Novo Professor

**Passo a passo:**
1. No painel administrativo, clique em **"Cadastrar professor"**
2. Preencha o formulário com:
   - **Nome** (obrigatório)
   - **Sobrenome** (obrigatório)
   - **Email** (obrigatório, deve ser único)
   - **Senha** (obrigatória)
   - **Telefone** (obrigatório)
   - **Data de nascimento** (obrigatória)
   - **Manager** (checkbox para privilégios administrativos)
3. Clique em **"Salvar"**
4. Confirmação: "Professor cadastrado com sucesso"

---

### 🎓 Gestão de Turmas (`/management/classroom`)

#### Visualizar Turmas

**Passo a passo:**
1. No painel administrativo, clique em **"Turmas"**
2. Visualize todas as turmas disponíveis
3. Clique em uma turma específica para ver detalhes

#### Gerenciar Turma Específica (`/management/classroom/:classroomId`)

**Funcionalidades disponíveis:**
- **Aba "Alunos"**: Lista de alunos matriculados
- **Aba "Relatórios"**: Métricas de performance da turma
- **Aba "Configurações"**: Editar informações da turma

**Visualizar Detalhes do Aluno:**
1. Na aba "Alunos", clique em um aluno específico
2. Acesse `/management/classroom/student/:studentId`
3. Visualize:
   - Informações pessoais
   - Atividades atribuídas
   - Materiais estudados
   - Progresso geral

---

### 📝 Gestão de Atividades (`/management/activities`)

#### Interface com Abas
- **Relatórios**: Analytics e métricas de atividades
- **Atividades Atribuídas**: Atividades já criadas e atribuídas
- **Modelos de Atividade**: Templates reutilizáveis

#### Criar Modelo de Atividade (`/management/activity-templates/create`)

**Passo a passo:**
1. Acesse **"Modelos de Atividade"** → **"Criar Novo Modelo"**
2. Preencha informações básicas:
   - **Nome do modelo** (obrigatório)
   - **Descrição** (obrigatória)
3. **Adicionar Questões:**
   - Clique em **"Adicionar Questão"**
   - Digite o **texto da questão**
   - Adicione **opções de resposta** (mínimo 2, máximo 6)
   - Marque a **resposta correta** (botão de rádio)
   - Use **"Adicionar Opção"** para mais alternativas
   - Use **"Remover"** para excluir questões/opções
4. **Organização:**
   - Questões são numeradas automaticamente
   - Opções são ordenadas automaticamente
   - Reordenação automática ao remover itens
5. Clique em **"Salvar Modelo"**

**Recursos avançados:**
- **Preview em tempo real** das questões
- **Validação automática** (mínimo de opções, resposta correta obrigatória)
- **Reutilização** do modelo para múltiplas atividades

#### Visualizar Modelo de Atividade (`/management/activity-templates/:templateId`)

**Funcionalidades:**
- **Visualização completa** do modelo criado
- **Lista de questões** com opções e respostas corretas
- **Informações do criador** e data de criação
- **Botão "Atribuir"** para criar atividade baseada no modelo

#### Atribuir Atividade (`/management/activity-templates/:templateId/assign`)

**Passo a passo:**
1. No modelo desejado, clique em **"Atribuir"**
2. Preencha os dados da atividade:
   - **Nome da atividade** (pode ser diferente do modelo)
   - **Descrição específica**
   - **Turma destinatária** (seleção dropdown)
   - **Data de expiração** (prazo limite)
3. Clique em **"Criar Atividade"**
4. **Notificações automáticas** são enviadas aos alunos

#### Relatórios de Atividades

**Métricas disponíveis:**
- **Overview geral**: Total de atividades, conclusões, pontuação média
- **Rankings de alunos**: Top 10 com pontuações e progresso
- **Performance por turma**: Gráficos comparativos
- **Efetividade das atividades**: Taxa de conclusão e dificuldade
- **Análise de questões**: Questões mais desafiadoras
- **Tendências mensais**: Evolução temporal do desempenho

---

### 📚 Gestão de Materiais (`/management/materials`)

#### Interface com Abas
- **Relatórios**: Analytics de uso de materiais
- **Materiais Atribuídos**: Materiais já distribuídos
- **Biblioteca de Modelos**: Templates de materiais

#### Criar Modelo de Material (`/management/material-templates/create`)

**Passo a passo:**
1. Acesse **"Biblioteca de Modelos"** → **"Criar Novo Modelo"**
2. Preencha as informações:
   - **Nome do material** (obrigatório)
   - **Descrição** (obrigatória)
   - **Autores** (obrigatório)
   - **URL do recurso** (link para vídeo, PDF, site, etc.)
   - **Thumbnail** (imagem de capa - opcional)
   - **Tipo de material** (vídeo, PDF, link, etc.)
3. Clique em **"Salvar Modelo"**

#### Atribuir Material (`/management/material-templates/assign`)

**Passo a passo:**
1. Selecione o modelo desejado
2. Clique em **"Atribuir"**
3. Configure a atribuição:
   - **Turma destinatária**
   - **Data de expiração**
   - **Instruções específicas** (opcional)
4. Clique em **"Atribuir Material"**

#### Acompanhar Progresso (`/management/materials/assignment/:assignmentId`)

**Informações disponíveis:**
- **Lista de alunos** da turma
- **Status de conclusão** por aluno
- **Data de conclusão** (quando aplicável)
- **Estatísticas gerais** da atribuição

---

## 👨‍🎓 Funcionalidades para Alunos

### 🏠 Painel do Aluno (`/student/home`)

**Visão geral:**
- Interface amigável com design focado na experiência do usuário
- Navegação por cards coloridos
- Acesso rápido às principais funcionalidades

**Navegação principal:**
- **Atividades**: Acesso aos quizzes e exercícios
- **Materiais**: Recursos educativos disponíveis
- **Notificações**: Avisos e comunicados

---

### 📝 Atividades do Aluno (`/student/activities`)

#### Visualizar Atividades Disponíveis

**Interface:**
- **Grid de cards** com atividades atribuídas
- **Indicadores visuais** de status:
  - 🟢 **Verde**: Atividade concluída
  - 🟡 **Amarelo**: Atividade pendente (dentro do prazo)
  - 🔴 **Vermelho**: Atividade expirada
- **Ícones de status**:
  - ✅ **Check**: Concluída
  - 🕐 **Relógio**: Pendente/Expirada

#### Realizar Quiz (`/student/quiz/:activityId`)

**Passo a passo:**
1. No card da atividade, clique em **"Iniciar Quiz"**
2. **Interface do quiz:**
   - Questões apresentadas uma por vez
   - Opções de múltipla escolha
   - Botão **"Próxima"** para avançar
   - Botão **"Anterior"** para voltar (se disponível)
3. **Finalização:**
   - Clique em **"Finalizar Quiz"**
   - Confirmação antes do envio
   - **Resultado imediato** com pontuação
4. **Pós-conclusão:**
   - Atividade marcada como concluída automaticamente
   - Botão muda para **"Ver Respostas"**

#### Revisar Respostas (`/student/quiz/:activityId/review`)

**Funcionalidades:**
- **Visualização completa** de todas as questões
- **Suas respostas** vs **respostas corretas**
- **Indicadores visuais**:
  - ✅ **Verde**: Resposta correta
  - ❌ **Vermelho**: Resposta incorreta
- **Pontuação final** e percentual de acerto
- **Feedback educativo** para aprendizado

---

### 📚 Materiais do Aluno (`/student/materials`)

#### Visualizar Materiais Disponíveis

**Interface:**
- **Grid de cards** com materiais atribuídos
- **Informações por material**:
  - Thumbnail (quando disponível)
  - Nome e descrição
  - Autores
  - Tipo de material (vídeo, PDF, etc.)
  - Data de expiração
  - Status de conclusão

#### Estudar Material

**Passo a passo:**
1. Clique no card do material desejado
2. **Opções disponíveis**:
   - **"Acessar Material"**: Abre o recurso em nova aba
   - **"Marcar como Estudado"**: Registra conclusão
3. **Recursos externos**:
   - Links para vídeos do YouTube
   - PDFs para download
   - Sites educativos
   - Outros recursos online

#### Marcar como Concluído

**Processo:**
1. Após estudar o material, clique em **"Marcar como Estudado"**
2. Confirmação: "Material marcado como estudado"
3. **Status visual** muda para concluído
4. **Registro automático** da data de conclusão

---

## 🔔 Sistema de Notificações

### Para Professores
- **Novas atividades criadas** por outros professores
- **Conclusões de atividades** pelos alunos
- **Prazos próximos** de expiração
- **Relatórios semanais** de progresso

### Para Alunos
- **Novas atividades** atribuídas
- **Novos materiais** disponíveis
- **Lembretes de prazo** (atividades próximas do vencimento)
- **Parabenizações** por conclusões

**Recursos:**
- **Badge com contador** no header
- **Marcação de lidas/não lidas**
- **Links diretos** para o conteúdo relacionado
- **Histórico completo** de notificações

---

## 👤 Gerenciamento de Conta (`/account`)

### Informações Pessoais
- **Visualização** de dados do perfil
- **Edição** de informações pessoais:
  - Nome e sobrenome
  - Email (com validação de unicidade)
  - Telefone
  - Data de nascimento

### Configurações de Segurança
- **Alteração de senha**
- **Logout seguro**
- **Exclusão de conta** (com confirmação)

---

## 🎨 Recursos de Interface

### Design System
- **Paleta de cores** focada em sustentabilidade (tons de verde)
- **Componentes reutilizáveis** para consistência
- **Responsividade** para diferentes dispositivos
- **Animações suaves** para melhor experiência

### Navegação
- **Header fixo** com navegação principal
- **Breadcrumbs** para orientação
- **Botões de ação** claramente identificados
- **Estados visuais** para feedback imediato

### Acessibilidade
- **Contraste adequado** para leitura
- **Ícones descritivos** para ações
- **Feedback visual** para interações
- **Navegação por teclado** (quando aplicável)

---

## 📊 Relatórios e Analytics

### Para Professores

#### Relatórios de Atividades
- **Métricas gerais**: Total de atividades, conclusões, pontuação média
- **Rankings**: Top alunos por performance
- **Análise temporal**: Tendências mensais de desempenho
- **Efetividade**: Quais atividades funcionam melhor
- **Dificuldade**: Questões mais desafiadoras para os alunos

#### Relatórios de Materiais
- **Engajamento**: Quais materiais são mais acessados
- **Conclusão**: Taxa de materiais estudados por turma
- **Tipos de conteúdo**: Performance por tipo de material
- **Temporal**: Evolução do uso de materiais

#### Relatórios de Turmas
- **Performance comparativa** entre turmas
- **Progresso individual** dos alunos
- **Identificação** de alunos que precisam de atenção
- **Métricas de engajamento** geral

### Para Alunos

#### Dashboard Pessoal
- **Progresso geral** em atividades e materiais
- **Pontuações** e histórico de performance
- **Conquistas** e marcos alcançados
- **Próximos prazos** e tarefas pendentes

---

## 🔧 Funcionalidades Técnicas

### Performance
- **Carregamento otimizado** com lazy loading
- **Cache inteligente** para dados frequentes
- **Compressão** de imagens e recursos
- **Minificação** de código para velocidade

### Segurança
- **Autenticação JWT** com expiração
- **Validação** de dados no frontend e backend
- **Sanitização** de inputs do usuário
- **Proteção** contra ataques comuns (XSS, CSRF)

### Compatibilidade
- **Navegadores modernos** (Chrome, Firefox, Safari, Edge)
- **Dispositivos móveis** com design responsivo
- **Diferentes resoluções** de tela
- **Conexões lentas** com otimizações

---

## 🚀 Fluxos de Trabalho Completos

### Fluxo: Professor Cria e Atribui Atividade

1. **Login** como professor
2. **Navegar** para `/management/activities`
3. **Criar modelo**:
   - Ir para "Modelos de Atividade"
   - Clicar "Criar Novo Modelo"
   - Preencher nome e descrição
   - Adicionar questões com opções
   - Marcar respostas corretas
   - Salvar modelo
4. **Atribuir atividade**:
   - Clicar "Atribuir" no modelo
   - Escolher turma e definir prazo
   - Criar atividade
5. **Acompanhar progresso**:
   - Ver relatórios em tempo real
   - Analisar performance dos alunos

### Fluxo: Aluno Realiza Atividade

1. **Login** como aluno
2. **Receber notificação** de nova atividade
3. **Navegar** para `/student/activities`
4. **Realizar quiz**:
   - Clicar "Iniciar Quiz"
   - Responder questões
   - Finalizar e ver resultado
5. **Revisar respostas**:
   - Clicar "Ver Respostas"
   - Estudar feedback
   - Aprender com erros

### Fluxo: Gestão de Materiais

1. **Professor cria modelo** de material
2. **Atribui para turma** com prazo
3. **Alunos recebem notificação**
4. **Alunos acessam material** externo
5. **Alunos marcam como estudado**
6. **Professor acompanha progresso**

---

## 💡 Dicas de Uso

### Para Professores
- **Organize modelos** por tema para reutilização
- **Defina prazos realistas** para atividades
- **Monitore relatórios** regularmente para identificar dificuldades
- **Use variedade** de tipos de material para engajar alunos
- **Forneça feedback** baseado nos resultados dos quizzes

### Para Alunos
- **Verifique notificações** regularmente
- **Organize seu tempo** baseado nos prazos
- **Revise respostas** incorretas para aprender
- **Explore materiais** complementares
- **Comunique dificuldades** aos professores

### Gerais
- **Mantenha dados atualizados** no perfil
- **Use senhas seguras** para proteção
- **Reporte problemas** técnicos quando encontrar
- **Aproveite recursos** de acessibilidade disponíveis

---

*Este guia apresenta todas as funcionalidades disponíveis na plataforma SustentaTech. Para suporte técnico ou dúvidas específicas, entre em contato com a equipe de desenvolvimento.*

