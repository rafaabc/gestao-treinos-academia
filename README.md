1) Funcionalidade: Login de Usuário

User Story
Como um usuário da aplicação, eu quero realizar login com username e password, para que eu possa acessar e gerenciar meus treinos de forma segura durante o ano.

Regras de Negócio
- O sistema deve permitir cadastro de novo usuário com username e password.
- Não pode haver duplicidade de username no sistema.
- O password deve ser armazenado de forma criptografada (hash).
- O sistema deve validar username e password no momento do login.
- O sistema deve impedir acesso caso as credenciais estejam incorretas.
- O usuário autenticado deve permanecer logado até realizar logout ou encerrar a sessão.
- O sistema deve permitir logout a qualquer momento.

2) Funcionalidade: Marcação de Treinos no Calendário

User Story
Como um usuário autenticado, eu quero marcar no calendário os dias em que realizei treino, para que eu possa acompanhar minha frequência ao longo do ano.

Regras de Negócio
- O usuário deve estar autenticado para acessar o calendário.
- O calendário deve exibir o mês atual, com opção de navegar para mês anterior e seguinte.
- Ao clicar em um dia, o sistema deve permitir marcar ou desmarcar o treino realizado.
- Um dia marcado deve ser visualmente destacado (ex: cor verde).
- O sistema deve permitir apenas um registro de treino por dia por usuário.
- O sistema deve salvar o registro de treino vinculado ao usuário logado.
- O sistema deve persistir os dados mesmo após logout.

3) Funcionalidade: Métricas de Treinos Planejados x Realizados

User Story
Como um usuário autenticado, eu quero visualizar métricas comparando a quantidade de treinos planejados com os realizados, para que eu possa acompanhar meu desempenho ao longo do ano.

Regras de Negócio
- O sistema deve permitir definir uma meta anual de treinos (ex: 200 treinos).
- O sistema deve calcular automaticamente a quantidade total de treinos realizados no mês e no ano.
- O sistema deve exibir a porcentagem de treinos realizados em relação à meta anual.
- O sistema deve exibir o total de treinos realizados no mês atual.
- O sistema deve atualizar as métricas automaticamente ao marcar ou desmarcar um treino.
- As métricas devem considerar apenas os treinos do usuário autenticado.