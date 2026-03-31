# O que os devs precisam saber?
> Nesse arquivo vai estar falando o que TODOS que vão trabalhar aqui precisam saber/fazer, os detalhes específicos para cada função vai estar em outro arquivo com o nome da função (infos-frontend e infos-backend)

## Pré-requisitos
* Node.js 
* JDK 17

## Configurando o frontend
> Sim, todo mundo precisa configurar o frontend local pq vai precisar rodar local

1. Abre um terminal dentro da pasta do projeto
2. roda ``cd frontend``
3. Faça uma cópia do arquivo ".env.example" chamada ".env"
4. roda ``npm install``


O java baixa todas as dependências na hora que rodar a primeira vez, então não precisa de nenhuma configuração prévia.


## Como rodar o projeto local
> O projeto é dividido em 2, então sempre será preciso manter 2 terminais abertos pra rodar

**BACKEND**
1. Abre um terminal na pasta do projeto (mapa-do-hexa)
2. ``cd backend``
3. ``./mvnw spring-boot:run``
4. Espere até aparecer a mensagem "Started MapaHexaApplication in ... seconds"

**FRONTEND**
1. Abre um novo terminal na pasta do projeto (mapa-do-hexa)
2. ``cd frontend``
3. ``npm run dev``
4. O terminal vai mostrar um link (geralmente http://localhost:5173), clique nele ou abre o navegador e digita ele
5. Se aparecer "servidor online", está tudo certo
