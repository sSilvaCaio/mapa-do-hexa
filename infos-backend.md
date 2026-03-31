# Informações para quem atuar no backend

O Spring está configurado para procurar o mongodb localmente na máquina (localhost:27017), quando for migrar pra um banco em nuvem (como por exemplo o atlas) avisem pra eu configurar as infos no application.properties (ou façam e avisem)

O sistema de segurança do spring já ta ativo, então qualquer rota nova vai estar bloqueada por padrão. Quando criarem novas rotas, configurem a liberação delas no SecurityConfig.java, dentro do pacote "config"