# Informações pra quem vai atuar no frontend

**NUNCA** coloquem "localhost:8080" dentro do código de vocês. Quando precisarem colocar o endereço do backend, usem a variável de ambiente import.meta.env.VITE_API_URL (Recomendo criar um arquivo padrão .ts para somente importá-lo com um nome mais simples quando forem usar a variável, podem me chamar se quiserem ajuda com isso)

Um **REQUISITO** do trabalho é ser responsível e possível de usar no celular, então recomendo começarem o design pensando numa tela menor (de celular) e depois adaptarem para uma tela maior (podem fazer como quiser, só não esqueçam da responsividade e poder usar nos dois)

O projeto é em typeScript, não é javaScript, então as variáveis são tipadas. Tentem sempre tipar as variáveis para evitar erros.