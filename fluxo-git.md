# Como vamos usar o git?
> Um mini tutorial rápido de como vamos trabalhar com o git pra facilitar a vida de todo mundo e evitar conflito com códigos alheios.


## "Vou fazer alguma coisa nova"

1. Pense um nome simples para o que você está fazendo
(Exemplo: Tela de login, Entidade usuário, menu de notificações, etc.)

2. Criar uma branch feature/nome-da-tarefa

3. Avisa no grupo oq vc ta fazendo só pra gente ter noção que vc começou

4. Faz teu código normal e garante que ta funcionando

5. Faz o commit e push das tuas alterações

6. Vai no git e faz um pull request

### Como fazer isso tudo

1. Só usar o cérebro

2.  * Abre o terminal
    * ``git checkout main`` - Vai pra branch principal
    * ``git pull origin main`` - Puxa as novidades que ainda não tão no teu pc
    * ``git checkout -b feature/nome-da-tarefa`` - Cria a branch nova

3. Só usar o zap (ou alguma outra plataforma tipo notion se a gente for usar)

4. Só usar o cérebro

5.  * Abre o terminal
    * ``git add .``
    * ``git commit -m "fiz tal coisa"``
    * ``git push origin feature/nome-da-tarefa``

6. Abre o git e clica no botão "Compare & Pull Request" (Se tiver um lugar pra associar alguém pra revisar, coloca alguém que esteja atuando na mesma coisa que vc (front/back))


> Se ao invés de algo novo, vc for fazer uma correção, a lógica segue a mesma, mas ao invés do nome da branch ser feature/nome-da-tarefa, coloca fix/nome-da-correcao