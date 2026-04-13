# Microsserviços - Mapa do Hexa

## Estrutura de Microsserviços

Este projeto está organizado em uma arquitetura de microsserviços, separando funcionalidades distintas em módulos isolados.

### Microsserviços Disponíveis

#### 1. **User Authenticator** (`userAuthenticator`)
Responsável por toda a lógica de autenticação e gerenciamento de usuários.

**Localização:** `src/main/java/com/mapadohexa/mapa_hexa/microservices/userAuthenticator/`

**Componentes:**
- **Domain** - Entidades e repositórios
  - `User` - Entidade de usuário (MongoDB Document)
  - `UserRepository` - Interface de acesso aos dados

- **Application** - Lógica de negócio
  - `AuthService` - Serviço principal de autenticação
  - `JwtUtil` - Utilitário para geração e validação de JWT
  - **DTO** - Objetos de transferência de dados
    - `AuthResponseDTO` - Resposta de autenticação
    - `LoginRequestDTO` - Requisição de login
    - `RegisterRequestDTO` - Requisição de registro

- **Presentation** - Camada de apresentação
  - `AuthController` - Endpoints REST para autenticação

**Endpoints:**
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login

---

## Como Adicionar um Novo Microsserviço

1. Crie uma pasta com o nome do microsserviço em `microservices/`
2. Siga a mesma estrutura:
   ```
   novoMicroservico/
   ├── domain/
   ├── application/
   │   ├── dto/
   │   ├── service/
   │   └── util/
   └── presentation/
   ```

3. Registre as novas rotas no arquivo de configuração de segurança se necessário

---

## Benefícios da Arquitetura de Microsserviços

✅ Separação de responsabilidades  
✅ Fácil manutenção e extensão  
✅ Reutilização de código  
✅ Preparado para escalabilidade futura

