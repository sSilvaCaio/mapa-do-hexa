# Informações para quem atuar no backend

## 🏗️ Estrutura de Microsserviços

O projeto está organizado em **microsserviços**, cada um em uma pasta separada. Cada microsserviço segue a arquitetura de **três camadas**:

```
{nomeMicroservico}/
├── domain/          # Entidades e Repositórios
├── application/     # Serviços, DTOs e Lógica de Negócio
└── presentation/    # Controllers REST
```

Para criar novos microsserviços, consulte: `GUIA_MICROSERVICOS.md`

---

## 📦 Microsserviço: Authenticator (Primeiro)

**Responsabilidades:**
- Registro de usuários
- Login (geração de JWT)
- Validação de email
- Criptografia de senhas

**Documentação detalhada**: `authenticator/README_AUTHENTICATOR.md`

**Endpoints:**
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login e obter JWT

---

## 🔧 Configuração

### MongoDB
O Spring está configurado para procurar o mongodb localmente na máquina (`localhost:27017`). Quando for migrar para um banco em nuvem (como por exemplo o Atlas), avise para eu configurar as infos no `application.properties` (ou façam e avisem).

### Segurança
O sistema de segurança do Spring já está ativo, então qualquer rota nova vai estar bloqueada por padrão. Quando criarem novas rotas, configurem a liberação delas no `SecurityConfig.java`, dentro do pacote "config".

**Rotas públicas atuais:**
- `POST /api/auth/register` ✅ Pública
- `POST /api/auth/login` ✅ Pública
- `OPTIONS /**` ✅ Pública (preflight do navegador)
- `/api/status` ✅ Pública (teste)

### JWT
- **Secret Key**: Configurada em `application.properties` → `jwt.secret`
- **Expiração**: 24 horas (configurável em `jwt.expiration`)
- **Algoritmo**: HS512 (HMAC SHA-512)

---

## 📝 Como Usar a Autenticação

### 1. Registrar novo usuário
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "userId": "507f1f77bcf86cd799439011",
  "nome": "João Silva",
  "email": "joao@example.com",
  "tokenType": "Bearer",
  "expiresIn": 86400000
}
```

### 2. Fazer login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### 3. Usar o token em requisições autenticadas
```bash
curl -X GET http://localhost:8080/api/eventos \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiJ9..."
```

---

## 🔐 Segurança - Boas Práticas

✅ **Implementado:**
- Senhas criptografadas com BCrypt
- Tokens JWT com assinatura digital (HS512)
- Validação de email e dados
- Mensagens de erro genéricas (não revela informações sensíveis)

⚠️ **Próximos passos:**
- Implementar JWT Filter para validar tokens em requisições protegidas
- Adicionar Refresh Token
- Implementar 2FA (autenticação de dois fatores)
- Configurar rate limiting
- Implementar logout (blacklist de tokens)

---

## 🧪 Testando

### Com Postman
1. Abra Postman
2. Crie uma collection "Mapa do Hexa"
3. Adicione as requisições dos endpoints
4. Use variáveis de ambiente para armazenar o token

### Com cURL
Veja exemplos acima neste documento

### Banco de Dados
Conecte ao MongoDB local e consulte a coleção `users`:
```
use mapa_hexa_db
db.users.find()
```

---

## 📚 Tecnologias Utilizadas

- **Java 17** - Linguagem
- **Spring Boot 4.0.5** - Framework
- **MongoDB** - Banco de dados NoSQL
- **Spring Security** - Autenticação e autorização
- **JWT (io.jsonwebtoken)** - Tokens
- **BCrypt** - Criptografia de senhas
- **Lombok** - Redução de boilerplate
- **Jakarta Validation** - Validação de dados

---

## 🐛 Troubleshooting

### Erro: "Connection refused" ao iniciar
- Verifique se MongoDB está rodando: `mongodb://localhost:27017`
- Windows: Inicie o MongoDB através do Services ou use WSL

### Erro: "Email já registrado"
- Significa que o email já existe no banco
- Para testar, use um novo email ou delete o documento no MongoDB

### Erro: "Email ou senha inválidos"
- Verifique se email e senha estão corretos
- Senhas são case-sensitive
- Valide o JSON da requisição

### Token inválido
- Verifique se está usando "Bearer {token}" no header
- Tokens expiram em 24 horas
- Faça login novamente para obter novo token

---

## 📞 Contato

Para dúvidas, consulte:
- README.md (visão geral do projeto)
- authenticator/README_AUTHENTICATOR.md (detalhes do primeiro microsserviço)
- GUIA_MICROSERVICOS.md (como criar novos microsserviços)
