# 👨‍👩‍👧‍👦 Family Organizer - Backend API

API REST para gerenciamento de organização familiar, desenvolvida com Node.js, Express e Prisma.

## 📋 Sobre o Projeto

O Family Organizer é uma aplicação backend completa para ajudar famílias a organizarem sua rotina, permitindo gerenciar consultas médicas, eventos, anotações, locais importantes, álbuns de fotos e muito mais, tudo de forma compartilhada entre membros de um grupo familiar.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados (desenvolvimento)
- **JWT** - Autenticação via tokens
- **bcryptjs** - Criptografia de senhas
- **CORS** - Habilitação de requisições cross-origin

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd BackEnd-family-organizer
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (crie um arquivo `.env`):
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua-chave-secreta-aqui"
PORT=4000
```

4. Gere o Prisma Client:
```bash
npx prisma generate
```

5. Execute as migrations:
```bash
npx prisma migrate dev
```

6. (Opcional) Execute o seed para popular o banco de dados:
```bash
npm run prisma:seed
```

7. Inicie o servidor:
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:4000`

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. Após o login ou registro, você receberá um token que deve ser incluído no header de todas as requisições protegidas:

```
Authorization: Bearer seu-token-aqui
```

## 📚 Documentação das Rotas

### Base URL
```
http://localhost:4000
```

---

## 🔓 Rotas Públicas

### Autenticação (`/auth`)

#### 1. **Listar Todos os Usuários**
```http
GET /auth
```
**Descrição:** Retorna todos os usuários cadastrados.

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "gender": "masculino",
    "createdAt": "2025-10-01T10:00:00.000Z",
    "updatedAt": "2025-10-01T10:00:00.000Z"
  }
]
```

---

#### 2. **Registrar Novo Usuário**
```http
POST /auth/register
```
**Descrição:** Cria uma nova conta de usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "gender": "masculino"  // opcional: "masculino", "feminino" ou "outro"
}
```

**Resposta de Sucesso (201):**
```json
{
  "message": "Usuário criado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "gender": "masculino",
    "createdAt": "2025-10-01T10:00:00.000Z",
    "updatedAt": "2025-10-01T10:00:00.000Z"
  }
}
```

**Erros:**
- `400`: Campos obrigatórios faltando ou gênero inválido
- `400`: Email já está em uso
- `500`: Erro interno do servidor

---

#### 3. **Login**
```http
POST /auth/login
```
**Descrição:** Realiza login e retorna token de autenticação.

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Login realizado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "gender": "masculino",
    "createdAt": "2025-10-01T10:00:00.000Z",
    "updatedAt": "2025-10-01T10:00:00.000Z"
  }
}
```

**Erros:**
- `400`: Campos obrigatórios faltando
- `401`: Credenciais inválidas
- `500`: Erro interno do servidor

---

## 🔒 Rotas Protegidas

> **Todas as rotas abaixo requerem autenticação via token JWT no header.**

---

## 👨‍👩‍👧 Grupos Familiares (`/family-groups`)

#### 1. **Listar Grupos do Usuário**
```http
GET /family-groups
```
**Descrição:** Retorna todos os grupos familiares que o usuário pertence.

**Resposta de Sucesso (200):**
```json
{
  "message": "Grupos familiares obtidos com sucesso",
  "familyGroups": [
    {
      "id": 1,
      "name": "Família Silva",
      "inviteCode": "ABC123XYZ",
      "role": "admin",
      "createdAt": "2025-10-01T10:00:00.000Z",
      "members": [...]
    }
  ]
}
```

---

#### 2. **Obter Detalhes de um Grupo**
```http
GET /family-groups/:id
```
**Descrição:** Retorna informações detalhadas de um grupo específico.

**Parâmetros de URL:**
- `id` - ID do grupo familiar

**Resposta de Sucesso (200):**
```json
{
  "message": "Grupo familiar obtido com sucesso",
  "familyGroup": {
    "id": 1,
    "name": "Família Silva",
    "inviteCode": "ABC123XYZ",
    "members": [
      {
        "id": 1,
        "userId": 1,
        "role": "admin",
        "user": {
          "id": 1,
          "name": "João Silva",
          "email": "joao@email.com"
        }
      }
    ],
    "createdAt": "2025-10-01T10:00:00.000Z"
  }
}
```

**Erros:**
- `403`: Usuário não é membro do grupo
- `404`: Grupo não encontrado

---

#### 3. **Criar Novo Grupo Familiar**
```http
POST /family-groups
```
**Descrição:** Cria um novo grupo familiar. O criador se torna automaticamente admin.

**Body:**
```json
{
  "name": "Família Silva"
}
```

**Resposta de Sucesso (201):**
```json
{
  "message": "Grupo familiar criado com sucesso",
  "familyGroup": {
    "id": 1,
    "name": "Família Silva",
    "inviteCode": "ABC123XYZ",
    "createdAt": "2025-10-01T10:00:00.000Z"
  }
}
```

**Erros:**
- `400`: Nome do grupo é obrigatório

---

#### 4. **Entrar em um Grupo (via código de convite)**
```http
POST /family-groups/join
```
**Descrição:** Permite entrar em um grupo familiar usando código de convite.

**Body:**
```json
{
  "inviteCode": "ABC123XYZ"
}
```

**Resposta de Sucesso (201):**
```json
{
  "message": "Você se juntou ao grupo familiar com sucesso",
  "member": {
    "id": 2,
    "userId": 2,
    "familyGroupId": 1,
    "role": "member"
  },
  "familyGroup": {
    "id": 1,
    "name": "Família Silva"
  }
}
```

**Erros:**
- `400`: Código de convite obrigatório
- `400`: Usuário já é membro do grupo
- `404`: Código de convite inválido

---

#### 5. **Atualizar Grupo Familiar** (apenas admin)
```http
PUT /family-groups/:id
```
**Descrição:** Atualiza informações do grupo (apenas administradores).

**Parâmetros de URL:**
- `id` - ID do grupo familiar

**Body:**
```json
{
  "name": "Novo Nome do Grupo"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Grupo familiar atualizado com sucesso",
  "familyGroup": {
    "id": 1,
    "name": "Novo Nome do Grupo",
    "updatedAt": "2025-10-02T10:00:00.000Z"
  }
}
```

**Erros:**
- `403`: Apenas administradores podem atualizar
- `404`: Grupo não encontrado

---

#### 6. **Gerar Novo Código de Convite** (apenas admin)
```http
PUT /family-groups/:id/regenerate-invite
```
**Descrição:** Gera um novo código de convite para o grupo.

**Parâmetros de URL:**
- `id` - ID do grupo familiar

**Resposta de Sucesso (200):**
```json
{
  "message": "Novo código de convite gerado com sucesso",
  "inviteCode": "XYZ789ABC"
}
```

**Erros:**
- `403`: Apenas administradores podem gerar novo código

---

#### 7. **Remover Membro do Grupo** (apenas admin)
```http
DELETE /family-groups/:id/members/:memberId
```
**Descrição:** Remove um membro do grupo familiar.

**Parâmetros de URL:**
- `id` - ID do grupo familiar
- `memberId` - ID do usuário a ser removido

**Resposta de Sucesso (200):**
```json
{
  "message": "Membro removido com sucesso"
}
```

**Erros:**
- `403`: Apenas administradores podem remover membros
- `400`: Não pode remover a si mesmo

---

#### 8. **Sair do Grupo**
```http
DELETE /family-groups/:id/leave
```
**Descrição:** Permite que o usuário saia do grupo familiar.

**Parâmetros de URL:**
- `id` - ID do grupo familiar

**Resposta de Sucesso (200):**
```json
{
  "message": "Você saiu do grupo familiar com sucesso"
}
```

**Erros:**
- `400`: Admin deve transferir administração antes de sair (se houver outros membros)

---

#### 9. **Excluir Grupo Familiar** (apenas admin)
```http
DELETE /family-groups/:id
```
**Descrição:** Exclui permanentemente o grupo familiar.

**Parâmetros de URL:**
- `id` - ID do grupo familiar

**Resposta de Sucesso (200):**
```json
{
  "message": "Grupo familiar excluído com sucesso"
}
```

**Erros:**
- `403`: Apenas administradores podem excluir o grupo

---

## 🏥 Consultas Médicas (`/appointments`)

#### 1. **Listar Consultas do Grupo**
```http
GET /appointments/group/:familyGroupId
```
**Descrição:** Retorna todas as consultas médicas de um grupo familiar.

**Parâmetros de URL:**
- `familyGroupId` - ID do grupo familiar

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "title": "Consulta Cardiologista",
    "doctor": "Dr. Carlos Santos",
    "location": "Hospital Santa Maria",
    "date": "2025-10-15T00:00:00.000Z",
    "time": "14:30",
    "description": "Consulta de rotina",
    "familyGroupId": 1,
    "createdAt": "2025-10-01T10:00:00.000Z",
    "updatedAt": "2025-10-01T10:00:00.000Z"
  }
]
```

---

#### 2. **Listar Próximas Consultas** (próximos 30 dias)
```http
GET /appointments/group/:familyGroupId/upcoming
```
**Descrição:** Retorna consultas agendadas para os próximos 30 dias.

**Parâmetros de URL:**
- `familyGroupId` - ID do grupo familiar

---

#### 3. **Obter Consulta por ID**
```http
GET /appointments/:id
```
**Descrição:** Retorna detalhes de uma consulta específica.

**Parâmetros de URL:**
- `id` - ID da consulta

---

#### 4. **Criar Nova Consulta**
```http
POST /appointments
```
**Descrição:** Cadastra uma nova consulta médica.

**Body:**
```json
{
  "title": "Consulta Cardiologista",
  "doctor": "Dr. Carlos Santos",
  "location": "Hospital Santa Maria",
  "date": "2025-10-15",
  "time": "14:30",
  "description": "Consulta de rotina",
  "familyGroupId": 1
}
```

**Resposta de Sucesso (201):**
```json
{
  "message": "Consulta criada com sucesso",
  "appointment": { ... }
}
```

---

#### 5. **Atualizar Consulta**
```http
PUT /appointments/:id
```
**Descrição:** Atualiza informações de uma consulta.

**Parâmetros de URL:**
- `id` - ID da consulta

**Body:** (mesma estrutura do criar, campos opcionais)

---

#### 6. **Excluir Consulta**
```http
DELETE /appointments/:id
```
**Descrição:** Remove uma consulta do sistema.

**Parâmetros de URL:**
- `id` - ID da consulta

---

#### 7. **Buscar Consultas por Data**
```http
GET /appointments/group/:familyGroupId/date?date=2025-10-15
```
**Descrição:** Busca consultas em uma data específica.

**Parâmetros de URL:**
- `familyGroupId` - ID do grupo familiar

**Query Parameters:**
- `date` - Data no formato YYYY-MM-DD

---

#### 8. **Buscar Consultas por Médico**
```http
GET /appointments/group/:familyGroupId/doctor?doctor=Carlos
```
**Descrição:** Busca consultas por nome do médico.

**Parâmetros de URL:**
- `familyGroupId` - ID do grupo familiar

**Query Parameters:**
- `doctor` - Nome ou parte do nome do médico

---

## 🎉 Eventos (`/events`)

#### 1. **Listar Eventos do Grupo**
```http
GET /events/group/:familyGroupId
```
**Descrição:** Retorna todos os eventos de um grupo familiar.

**Parâmetros de URL:**
- `familyGroupId` - ID do grupo familiar

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "title": "Aniversário da Maria",
    "description": "Festa de 10 anos",
    "date": "2025-11-20T00:00:00.000Z",
    "time": "15:00",
    "location": "Casa da Vovó",
    "type": "aniversario",
    "familyGroupId": 1,
    "createdAt": "2025-10-01T10:00:00.000Z",
    "updatedAt": "2025-10-01T10:00:00.000Z"
  }
]
```

**Tipos de eventos:**
- `aniversario` - Aniversários
- `reuniao` - Reuniões familiares
- `viagem` - Viagens
- `outro` - Outros eventos

---

#### 2. **Listar Próximos Eventos** (próximos 30 dias)
```http
GET /events/group/:familyGroupId/upcoming
```
**Descrição:** Retorna eventos agendados para os próximos 30 dias.

---

#### 3. **Obter Evento por ID**
```http
GET /events/:id
```
**Descrição:** Retorna detalhes de um evento específico.

---

#### 4. **Criar Novo Evento**
```http
POST /events
```
**Descrição:** Cadastra um novo evento.

**Body:**
```json
{
  "title": "Aniversário da Maria",
  "description": "Festa de 10 anos",
  "date": "2025-11-20",
  "time": "15:00",
  "location": "Casa da Vovó",
  "type": "aniversario",
  "familyGroupId": 1
}
```

---

#### 5. **Atualizar Evento**
```http
PUT /events/:id
```
**Descrição:** Atualiza informações de um evento.

---

#### 6. **Excluir Evento**
```http
DELETE /events/:id
```
**Descrição:** Remove um evento do sistema.

---

#### 7. **Buscar Eventos por Data**
```http
GET /events/group/:familyGroupId/date?date=2025-11-20
```
**Descrição:** Busca eventos em uma data específica.

---

#### 8. **Buscar Eventos por Tipo**
```http
GET /events/group/:familyGroupId/type?type=aniversario
```
**Descrição:** Busca eventos por tipo.

**Query Parameters:**
- `type` - Tipo do evento (aniversario, reuniao, viagem, outro)

---

#### 9. **Obter Aniversários do Mês**
```http
GET /events/group/:familyGroupId/birthdays
```
**Descrição:** Retorna todos os aniversários do mês atual.

---

## 📝 Anotações (`/notes`)

#### 1. **Listar Anotações do Grupo**
```http
GET /notes/group/:familyGroupId
```
**Descrição:** Retorna todas as anotações de um grupo familiar.

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "title": "Lista de Compras",
    "content": "Arroz, feijão, macarrão...",
    "priority": "normal",
    "familyGroupId": 1,
    "createdAt": "2025-10-01T10:00:00.000Z",
    "updatedAt": "2025-10-01T10:00:00.000Z"
  }
]
```

**Níveis de prioridade:**
- `baixa` - Prioridade baixa
- `normal` - Prioridade normal (padrão)
- `alta` - Prioridade alta

---

#### 2. **Listar Anotações por Prioridade**
```http
GET /notes/group/:familyGroupId/priority?priority=alta
```
**Descrição:** Retorna anotações filtradas por prioridade.

**Query Parameters:**
- `priority` - Nível de prioridade (baixa, normal, alta)

---

#### 3. **Obter Anotação por ID**
```http
GET /notes/:id
```
**Descrição:** Retorna detalhes de uma anotação específica.

---

#### 4. **Criar Nova Anotação**
```http
POST /notes
```
**Descrição:** Cadastra uma nova anotação.

**Body:**
```json
{
  "title": "Lista de Compras",
  "content": "Arroz, feijão, macarrão, leite, pão",
  "priority": "normal",
  "familyGroupId": 1
}
```

---

#### 5. **Atualizar Anotação**
```http
PUT /notes/:id
```
**Descrição:** Atualiza informações de uma anotação.

---

#### 6. **Excluir Anotação**
```http
DELETE /notes/:id
```
**Descrição:** Remove uma anotação do sistema.

---

#### 7. **Buscar Anotações**
```http
GET /notes/group/:familyGroupId/search?query=compras
```
**Descrição:** Busca anotações por termo no título ou conteúdo.

**Query Parameters:**
- `query` - Termo de busca

---

#### 8. **Obter Anotações de Alta Prioridade**
```http
GET /notes/group/:familyGroupId/high-priority
```
**Descrição:** Retorna apenas anotações marcadas como alta prioridade.

---

## 📍 Locais Importantes (`/places`)

#### 1. **Listar Locais do Grupo**
```http
GET /places/group/:familyGroupId
```
**Descrição:** Retorna todos os locais importantes de um grupo familiar.

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "name": "Hospital São Lucas",
    "address": "Rua das Flores, 123",
    "type": "hospital",
    "phone": "(11) 98765-4321",
    "notes": "Atendimento 24h",
    "familyGroupId": 1,
    "createdAt": "2025-10-01T10:00:00.000Z",
    "updatedAt": "2025-10-01T10:00:00.000Z"
  }
]
```

**Tipos de locais:**
- `hospital` - Hospitais e clínicas
- `escola` - Escolas
- `mercado` - Supermercados
- `outro` - Outros locais

---

#### 2. **Listar Locais por Tipo**
```http
GET /places/group/:familyGroupId/type?type=hospital
```
**Descrição:** Retorna locais filtrados por tipo.

**Query Parameters:**
- `type` - Tipo do local (hospital, escola, mercado, outro)

---

#### 3. **Obter Local por ID**
```http
GET /places/:id
```
**Descrição:** Retorna detalhes de um local específico.

---

#### 4. **Criar Novo Local**
```http
POST /places
```
**Descrição:** Cadastra um novo local importante.

**Body:**
```json
{
  "name": "Hospital São Lucas",
  "address": "Rua das Flores, 123",
  "type": "hospital",
  "phone": "(11) 98765-4321",
  "notes": "Atendimento 24h",
  "familyGroupId": 1
}
```

---

#### 5. **Atualizar Local**
```http
PUT /places/:id
```
**Descrição:** Atualiza informações de um local.

---

#### 6. **Excluir Local**
```http
DELETE /places/:id
```
**Descrição:** Remove um local do sistema.

---

#### 7. **Buscar Locais**
```http
GET /places/group/:familyGroupId/search?query=hospital
```
**Descrição:** Busca locais por nome ou endereço.

**Query Parameters:**
- `query` - Termo de busca

---

#### 8. **Obter Tipos de Locais**
```http
GET /places/group/:familyGroupId/types
```
**Descrição:** Retorna lista única de tipos de locais cadastrados no grupo.

---

## 📷 Álbuns de Fotos (`/albums`)

#### 1. **Listar Álbuns do Grupo**
```http
GET /albums/group/:familyGroupId
```
**Descrição:** Retorna todos os álbuns de fotos de um grupo familiar.

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "name": "Férias 2025",
    "description": "Viagem para a praia",
    "familyGroupId": 1,
    "photos": [...],
    "createdAt": "2025-10-01T10:00:00.000Z",
    "updatedAt": "2025-10-01T10:00:00.000Z"
  }
]
```

---

#### 2. **Obter Álbum por ID**
```http
GET /albums/:id
```
**Descrição:** Retorna detalhes de um álbum específico com suas fotos.

---

#### 3. **Criar Novo Álbum**
```http
POST /albums
```
**Descrição:** Cria um novo álbum de fotos.

**Body:**
```json
{
  "name": "Férias 2025",
  "description": "Viagem para a praia",
  "familyGroupId": 1
}
```

---

#### 4. **Atualizar Álbum**
```http
PUT /albums/:id
```
**Descrição:** Atualiza informações de um álbum.

---

#### 5. **Excluir Álbum**
```http
DELETE /albums/:id
```
**Descrição:** Remove um álbum do sistema (as fotos não são excluídas, apenas desvinculadas).

---

#### 6. **Buscar Álbuns**
```http
GET /albums/group/:familyGroupId/search?query=ferias
```
**Descrição:** Busca álbuns por nome.

**Query Parameters:**
- `query` - Termo de busca

---

#### 7. **Obter Álbuns Recentes** (últimos 30 dias)
```http
GET /albums/group/:familyGroupId/recent
```
**Descrição:** Retorna álbuns criados nos últimos 30 dias.

---

## 🖼️ Fotos (`/photos`)

#### 1. **Listar Fotos do Grupo**
```http
GET /photos/group/:familyGroupId
```
**Descrição:** Retorna todas as fotos de um grupo familiar.

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "title": "Pôr do sol na praia",
    "url": "https://exemplo.com/foto.jpg",
    "description": "Linda vista",
    "familyGroupId": 1,
    "albumId": 1,
    "createdAt": "2025-10-01T10:00:00.000Z",
    "updatedAt": "2025-10-01T10:00:00.000Z"
  }
]
```

---

#### 2. **Listar Fotos Sem Álbum**
```http
GET /photos/group/:familyGroupId/without-album
```
**Descrição:** Retorna fotos que não estão em nenhum álbum.

---

#### 3. **Listar Fotos de um Álbum**
```http
GET /photos/album/:albumId
```
**Descrição:** Retorna todas as fotos de um álbum específico.

**Parâmetros de URL:**
- `albumId` - ID do álbum

---

#### 4. **Obter Foto por ID**
```http
GET /photos/:id
```
**Descrição:** Retorna detalhes de uma foto específica.

---

#### 5. **Criar Nova Foto**
```http
POST /photos
```
**Descrição:** Adiciona uma nova foto.

**Body:**
```json
{
  "title": "Pôr do sol na praia",
  "url": "https://exemplo.com/foto.jpg",
  "description": "Linda vista",
  "familyGroupId": 1,
  "albumId": 1  // opcional
}
```

---

#### 6. **Atualizar Foto**
```http
PUT /photos/:id
```
**Descrição:** Atualiza informações de uma foto.

---

#### 7. **Mover Foto para Álbum**
```http
PUT /photos/:id/move
```
**Descrição:** Move uma foto para um álbum diferente.

**Body:**
```json
{
  "albumId": 2  // ou null para remover do álbum
}
```

---

#### 8. **Excluir Foto**
```http
DELETE /photos/:id
```
**Descrição:** Remove uma foto do sistema.

---

#### 9. **Buscar Fotos**
```http
GET /photos/group/:familyGroupId/search?query=praia
```
**Descrição:** Busca fotos por título ou descrição.

**Query Parameters:**
- `query` - Termo de busca

---

#### 10. **Obter Fotos Recentes** (últimos 30 dias)
```http
GET /photos/group/:familyGroupId/recent
```
**Descrição:** Retorna fotos adicionadas nos últimos 30 dias.

---

## 📊 Dashboard (`/dashboard`)

#### 1. **Obter Resumo do Dashboard**
```http
GET /dashboard/group/:familyGroupId
```
**Descrição:** Retorna um resumo completo de todas as informações do grupo.

**Parâmetros de URL:**
- `familyGroupId` - ID do grupo familiar

**Resposta de Sucesso (200):**
```json
{
  "message": "Dashboard obtido com sucesso",
  "summary": {
    "upcomingAppointments": [...],
    "upcomingEvents": [...],
    "highPriorityNotes": [...],
    "recentPhotos": [...],
    "stats": {
      "totalMembers": 5,
      "totalAppointments": 12,
      "totalEvents": 8,
      "totalNotes": 15,
      "totalPlaces": 10,
      "totalPhotos": 50,
      "totalAlbums": 5
    }
  }
}
```

---

#### 2. **Obter Agenda do Dia**
```http
GET /dashboard/group/:familyGroupId/today
```
**Descrição:** Retorna compromissos e eventos do dia atual.

**Resposta de Sucesso (200):**
```json
{
  "message": "Agenda do dia obtida com sucesso",
  "today": {
    "date": "2025-10-06",
    "appointments": [...],
    "events": [...]
  }
}
```

---

#### 3. **Obter Estatísticas do Grupo**
```http
GET /dashboard/group/:familyGroupId/stats
```
**Descrição:** Retorna estatísticas gerais do grupo familiar.

**Resposta de Sucesso (200):**
```json
{
  "message": "Estatísticas obtidas com sucesso",
  "stats": {
    "totalMembers": 5,
    "totalAppointments": 12,
    "totalEvents": 8,
    "totalNotes": 15,
    "totalPlaces": 10,
    "totalPhotos": 50,
    "totalAlbums": 5,
    "upcomingAppointments": 3,
    "upcomingEvents": 2,
    "highPriorityNotes": 4
  }
}
```

---

## 📋 Modelo de Dados

### User (Usuário)
```javascript
{
  id: Integer,
  name: String,
  email: String (único),
  password: String (criptografada),
  gender: String, // "masculino", "feminino", "outro"
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### FamilyGroup (Grupo Familiar)
```javascript
{
  id: Integer,
  name: String,
  inviteCode: String (único),
  members: Array<FamilyGroupMember>,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### FamilyGroupMember (Membro do Grupo)
```javascript
{
  id: Integer,
  userId: Integer,
  familyGroupId: Integer,
  role: String, // "admin" ou "member"
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Appointment (Consulta Médica)
```javascript
{
  id: Integer,
  title: String,
  doctor: String,
  location: String,
  date: DateTime,
  time: String,
  description: String,
  familyGroupId: Integer,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Event (Evento)
```javascript
{
  id: Integer,
  title: String,
  description: String,
  date: DateTime,
  time: String,
  location: String,
  type: String, // "aniversario", "reuniao", "viagem", "outro"
  familyGroupId: Integer,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Note (Anotação)
```javascript
{
  id: Integer,
  title: String,
  content: String,
  priority: String, // "baixa", "normal", "alta"
  familyGroupId: Integer,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Place (Local)
```javascript
{
  id: Integer,
  name: String,
  address: String,
  type: String, // "hospital", "escola", "mercado", "outro"
  phone: String,
  notes: String,
  familyGroupId: Integer,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Album (Álbum)
```javascript
{
  id: Integer,
  name: String,
  description: String,
  familyGroupId: Integer,
  photos: Array<Photo>,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Photo (Foto)
```javascript
{
  id: Integer,
  title: String,
  url: String,
  description: String,
  familyGroupId: Integer,
  albumId: Integer,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

---

## 🔒 Segurança

- **Autenticação JWT**: Todas as rotas protegidas requerem token válido
- **Senhas Criptografadas**: Bcrypt com salt rounds
- **Validação de Permissões**: Verificação de membro/admin em operações sensíveis
- **CORS Habilitado**: Permite requisições de diferentes origens

---

## 🚨 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso - Operação realizada com sucesso |
| 201 | Criado - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos ou faltando |
| 401 | Não Autorizado - Token inválido ou expirado |
| 403 | Proibido - Sem permissão para esta operação |
| 404 | Não Encontrado - Recurso não existe |
| 500 | Erro Interno - Erro no servidor |

---

## 📱 Exemplos de Uso

### Fluxo Completo de Autenticação e Uso

#### 1. Registrar um novo usuário
```bash
POST /auth/register
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "gender": "masculino"
}
```

#### 2. Fazer login (ou usar o token recebido no registro)
```bash
POST /auth/login
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

#### 3. Criar um grupo familiar (usando o token recebido)
```bash
POST /family-groups
Authorization: Bearer SEU_TOKEN_AQUI
{
  "name": "Família Silva"
}
```

#### 4. Compartilhar código de convite com familiares
O código de convite (`inviteCode`) é retornado na criação do grupo.

#### 5. Outros membros entram no grupo
```bash
POST /family-groups/join
Authorization: Bearer TOKEN_DO_OUTRO_USUARIO
{
  "inviteCode": "ABC123XYZ"
}
```

#### 6. Criar conteúdo no grupo
Agora todos os membros podem criar consultas, eventos, anotações, etc.

---

## 🛠️ Scripts Disponíveis

```json
{
  "dev": "nodemon src/server.js",
  "prisma:seed": "node prisma/seed/seed.js"
}
```

- **npm run dev**: Inicia o servidor em modo de desenvolvimento
- **npm run prisma:seed**: Popula o banco de dados com dados de exemplo

---

## 🔧 Comandos Prisma Úteis

```bash
# Gerar Prisma Client
npx prisma generate

# Criar uma nova migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
npx prisma migrate deploy

# Abrir Prisma Studio (visualizar dados)
npx prisma studio

# Resetar banco de dados
npx prisma migrate reset
```

---

## 📝 Observações Importantes

1. **Grupos Familiares**: Cada usuário pode pertencer a múltiplos grupos familiares.
2. **Roles**: Existem dois tipos de membros - `admin` (pode gerenciar grupo) e `member` (uso padrão).
3. **Cascade Delete**: Ao excluir um grupo familiar, todos os dados relacionados (consultas, eventos, etc.) são excluídos.
4. **Tokens JWT**: Tokens expiram em 24 horas. Após isso, é necessário fazer login novamente.
5. **Códigos de Convite**: São únicos por grupo e podem ser regenerados por administradores.

---

## 🤝 Integração com Frontend

### Headers Necessários

Para todas as requisições:
```javascript
headers: {
  'Content-Type': 'application/json'
}
```

Para rotas protegidas:
```javascript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}
```

### Exemplo de Integração (JavaScript/Fetch)

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:4000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    // Salvar token no localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  
  return data;
};

// Buscar grupos familiares
const getMyGroups = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:4000/family-groups', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};

// Criar consulta
const createAppointment = async (appointmentData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:4000/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(appointmentData)
  });
  
  return await response.json();
};
```

---

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com:
- **Autor**: Pablo Delgado
- **Email**: [seu-email@exemplo.com]
- **GitHub**: [@pablodelgado26](https://github.com/pablodelgado26)

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

---

**Desenvolvido com ❤️ para ajudar famílias a se organizarem melhor!**
