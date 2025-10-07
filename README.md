# 👨‍👩‍👧‍👦 Family Organizer - Backend API Completo

[![Prisma](https://img.shields.io/badge/Prisma-6.16.3-blueviolet.svg)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📑 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Características Principais](#-características-principais)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação)
- [Rotas da API](#-rotas-da-api)
  - [Autenticação](#1-autenticação-auth)
  - [Perfil de Usuário](#2-perfil-de-usuário-users)
  - [Grupos Familiares](#3-grupos-familiares-family-groups)
  - [Consultas Médicas](#4-consultas-médicas-appointments)
  - [Eventos](#5-eventos-events)
  - [Anotações](#6-anotações-notes)
  - [Locais Importantes](#7-locais-importantes-places)
  - [Álbuns](#8-álbuns-albums)
  - [Fotos](#9-fotos-photos)
  - [Dashboard](#10-dashboard-dashboard)
- [Modelo de Dados](#-modelo-de-dados)
- [Segurança](#-segurança)
- [Códigos de Status HTTP](#-códigos-de-status-http)
- [Exemplos de Uso](#-exemplos-de-uso)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Comandos Prisma Úteis](#-comandos-prisma-úteis)
- [Observações Importantes](#-observações-importantes)
- [Integração com Frontend](#-integração-com-frontend)
- [Suporte](#-suporte)
- [Licença](#-licença)

---

---

## 📋 Sobre o Projeto

O **Family Organizer** é uma API backend robusta e completa para gerenciamento de organização familiar. Permite que famílias organizem sua rotina de forma compartilhada, com suporte a:

- 👥 **Múltiplas famílias por usuário** - Um usuário pode participar de várias famílias
- 🔐 **Sistema de roles** - Admins e membros com permissões diferentes
- 📸 **Upload de fotos de perfil** - Sistema completo de upload com validação
- ⏱️ **Códigos temporários** - Convites com 15 minutos de validade
- 📝 **Organização completa** - Consultas, eventos, notas, locais, fotos e álbuns
- 🏷️ **Categorização avançada** - Notas com categorias e autores
- 🔒 **Segurança** - JWT, senhas criptografadas, validações completas

---

## ✨ Características Principais

### 🏠 Sistema Multi-Família
- Um usuário pode criar múltiplas famílias (sempre como admin)
- Um usuário pode participar de múltiplas famílias (como admin ou membro)
- Cada família tem seus próprios dados isolados
- Sistema de roles (admin/member) por família

### 🎫 Sistema de Convites
- **Código Permanente**: 9 caracteres, nunca expira
- **Código Temporário**: 6 caracteres, expira em 15 minutos
- Regeneração de códigos por admins

- Upload de foto de perfil com Multer
- Validação: JPEG, PNG, GIF (máx 5MB)
- Armazenamento local com nome único
- Remoção automática de foto antiga
- Servir arquivos estaticamente
- 6 categorias: compras, escola, trabalho, saúde, finanças, geral
- 3 prioridades: baixa, normal, alta
- Rastreamento de autor (quem criou)
- Busca por texto, categoria e prioridade

### 🔐 Segurança
- Autenticação JWT com tokens
- Senhas criptografadas com bcryptjs
- Validação de membros em todas as rotas
- Verificação de permissões (admin/member)
- CORS configurado

---

## 🚀 Tecnologias

### Core
- **Node.js** ^18.0.0 - Runtime JavaScript
- **Express** 5.1.0 - Framework web minimalista
- **Prisma** 6.16.3 - ORM moderno para Node.js
- **SQLite** - Banco de dados (desenvolvimento)

### Autenticação e Segurança
- **jsonwebtoken** 9.0.2 - Geração e validação de JWT
- **bcryptjs** 3.0.2 - Criptografia de senhas

### Upload e Arquivos
- **Multer** 2.0.2 - Middleware para upload de arquivos

### Utilitários
- **cors** 2.8.5 - Habilitar CORS
- **dotenv** 16.4.7 - Variáveis de ambiente
- **nodemon** 3.1.9 - Auto-reload em desenvolvimento

---

## 🏗️ Arquitetura

```
BackEnd-family-organizer/
│
├── prisma/
│   ├── schema.prisma
│   ├── prisma.js
│   ├── dev.db
│   ├── migrations/
│   └── seed/
│       └── seed.js
│
├── src/
│   ├── server.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── familyGroupController.js
│   │   ├── appointmentController.js
│   │   ├── eventController.js
│   │   ├── noteController.js
│   │   ├── placeController.js
│   │   ├── albumController.js
│   │   ├── photoController.js
│   │   └── dashboardController.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── familyGroupModel.js
│   │   ├── appointmentModel.js
│   │   ├── eventModel.js
│   │   ├── noteModel.js
│   │   ├── placeModel.js
│   │   ├── albumModel.js
│   │   └── photoModel.js
│   ├── routes/
│   │   ├── index.routes.js
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── familyGroup.routes.js
│   │   ├── appointment.routes.js
│   │   ├── event.routes.js
│   │   ├── note.routes.js
│   │   ├── place.routes.js
│   │   ├── album.routes.js
│   │   ├── photo.routes.js
│   │   └── dashboard.routes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   └── uploads/
│       └── profiles/
│
├── uploads/
│   └── profiles/
├── .env
├── package.json
└── README.md
```

### Padrão MVC (Model-View-Controller)

- **Models**: Lógica de acesso aos dados (Prisma)
- **Controllers**: Lógica de negócio e validações

---

---

## 📦 Instalação

### Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/pablodelgado26/BackEnd-family-organizer.git
cd BackEnd-family-organizer
```

2. **Instale as dependências**
```bash
npm install
```
3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de Dados
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="sua-chave-secreta-super-segura-aqui"
# Servidor
PORT=4000
```

4. **Configure o banco de dados**

```bash
# Gerar Prisma Client
npx prisma generate

# Executar migrations
npx prisma migrate dev

# (Opcional) Popular com dados de exemplo
npm run prisma:seed
```

5. **Inicie o servidor**

```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

O servidor estará rodando em `http://localhost:4000`

---

## 🛣️ Rotas da API

**Base URL**: `http://localhost:4000`

**Total de Endpoints**: 73 rotas

### Resumo por Módulo

| Módulo | Endpoints | CRUD Completo |
|--------|-----------|---------------|
| Autenticação | 3 | Parcial |
| Perfil de Usuário | 2 | ✅ |
| Grupos Familiares | 11 | ✅ |
| Consultas Médicas | 8 | ✅ |
| Eventos | 9 | ✅ |
| Anotações | 10 | ✅ |
| Locais | 8 | ✅ |
| Álbuns | 7 | ✅ |
| Fotos | 10 | ✅ |
| Dashboard | 3 | ✅ |

---

### 1. Autenticação (`/auth`)

#### 🔓 Rotas Públicas

#### `GET /auth`
Lista todos os usuários cadastrados.

```javascript
GET /auth

// Response 200
[
  {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "gender": "masculino",
    "photoUrl": "/uploads/profiles/1-123456789.jpg",
    "createdAt": "2025-10-01T10:00:00.000Z"
  }
]
```

---

#### `POST /auth/register`
Registra novo usuário no sistema.

```javascript
POST /auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "gender": "masculino"  // opcional: "masculino" | "feminino" | "outro"
}

// Response 201
{
  "message": "Usuário criado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "gender": "masculino",
    "photoUrl": null,
    "createdAt": "2025-10-01T10:00:00.000Z"
  }
}
```

**Validações**:
- Nome, email e senha obrigatórios
- Email deve ser único
- Gênero: `masculino`, `feminino` ou `outro`

**Erros**:
- `400`: Campos obrigatórios faltando
- `400`: Email já cadastrado
- `400`: Gênero inválido

---

#### `POST /auth/login`
Realiza login e retorna token JWT.

```javascript
POST /auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "senha123"
}

// Response 200
{
  "message": "Login realizado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "gender": "masculino",
    "photoUrl": "/uploads/profiles/1-123456789.jpg"
  }
}
```

**Erros**:
- `400`: Email ou senha faltando
- `401`: Credenciais inválidas

---

### 2. Perfil de Usuário (`/users`)

#### 🔒 Requer Autenticação

#### `GET /users/profile`
Obtém perfil do usuário autenticado.

```javascript
GET /users/profile
Authorization: Bearer TOKEN

// Response 200
{
  "message": "Perfil obtido com sucesso",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "gender": "masculino",
    "photoUrl": "/uploads/profiles/1-1696612345678.jpg",
    "createdAt": "2025-10-01T10:00:00.000Z",
    "updatedAt": "2025-10-06T20:00:00.000Z"
  }
}
```

---

#### `PUT /users/profile`
Atualiza perfil do usuário (incluindo foto).

**⚠️ IMPORTANTE**: Esta rota usa `multipart/form-data` para upload de foto!

```javascript
PUT /users/profile
Authorization: Bearer TOKEN
Content-Type: multipart/form-data

// FormData:
{
  "photo": File,                    // Arquivo de imagem (opcional)
  "name": "João Silva Santos",     // opcional
  "email": "joao.novo@email.com",  // opcional
  "gender": "masculino",            // opcional
  "currentPassword": "senha123",    // obrigatório se mudar senha
  "newPassword": "novaSenha456"     // opcional
}

// Response 200
{
  "message": "Perfil atualizado com sucesso!",
  "user": {
    "id": 1,
    "name": "João Silva Santos",
    "email": "joao.novo@email.com",
    "gender": "masculino",
    "photoUrl": "/uploads/profiles/1-1696612456789.jpg",  // Nova foto
    "updatedAt": "2025-10-06T20:30:00.000Z"
  }
}
```

**Validações da Foto**:
- ✅ Tipos aceitos: JPEG, JPG, PNG, GIF
- ✅ Tamanho máximo: 5MB
- ✅ Validação de MIME type
- ✅ Foto antiga é removida automaticamente

**Validações dos Campos**:
- Email deve ser único
- Nome não pode estar vazio
- Gênero: `masculino`, `feminino` ou `outro`
- `currentPassword` obrigatória para mudar senha
- `newPassword` mínimo 6 caracteres

**Erros**:
- `400`: Arquivo muito grande (> 5MB)
- `400`: Tipo de arquivo inválido
- `400`: Nome vazio
- `400`: Email já em uso
- `400`: Nenhum campo para atualizar
- `401`: Senha atual incorreta

**Exemplo com Fetch**:
```javascript
const formData = new FormData();
formData.append('photo', fileInput.files[0]);
formData.append('name', 'João Silva');
formData.append('email', 'joao@email.com');

fetch('http://localhost:4000/users/profile', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`
    // NÃO adicionar Content-Type! Browser define automaticamente
  },
  body: formData
});
```

---

### 3. Grupos Familiares (`/family-groups`)

#### 🔒 Todas as rotas requerem autenticação

#### `GET /family-groups`
Lista todas as famílias que o usuário participa.

```javascript
GET /family-groups
Authorization: Bearer TOKEN

// Response 200
{
  "message": "Grupos familiares obtidos com sucesso",
  "familyGroups": [
    {
      "id": 1,
      "name": "Família Silva",
      "inviteCode": "ABC123XYZ",
      "role": "admin",  // Papel do usuário NESTA família
      "createdAt": "2025-10-01T10:00:00.000Z",
      "members": [
        {
          "id": 1,
          "userId": 1,
          "role": "admin",
          "user": {
            "id": 1,
            "name": "João Silva",
            "email": "joao@email.com",
            "photoUrl": "/uploads/profiles/1-123.jpg"
          }
        },
        {
          "id": 2,
          "userId": 2,
          "role": "member",
          "user": {
            "id": 2,
            "name": "Maria Silva",
            "email": "maria@email.com"
          }
        }
      ]
    }
  ]
}
```

---

#### `GET /family-groups/:id`
Obtém detalhes de uma família específica.

```javascript
GET /family-groups/1
Authorization: Bearer TOKEN

// Response 200
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
          "email": "joao@email.com",
          "photoUrl": "/uploads/profiles/1-123.jpg",
          "gender": "masculino"
        },
        "createdAt": "2025-10-01T10:00:00.000Z"
      }
    ],
    "createdAt": "2025-10-01T10:00:00.000Z",
    "updatedAt": "2025-10-01T10:00:00.000Z"
  }
}
```

**Erros**:
- `403`: Usuário não é membro do grupo
- `404`: Grupo não encontrado

---

#### `POST /family-groups`
Cria nova família (usuário vira admin automaticamente).

```javascript
POST /family-groups
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "name": "Família Silva"
}

// Response 201
{
  "message": "Grupo familiar criado com sucesso",
  "familyGroup": {
    "id": 1,
    "name": "Família Silva",
    "inviteCode": "ABC123XYZ",  // Código gerado automaticamente
    "createdAt": "2025-10-01T10:00:00.000Z"
  }
}
```

**Validações**:
- Nome obrigatório

**Erros**:
- `400`: Nome é obrigatório

---

#### `POST /family-groups/join`
Entrar em família usando código permanente.

```javascript
POST /family-groups/join
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "inviteCode": "ABC123XYZ"
}

// Response 201
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

**Erros**:
- `400`: Código obrigatório
- `400`: Já é membro do grupo
- `404`: Código inválido

---

#### `POST /family-groups/join-temp`
Entrar em família usando código temporário (15 minutos).

```javascript
POST /family-groups/join-temp
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "tempInviteCode": "A1B2C3"
}

// Response 201
{
  "message": "Você se juntou ao grupo familiar com sucesso",
  "member": {
    "id": 3,
    "userId": 3,
    "familyGroupId": 1,
    "role": "member"
  },
  "familyGroup": {
    "id": 1,
    "name": "Família Silva"
  }
}
```

**Erros**:
- `400`: Código obrigatório
- `400`: Código expirado
- `400`: Já é membro do grupo
- `404`: Código inválido

---

#### `POST /family-groups/:id/temp-invite`
🔐 **Apenas ADMINS** - Gerar código temporário de convite (15 min).

```javascript
POST /family-groups/1/temp-invite
Authorization: Bearer TOKEN (admin)

// Response 200
{
  "message": "Código temporário gerado com sucesso",
  "tempInviteCode": "A1B2C3",
  "expiresAt": "2025-10-06T20:15:00.000Z",
  "expiresIn": "15 minutos"
}
```

**Características**:
- 6 caracteres alfanuméricos
- Expira em 15 minutos
- Pode ser gerado múltiplas vezes (substitui anterior)

**Erros**:
- `403`: Apenas admins podem gerar
- `404`: Grupo não encontrado

---

#### `PUT /family-groups/:id`
🔐 **Apenas ADMINS** - Atualizar nome da família.

```javascript
PUT /family-groups/1
Authorization: Bearer TOKEN (admin)
Content-Type: application/json

{
  "name": "Família Silva Santos"
}

// Response 200
{
  "message": "Grupo familiar atualizado com sucesso",
  "familyGroup": {
    "id": 1,
    "name": "Família Silva Santos",
    "updatedAt": "2025-10-06T20:30:00.000Z"
  }
}
```

**Erros**:
- `403`: Apenas admins podem atualizar
- `404`: Grupo não encontrado

---

#### `PUT /family-groups/:id/regenerate-invite`
🔐 **Apenas ADMINS** - Gerar novo código permanente.

```javascript
PUT /family-groups/1/regenerate-invite
Authorization: Bearer TOKEN (admin)

// Response 200
{
  "message": "Novo código de convite gerado com sucesso",
  "inviteCode": "XYZ789NEW"
}
```

**⚠️ Cuidado**: Código antigo para de funcionar!

**Erros**:
- `403`: Apenas admins podem regenerar

---

#### `DELETE /family-groups/:id/members/:memberId`
🔐 **Apenas ADMINS** - Remover membro do grupo.

```javascript
DELETE /family-groups/1/members/2
Authorization: Bearer TOKEN (admin)

// Response 200
{
  "message": "Membro removido com sucesso"
}
```

**Validações**:
- Admin não pode remover a si mesmo (usar `/leave`)

**Erros**:
- `403`: Apenas admins podem remover
- `400`: Não pode remover a si mesmo

---

#### `DELETE /family-groups/:id/leave`
Sair da família.

```javascript
DELETE /family-groups/1/leave
Authorization: Bearer TOKEN

// Response 200
{
  "message": "Você saiu do grupo familiar com sucesso"
}
```

**Validações**:
- Admin não pode sair se houver outros membros
- Admin deve transferir administração ou excluir grupo

**Erros**:
- `400`: Admin deve transferir administração primeiro

---

#### `DELETE /family-groups/:id`
🔐 **Apenas ADMINS** - Excluir família permanentemente.

```javascript
DELETE /family-groups/1
Authorization: Bearer TOKEN (admin)

// Response 200
{
  "message": "Grupo familiar excluído com sucesso"
}
```

**⚠️ CUIDADO**: 
- Todos os dados são excluídos (consultas, eventos, notas, etc)
- Ação irreversível!

**Erros**:
- `403`: Apenas admins podem excluir

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
    "category": "compras",
    "familyGroupId": 1,
    "authorId": 1,
    "author": { "id": 1, "name": "João Silva", "photoUrl": "/uploads/profiles/1-123.jpg" },
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
  "category": "compras",
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

#### 7. **Filtrar por Categoria**
```http
GET /notes/group/:familyGroupId/category?category=compras
```
**Descrição:** Lista anotações de uma categoria específica.

**Query Parameters:**
- `category` - compras | escola | trabalho | saude | financas | geral

---

#### 8. **Listar Categorias Usadas**
```http
GET /notes/group/:familyGroupId/categories
```
**Descrição:** Retorna a lista única de categorias utilizadas no grupo.

---

#### 9. **Buscar Anotações**
```http
GET /notes/group/:familyGroupId/search?q=compras
```
**Descrição:** Busca anotações por termo no título ou conteúdo.

**Query Parameters:**
- `q` - Termo de busca

---

#### 10. **Obter Anotações de Alta Prioridade**
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
GET /places/group/:familyGroupId/search?q=hospital
```
**Descrição:** Busca locais por nome ou endereço.

**Query Parameters:**
- `q` - Termo de busca

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
GET /albums/group/:familyGroupId/search?q=ferias
```
**Descrição:** Busca álbuns por nome.

**Query Parameters:**
- `q` - Termo de busca

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
GET /photos/group/:familyGroupId/search?q=praia
```
**Descrição:** Busca fotos por título ou descrição.

**Query Parameters:**
- `q` - Termo de busca

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
  category: String, // "compras", "escola", "trabalho", "saude", "financas", "geral"
  familyGroupId: Integer,
  authorId: Integer | null,
  author: { id, name, email?, photoUrl? } | null,
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
