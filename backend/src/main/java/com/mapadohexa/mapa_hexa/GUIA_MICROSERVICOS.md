# 📐 Guia de Estrutura de Microsserviços

## Padrão de Pastas para Novos Microsserviços

Cada microsserviço deve seguir a seguinte estrutura de pastas, implementando a **Arquitetura em Camadas**:

```
src/main/java/com/mapadohexa/mapa_hexa/
│
├── {nomeMicroservico}/              # Pasta do microsserviço
│   ├── domain/                      # 🔴 CAMADA DE DOMÍNIO (Entidades)
│   │   ├── {Entidade1}.java         # Entidade principal (MongoDB @Document)
│   │   ├── {Entidade2}.java         # Outras entidades
│   │   ├── {Entidade1}Repository.java  # Interface MongoRepository
│   │   └── README.md                # Documentação do domínio
│   │
│   ├── application/                 # 🟡 CAMADA DE APLICAÇÃO (Lógica de Negócio)
│   │   ├── service/
│   │   │   ├── {Negocio}Service.java    # Regras de negócio
│   │   │   └── {Utilidade}Service.java  # Serviços auxiliares
│   │   │
│   │   ├── dto/
│   │   │   ├── {Entidade}RequestDTO.java    # DTO de entrada
│   │   │   ├── {Entidade}ResponseDTO.java   # DTO de saída
│   │   │   └── {Entidade}UpdateDTO.java     # DTO de atualização
│   │   │
│   │   ├── util/
│   │   │   ├── {Funcionalidade}Util.java    # Classes utilitárias
│   │   │   └── {Conversao}Mapper.java       # Mapeamento Entity ↔ DTO
│   │   │
│   │   └── exception/
│   │       └── {Negocio}Exception.java      # Exceções customizadas
│   │
│   ├── presentation/                # 🟢 CAMADA DE APRESENTAÇÃO (API REST)
│   │   ├── {Entidade}Controller.java    # Controllers REST
│   │   └── {Validacao}Validator.java    # Validadores customizados
│   │
│   └── README_{MICROSERVICO}.md     # Documentação do microsserviço
│
└── config/                          # Configurações globais do projeto
    ├── SecurityConfig.java          # Configuração de segurança
    ├── CorsConfig.java              # Configuração de CORS
    └── {OutrasConfigs}.java         # Outras configurações
```

---

## 🏗️ Explicação das Camadas

### 🔴 **DOMAIN (Camada de Domínio)**
**Responsabilidade**: Definir as entidades de negócio

**O que contém**:
- `@Document` anotações do MongoDB
- Propriedades do objeto
- Índices do banco
- Repositories (interfaces para acesso a dados)

**Exemplo - User.java**:
```java
@Document(collection = "users")
@Data
public class User {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String email;
    
    private String password;
}
```

**Exemplo - UserRepository.java**:
```java
@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}
```

---

### 🟡 **APPLICATION (Camada de Aplicação)**
**Responsabilidade**: Implementar a lógica de negócio

**Subpastas**:

#### **service/** - Serviços com Regras de Negócio
```java
@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    
    public User register(RegisterRequestDTO request) {
        // Lógica: validar, criptografar, salvar
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email já existe");
        }
        // ...
    }
}
```

#### **dto/** - Data Transfer Objects
```java
@Data
public class RegisterRequestDTO {
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    @Size(min = 6)
    private String password;
}
```

#### **util/** - Funções Auxiliares
```java
@Component
public class EmailValidator {
    public boolean isValidEmail(String email) {
        // Implementação
    }
}
```

#### **exception/** - Exceções Customizadas
```java
public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
```

---

### 🟢 **PRESENTATION (Camada de Apresentação)**
**Responsabilidade**: Expor endpoints REST e validar entrada

**Exemplo - AuthController.java**:
```java
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO request) {
        try {
            User user = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
```

---

## 📋 Checklist para Criar um Novo Microsserviço

### 1️⃣ Análise de Requisitos
- [ ] Definir responsabilidades do microsserviço
- [ ] Listar entidades necessárias
- [ ] Definir operações CRUD
- [ ] Documentar fluxos de negócio

### 2️⃣ Camada Domain
- [ ] Criar entidade `@Document`
- [ ] Adicionar validações básicas
- [ ] Criar índices do MongoDB
- [ ] Criar Repository interface

### 3️⃣ Camada Application
- [ ] Criar DTOs Request/Response
- [ ] Criar Service com lógica de negócio
- [ ] Implementar validações
- [ ] Tratar exceções
- [ ] Adicionar logs

### 4️⃣ Camada Presentation
- [ ] Criar Controller REST
- [ ] Definir endpoints (GET, POST, PUT, DELETE)
- [ ] Adicionar `@Valid` nos DTOs
- [ ] Documentar endpoints com comentários
- [ ] Testar com Postman/cURL

### 5️⃣ Configuração de Segurança
- [ ] Atualizar `SecurityConfig.java` com novas rotas públicas
- [ ] Testar autenticação e autorização
- [ ] Validar CORS

### 6️⃣ Documentação
- [ ] Criar `README_{MICROSERVICO}.md`
- [ ] Documentar endpoints (exemplos cURL)
- [ ] Explicar fluxos
- [ ] Detalhar campos do MongoDB

---

## 🎯 Exemplo: Criar Microsserviço "Eventos"

### Estrutura
```
evento/
├── domain/
│   ├── Evento.java
│   ├── EventoRepository.java
│   └── README.md
├── application/
│   ├── service/
│   │   └── EventoService.java
│   ├── dto/
│   │   ├── EventoRequestDTO.java
│   │   └── EventoResponseDTO.java
│   ├── util/
│   │   └── EventoMapper.java
│   └── exception/
│       └── EventoNaoEncontradoException.java
├── presentation/
│   └── EventoController.java
└── README_EVENTO.md
```

### Domain - Evento.java
```java
@Document(collection = "eventos")
@Data
@Builder
public class Evento {
    @Id
    private String id;
    
    @NotBlank
    private String nome;
    
    @NotBlank
    private String descricao;
    
    @NotNull
    private LocalDateTime dataHora;
    
    @NotBlank
    private String local;
    
    private Integer capacidade;
    
    @NotBlank
    private String organizadorId;
    
    private Integer participantesCount;
    
    private Long criadoEm;
}
```

### Domain - EventoRepository.java
```java
@Repository
public interface EventoRepository extends MongoRepository<Evento, String> {
    List<Evento> findByOrganizadorId(String organizadorId);
    List<Evento> findByDataHoraAfter(LocalDateTime data);
    Optional<Evento> findByNome(String nome);
}
```

### Application - EventoService.java
```java
@Service
@RequiredArgsConstructor
public class EventoService {
    private final EventoRepository eventoRepository;
    
    public Evento criar(EventoRequestDTO request) {
        if (eventoRepository.findByNome(request.getNome()).isPresent()) {
            throw new IllegalArgumentException("Evento com este nome já existe");
        }
        
        Evento evento = Evento.builder()
            .nome(request.getNome())
            .descricao(request.getDescricao())
            .dataHora(request.getDataHora())
            .local(request.getLocal())
            .capacidade(request.getCapacidade())
            .organizadorId(request.getOrganizadorId())
            .participantesCount(0)
            .criadoEm(System.currentTimeMillis())
            .build();
            
        return eventoRepository.save(evento);
    }
    
    public List<Evento> listar() {
        return eventoRepository.findAll();
    }
    
    public Evento obterPorId(String id) {
        return eventoRepository.findById(id)
            .orElseThrow(() -> new EventoNaoEncontradoException("Evento não encontrado"));
    }
}
```

### Presentation - EventoController.java
```java
@RestController
@RequestMapping("/api/eventos")
@RequiredArgsConstructor
public class EventoController {
    private final EventoService eventoService;
    
    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody EventoRequestDTO request) {
        Evento evento = eventoService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(evento);
    }
    
    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(eventoService.listar());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> obterPorId(@PathVariable String id) {
        return ResponseEntity.ok(eventoService.obterPorId(id));
    }
}
```

---

## ✅ Padrões e Boas Práticas

### 1. Nomenclatura
```
✅ Correto          ❌ Incorreto
AuthService         AuthServiceImpl
EventoDTO           EventoData
UserRepository      IUserRepository
EventoException     AppException
```

### 2. Organização de Imports
```java
// 1. Imports de java
import java.util.*;
import java.time.*;

// 2. Imports de javax/jakarta
import jakarta.validation.*;

// 3. Imports de org.springframework
import org.springframework.*;

// 4. Imports do projeto
import com.mapadohexa.*;
```

### 3. Comentários de Métodos
```java
/**
 * Descrição breve do que o método faz
 * 
 * Descrição mais detalhada se necessário
 * 
 * @param nomeParam descrição do parâmetro
 * @return descrição do retorno
 * @throws ExceptionType quando essa exceção é lançada
 */
public TipoRetorno metodo(TipoParam nomeParam) {
}
```

### 4. Tratamento de Erros
```java
// ❌ Ruim
try {
    // código
} catch (Exception e) {
    e.printStackTrace();
}

// ✅ Bom
try {
    // código
} catch (SpecificException e) {
    log.warn("Erro específico: {}", e.getMessage());
    throw new BusinessException("Mensagem de negócio", e);
}
```

---

## 🔗 Integração entre Microsserviços

Quando um microsserviço precisa chamar outro:

```java
@Service
public class EventoService {
    @Autowired
    private RestTemplate restTemplate;
    
    public void adicionarParticipante(String eventoId, String userId) {
        // Chamar microsserviço de usuários para validar
        String usuarioUrl = "http://localhost:8080/api/usuarios/{id}";
        try {
            User user = restTemplate.getForObject(usuarioUrl, User.class, userId);
            // Prosseguir com a lógica
        } catch (Exception e) {
            throw new UsuarioNaoEncontradoException("Usuário não existe");
        }
    }
}
```

---

## 📚 Referências

- **Spring Boot Documentation**: https://spring.io/projects/spring-boot
- **Spring Data MongoDB**: https://spring.io/projects/spring-data-mongodb
- **JWT.io**: https://jwt.io
- **Jakarta Validation**: https://jakarta.ee/specifications/bean-validation/
- **RESTful API Best Practices**: https://restfulapi.net/

---

## 🤝 Contribuindo

Ao criar um novo microsserviço:
1. Siga esse padrão de pastas
2. Documente tudo em um README_{MICROSERVICO}.md
3. Adicione logs apropriados
4. Implemente tratamento de erros
5. Faça código comentado para alunos de terceira fase

**Dúvidas?** Consulte o exemplo do microsserviço Authenticator!

