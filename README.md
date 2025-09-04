# Sistema de Organização Familiar - Guia de Testes com Postman

Este guia mostra como testar completamente a API do sistema de organização familiar usando o Postman.

## 🚀 Configuração Inicial

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn


### Pré-requisitos
- Node.js instalado
- Postman instalado
- Servidor rodando na porta 4000

### 1. Instalar e Iniciar o Servidor
```bash
npm install
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

### 2. Configurar Postman
- Base URL: `http://localhost:4000`
- Criar uma coleção chamada "Sistema Familiar"
- Configurar variáveis de ambiente no Postman:
  - `baseUrl`: `http://localhost:4000`
  - `token`: (será preenchido após login)

## 🔐 Autenticação - Obtendo Token JWT

### 1. Fazer Login (POST)
```
URL: {{baseUrl}}/auth/login
Method: POST
Headers: Content-Type: application/json

Body (raw JSON):
{
    "email": "maria@garcia.com",
    "password": "123456"
}
```

**Resposta esperada:**
```json
{
    "message": "Login realizado com sucesso",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
        "name": "Maria Garcia",
        "email": "maria@garcia.com",
        "gender": "F"
    }
}
```

**⚠️ IMPORTANTE:** Copie o token da resposta e adicione na variável `token` do Postman.

### 2. Registrar Novo Usuário (POST)
```
URL: {{baseUrl}}/auth/register
Method: POST
Headers: Content-Type: application/json

Body (raw JSON):
{
    "name": "Novo Usuario",
    "email": "novo@email.com", 
    "password": "123456",
    "gender": "M"
}
```

## 👨‍👩‍👧‍👦 Grupos Familiares

### 3. Listar Meus Grupos (GET)
```
URL: {{baseUrl}}/family-groups
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

### 4. Criar Novo Grupo (POST)
```
URL: {{baseUrl}}/family-groups
Method: POST
Headers: 
  - Authorization: Bearer {{token}}
  - Content-Type: application/json

Body (raw JSON):
{
    "name": "Família Teste",
    "description": "Grupo criado para testes"
}
```

### 5. Entrar em Grupo com Código (POST)
```
URL: {{baseUrl}}/family-groups/join
Method: POST
Headers: 
  - Authorization: Bearer {{token}}
  - Content-Type: application/json

Body (raw JSON):
{
    "inviteCode": "GARCIA01"
}
```

### 6. Ver Detalhes do Grupo (GET)
```
URL: {{baseUrl}}/family-groups/1
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

### 7. Gerar Novo Código de Convite (PUT)
```
URL: {{baseUrl}}/family-groups/1/regenerate-invite
Method: PUT
Headers: 
  - Authorization: Bearer {{token}}
```

## 🏥 Consultas Médicas

### 8. Listar Consultas do Grupo (GET)
```
URL: {{baseUrl}}/appointments/group/1
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

### 9. Criar Nova Consulta (POST)
```
URL: {{baseUrl}}/appointments
Method: POST
Headers: 
  - Authorization: Bearer {{token}}
  - Content-Type: application/json

Body (raw JSON):
{
    "title": "Consulta Cardiologista",
    "doctor": "Dr. João Silva",
    "location": "Hospital São Lucas - Sala 205",
    "date": "2025-09-20",
    "time": "09:00",
    "description": "Consulta de rotina anual",
    "familyGroupId": 1
}
```

### 10. Próximas Consultas (GET)
```
URL: {{baseUrl}}/appointments/group/1/upcoming
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

### 11. Consultas por Data (GET)
```
URL: {{baseUrl}}/appointments/group/1/date?date=2025-09-20
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

### 12. Consultas por Médico (GET)
```
URL: {{baseUrl}}/appointments/group/1/doctor?doctor=Dr. João Silva
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

### 13. Atualizar Consulta (PUT)
```
URL: {{baseUrl}}/appointments/1
Method: PUT
Headers: 
  - Authorization: Bearer {{token}}
  - Content-Type: application/json

Body (raw JSON):
{
    "time": "10:30",
    "description": "Consulta reagendada"
}
```

### 14. Excluir Consulta (DELETE)
```
URL: {{baseUrl}}/appointments/1
Method: DELETE
Headers: 
  - Authorization: Bearer {{token}}
```

## 🎉 Eventos Familiares

### 15. Listar Eventos do Grupo (GET)
```
URL: {{baseUrl}}/events/group/1
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

### 16. Criar Novo Evento (POST)
```
URL: {{baseUrl}}/events
Method: POST
Headers: 
  - Authorization: Bearer {{token}}
  - Content-Type: application/json

Body (raw JSON):
{
    "title": "Aniversário da Maria",
    "description": "Festa de 30 anos",
    "date": "2025-12-15",
    "time": "19:00",
    "location": "Casa da família",
    "type": "BIRTHDAY",
    "familyGroupId": 1
}
```

### 17. Próximos Eventos (GET)
```
URL: {{baseUrl}}/events/group/1/upcoming
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

### 18. Aniversários do Mês (GET)
```
URL: {{baseUrl}}/events/group/1/birthdays
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

### 19. Eventos por Tipo (GET)
```
URL: {{baseUrl}}/events/group/1/type?type=BIRTHDAY
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

**Tipos disponíveis:** BIRTHDAY, MEETING, TRIP, CELEBRATION, OTHER

## 📝 Anotações/Recados

### 20. Listar Anotações do Grupo (GET)
```
URL: {{baseUrl}}/notes/group/1
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

### 21. Criar Nova Anotação (POST)
```
URL: {{baseUrl}}/notes
Method: POST
Headers: 
  - Authorization: Bearer {{token}}
  - Content-Type: application/json

Body (raw JSON):
{
    "title": "Comprar remédio",
    "content": "Não esquecer de comprar o remédio da pressão do vovô",
    "priority": "HIGH",
    "familyGroupId": 1
}
```

### 22. Anotações por Prioridade (GET)
```
URL: {{baseUrl}}/notes/group/1/priority?priority=HIGH
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

**Prioridades disponíveis:** LOW, NORMAL, HIGH

### 23. Buscar Anotações (GET)
```
URL: {{baseUrl}}/notes/group/1/search?q=remédio
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

### 24. Anotações de Alta Prioridade (GET)
```
URL: {{baseUrl}}/notes/group/1/high-priority
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

## 📍 Lugares Importantes

### 25. Listar Lugares do Grupo (GET)
```
URL: {{baseUrl}}/places/group/1
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

### 26. Criar Novo Lugar (POST)
```
URL: {{baseUrl}}/places
Method: POST
Headers: 
  - Authorization: Bearer {{token}}
  - Content-Type: application/json

Body (raw JSON):
{
    "name": "Hospital Santa Casa",
    "address": "Rua das Flores, 123",
    "type": "HOSPITAL",
    "phone": "(11) 1234-5678",
    "notes": "Hospital de emergência mais próximo",
    "familyGroupId": 1
}
```

### 27. Lugares por Tipo (GET)
```
URL: {{baseUrl}}/places/group/1/type?type=HOSPITAL
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

**Tipos disponíveis:** HOSPITAL, SCHOOL, MARKET, PHARMACY, RESTAURANT, OTHER

### 28. Buscar Lugares (GET)
```
URL: {{baseUrl}}/places/group/1/search?q=hospital
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

### 29. Tipos Disponíveis (GET)
```
URL: {{baseUrl}}/places/group/1/types
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

## 📸 Álbuns de Fotos

### 30. Listar Álbuns do Grupo (GET)
```
URL: {{baseUrl}}/albums/group/1
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

### 31. Criar Novo Álbum (POST)
```
URL: {{baseUrl}}/albums
Method: POST
Headers: 
  - Authorization: Bearer {{token}}
  - Content-Type: application/json

Body (raw JSON):
{
    "title": "Viagem à Praia 2025",
    "description": "Fotos da viagem de férias em família",
    "familyGroupId": 1
}
```

### 32. Álbuns Recentes (GET)
```
URL: {{baseUrl}}/albums/group/1/recent
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

### 33. Buscar Álbuns (GET)
```
URL: {{baseUrl}}/albums/group/1/search?q=viagem
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

## 🖼️ Fotos

### 34. Listar Fotos do Grupo (GET)
```
URL: {{baseUrl}}/photos/group/1
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

### 35. Criar Nova Foto (POST)
```
URL: {{baseUrl}}/photos
Method: POST
Headers: 
  - Authorization: Bearer {{token}}
  - Content-Type: application/json

Body (raw JSON):
{
    "title": "Pôr do sol na praia",
    "description": "Linda vista durante o passeio",
    "imageUrl": "https://example.com/foto.jpg",
    "familyGroupId": 1,
    "albumId": 1
}
```

### 36. Fotos do Álbum (GET)
```
URL: {{baseUrl}}/photos/album/1
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

### 37. Fotos sem Álbum (GET)
```
URL: {{baseUrl}}/photos/group/1/without-album
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

### 38. Mover Foto para Álbum (PUT)
```
URL: {{baseUrl}}/photos/1/move
Method: PUT
Headers: 
  - Authorization: Bearer {{token}}
  - Content-Type: application/json

Body (raw JSON):
{
    "albumId": 2
}
```

### 39. Fotos Recentes (GET)
```
URL: {{baseUrl}}/photos/group/1/recent
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

## 📊 Dashboard

### 40. Resumo do Dashboard (GET)
```
URL: {{baseUrl}}/dashboard/group/1
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

### 41. Agenda de Hoje (GET)
```
URL: {{baseUrl}}/dashboard/group/1/today
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

### 42. Estatísticas do Grupo (GET)
```
URL: {{baseUrl}}/dashboard/group/1/stats
Method: GET
Headers: 
  - Authorization: Bearer {{token}}
```

## 🎯 Sequência de Testes Recomendada

### Fluxo Completo de Teste:

1. **Autenticação**: Login → Copiar token
2. **Grupos**: Listar grupos → Ver detalhes do grupo 1
3. **Consultas**: Criar consulta → Listar consultas → Próximas consultas
4. **Eventos**: Criar evento → Listar eventos → Aniversários
5. **Anotações**: Criar anotação → Listar → Buscar por prioridade
6. **Lugares**: Criar lugar → Listar → Buscar por tipo
7. **Álbuns**: Criar álbum → Listar álbuns
8. **Fotos**: Criar foto → Associar ao álbum → Listar fotos
9. **Dashboard**: Ver resumo → Agenda de hoje → Estatísticas

## 🔑 Contas de Teste Disponíveis

| Email | Senha | Grupo | Papel |
|-------|-------|-------|-------|
| maria@garcia.com | 123456 | Família Garcia | Admin |
| joao@garcia.com | 123456 | Família Garcia | Membro |
| ana@garcia.com | 123456 | Família Garcia | Membro |
| pedro@silva.com | 123456 | Família Silva | Admin |

**Códigos de Convite:**
- Família Garcia: `GARCIA01`
- Família Silva: `SILVA01`

## 🚫 Códigos de Erro Comuns

- **401 Unauthorized**: Token inválido ou ausente
- **403 Forbidden**: Sem permissão para acessar recurso
- **404 Not Found**: Recurso não encontrado
- **400 Bad Request**: Dados inválidos no body da request

## 💡 Dicas para Usar no Postman

1. **Crie variáveis de ambiente** para `baseUrl` e `token`
2. **Organize requests em pastas** por funcionalidade
3. **Use Scripts de Pre-request** para automatizar tokens
4. **Salve respostas como exemplos** para documentação
5. **Use Tests** para validar respostas automaticamente

---

🎉 **Agora você pode testar completamente a API usando o Postman!**

```

```
