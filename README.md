# COOPA – Mapa do Hexa

Plataforma web criada para a Copa do Mundo de 2026, com foco em torcedores que querem organizar e encontrar eventos de jogo na sua cidade. O usuário cria eventos para assistir partidas, convida amigos, confirma presença e conversa no mural do evento. A ideia central é a descoberta social: você vê eventos de outros usuários, manda pedido de amizade, e a partir daí pode compartilhar eventos diretamente com quem você conhece.

A aplicação foi desenvolvida como trabalho final da disciplina de Programação para Web.

---

## Acesso

**Deploy em produção:** [https://mapa-do-hexa-five.vercel.app/](https://mapa-do-hexa-five.vercel.app/)

Toda a aplicação exige autenticação. Ao acessar a URL, o usuário é redirecionado para a tela de login, onde pode entrar com uma conta existente ou criar uma nova. Não há nenhuma rota pública além da própria tela de login/cadastro.

---

## Funcionalidades

**Eventos**

Usuários podem criar eventos informando o jogo (ex: Brasil x Argentina), data, horário, local com coordenadas para o mapa, descrição, itens que os convidados devem levar e capacidade máxima. O criador do evento pode editar ou cancelar o evento a qualquer momento. Ao cancelar, todos os participantes inscritos recebem uma notificação automática.

**Inscrição e presença**

Qualquer usuário autenticado pode confirmar presença em um evento aberto. O sistema controla a capacidade máxima e impede inscrições duplas. O criador vê a lista de quem confirmou, e o evento aparece com badge indicando se está lotado ou com vagas.

**Amizades**

Para compartilhar eventos, é necessário primeiro ser amigo do destinatário. O sistema funciona com solicitação e aceite: você pesquisa pelo nome de usuário, manda o pedido, e o outro aceita ou recusa. Amizades aceitas ficam visíveis na aba de amigos, com opção de desfazer o vínculo.

**Compartilhamento de eventos**

Com amizades estabelecidas, é possível compartilhar qualquer evento diretamente com um amigo. Eventos compartilhados aparecem no topo do feed do destinatário, com destaque visual (borda amarela e badge de "compartilhado por [nome]"). O compartilhamento também gera uma notificação para o amigo.

**Mural do evento**

Cada evento tem um mural de mensagens onde participantes e o organizador podem conversar. O organizador e o autor de uma mensagem podem apagar seus próprios posts. As mensagens ficam em ordem cronológica e o organizador é identificado com um badge especial.

**Notificações**

O sistema emite notificações para: pedidos de amizade recebidos, pedido aceito, evento compartilhado e evento cancelado. O contador de não lidas aparece no menu. Notificações podem ser marcadas como lidas individualmente ou todas de uma vez, e também podem ser excluídas.

**Perfil**

O usuário pode atualizar nome, nome de usuário e senha a qualquer momento. Também é possível excluir a conta, com confirmação de senha para evitar exclusões acidentais.

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Back-end | Java 17, Spring Boot 3.3.5, Spring Security |
| Banco de dados | MongoDB |
| Autenticação | JWT (JSON Web Tokens) |
| Front-end | React 19, TypeScript, Vite |
| Estilização | Tailwind CSS |
| Infraestrutura | Docker, Docker Compose, Nginx |
| Hospedagem | Render |
| Documentação da API | Swagger/OpenAPI 3.0 (acessível em `/api/swagger-ui/index.html`) |

---

## Rodando localmente

### Com Docker (recomendado)

Requer Docker e Docker Compose instalados.

```bash
git clone <url-do-repositório>
cd mapa-do-hexa
docker-compose up --build
```

- Frontend: http://localhost:5173  
- Backend: http://localhost:8080  
- Swagger: http://localhost:8080/api/swagger-ui/index.html

### Sem Docker

**Backend** (requer Java 17+ e MongoDB rodando localmente):

```bash
cd backend
./mvnw spring-boot:run
```

Configure a URI do MongoDB e a chave JWT em `backend/src/main/resources/application.properties`.

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Configure a URL do backend no arquivo `frontend/.env` (veja `.env.example`).

---

## Cobertura dos requisitos

| Requisito | Como está implementado |
|-----------|----------------------|
| Acesso apenas após autenticação | Spring Security bloqueia todas as rotas exceto `/api/auth/*`. No frontend, o componente `PrivateRoute` redireciona para o login caso não haja token válido no `AuthContext`. |
| Cadastro de novos usuários | Endpoint `POST /api/auth/register` com validação de e-mail único, username único (3–30 caracteres) e senha mínima de 8 caracteres. A tela de login alterna para o formulário de cadastro. |
| Atualização de cadastro | Endpoint `PUT /api/users/me` acessível pela página de perfil. O usuário pode alterar nome, username, avatar e senha enquanto estiver autenticado. |
| Base de dados no back-end | MongoDB com sete coleções: `users`, `eventos`, `inscricoes`, `eventos_compartilhados`, `amizades`, `mensagens_mural` e `notificacoes`. |
| Compartilhamento de dados entre usuários | Eventos podem ser compartilhados com amigos via `POST /api/eventos/{id}/compartilhar`. O mural de cada evento é colaborativo. O sistema de amizades conecta usuários entre si. |
| Front-end responsivo | Tailwind CSS com breakpoints `sm`, `md`, `lg`, `xl`. No mobile, o menu de navegação fica fixo na parte inferior da tela. No desktop, aparece como barra superior. Os grids de eventos se adaptam de 1 para até 3 colunas conforme a largura da tela. |
| Disponível 24/7 em servidor | Aplicação containerizada com Docker e hospedada no Render e Vercel: [https://mapa-do-hexa-five.vercel.app/](https://mapa-do-hexa-five.vercel.app/) |

---

## Estrutura do projeto

```
mapa-do-hexa/
├── backend/          # API REST em Spring Boot
│   └── src/main/java/com/coopa/
│       ├── config/         # Segurança, JWT Filter, CORS, OpenAPI
│       ├── domain/         # Entidades e repositórios MongoDB
│       ├── application/    # Serviços e DTOs
│       └── presentation/   # Controllers REST
├── frontend/         # SPA em React + TypeScript
│   └── src/
│       ├── api/        # Funções de chamada à API (Axios)
│       ├── context/    # AuthContext (estado global de autenticação)
│       ├── app/
│       │   ├── components/ # Layout, PrivateRoute
│       │   └── pages/      # Telas da aplicação
│       └── types/      # Tipos TypeScript compartilhados
└── docker-compose.yml
```

---

Link do GitHub: https://github.com/sSilvaCaio/mapa-do-hexa

---

## Equipe

- Caio Soares Silva - 25100802
- Victoria Hollerbach Buratto - 25100805
- Igor Tavares de Campos da Rosa - 25100809
- Gustavo de Novaes Genovez - 25103310
- Eduardo Virgilio Silva 25103308
