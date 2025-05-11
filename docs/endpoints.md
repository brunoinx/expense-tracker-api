## Endpoints da API de Controle Financeiro

Este documento descreve os endpoints da API RESTful para controle de gastos e entradas financeiras, baseados nos modelos de dados definidos em `models.md`.

**Autenticação:** Todos os endpoints, exceto os de registro (`POST /usuarios/registrar`) e login (`POST /usuarios/login`), requerem um token JWT válido no cabeçalho `Authorization` (ex: `Authorization: Bearer <token>`).

### 1. Autenticação e Usuários (Auth & Users)

#### `POST /usuarios/registrar`
- **Descrição:** Registra um novo usuário no sistema.
- **Corpo da Requisição:** `application/json`
  ```json
  {
    "nome": "Nome Completo do Usuário",
    "email": "usuario@exemplo.com",
    "senha": "senhaSegura123"
  }
  ```
- **Resposta de Sucesso (201 Created):**
  ```json
  {
    "id": "uuid-do-usuario",
    "nome": "Nome Completo do Usuário",
    "email": "usuario@exemplo.com",
    "criado_em": "timestamp"
  }
  ```
- **Respostas de Erro:**
  - `400 Bad Request`: Dados inválidos (ex: e-mail já existe, senha fraca).
  - `500 Internal Server Error`: Erro no servidor.

#### `POST /usuarios/login`
- **Descrição:** Autentica um usuário e retorna um token JWT.
- **Corpo da Requisição:** `application/json`
  ```json
  {
    "email": "usuario@exemplo.com",
    "senha": "senhaSegura123"
  }
  ```
- **Resposta de Sucesso (200 OK):**
  ```json
  {
    "token": "seu.jwt.token.aqui",
    "usuario": {
      "id": "uuid-do-usuario",
      "nome": "Nome Completo do Usuário",
      "email": "usuario@exemplo.com"
    }
  }
  ```
- **Respostas de Erro:**
  - `401 Unauthorized`: Credenciais inválidas.
  - `500 Internal Server Error`: Erro no servidor.

#### `GET /usuarios/perfil`
- **Descrição:** Retorna os dados do usuário autenticado.
- **Autenticação:** Requerida.
- **Resposta de Sucesso (200 OK):** Retorna o objeto do usuário (sem a senha).
  ```json
  {
    "id": "uuid-do-usuario",
    "nome": "Nome Completo do Usuário",
    "email": "usuario@exemplo.com",
    "criado_em": "timestamp",
    "atualizado_em": "timestamp"
  }
  ```
- **Respostas de Erro:**
  - `401 Unauthorized`: Token inválido ou ausente.
  - `404 Not Found`: Usuário não encontrado (raro se o token for válido).

#### `PUT /usuarios/perfil`
- **Descrição:** Atualiza os dados do usuário autenticado (nome, e-mail, senha).
- **Autenticação:** Requerida.
- **Corpo da Requisição:** `application/json` (campos opcionais)
  ```json
  {
    "nome": "Novo Nome do Usuário",
    "email": "novo_email@exemplo.com",
    "senha_antiga": "senhaAtual123", // Necessária se for alterar a senha
    "nova_senha": "novaSenhaForte456" // Necessária se for alterar a senha
  }
  ```
- **Resposta de Sucesso (200 OK):** Retorna o objeto do usuário atualizado.
- **Respostas de Erro:**
  - `400 Bad Request`: Dados inválidos (ex: e-mail já existe, senha antiga incorreta).
  - `401 Unauthorized`: Token inválido ou ausente.

#### `DELETE /usuarios/perfil`
- **Descrição:** Exclui a conta do usuário autenticado.
- **Autenticação:** Requerida.
- **Resposta de Sucesso (204 No Content):**
- **Respostas de Erro:**
  - `401 Unauthorized`: Token inválido ou ausente.

### 2. Transações (Transactions)

Todos os endpoints de transações operam no contexto do usuário autenticado.

#### `POST /transacoes`
- **Descrição:** Cria uma nova transação para o usuário autenticado.
- **Autenticação:** Requerida.
- **Corpo da Requisição:** `application/json`
  ```json
  {
    "conta_id": "uuid-da-conta",
    "descricao": "Compra no supermercado",
    "valor": 150.75, // Para despesas, pode ser positivo e o tipo "saida", ou negativo com tipo "despesa"
    "tipo": "saida", // "entrada" ou "saida"
    "data": "YYYY-MM-DD",
    "categoria_id": "uuid-da-categoria", // Opcional
    "pago": true, // Opcional, default true
    "observacoes": "Compras do mês" // Opcional
  }
  ```
- **Resposta de Sucesso (201 Created):** Retorna o objeto da transação criada.
- **Respostas de Erro:**
  - `400 Bad Request`: Dados inválidos (ex: conta_id não existe, valor inválido).
  - `401 Unauthorized`.

#### `GET /transacoes`
- **Descrição:** Lista todas as transações do usuário autenticado. Suporta filtros.
- **Autenticação:** Requerida.
- **Parâmetros de Query (Opcionais):**
  - `mes` (Integer): Mês para filtrar (1-12).
  - `ano` (Integer): Ano para filtrar.
  - `tipo` (String: "entrada" ou "saida"): Filtra por tipo de transação.
  - `conta_id` (String UUID): Filtra por conta.
  - `categoria_id` (String UUID): Filtra por categoria.
  - `data_inicio` (String YYYY-MM-DD): Filtra por data de início.
  - `data_fim` (String YYYY-MM-DD): Filtra por data de fim.
  - `page` (Integer): Número da página para paginação (default 1).
  - `limit` (Integer): Número de itens por página (default 10).
- **Resposta de Sucesso (200 OK):** Retorna uma lista de transações e informações de paginação.
  ```json
  {
    "data": [
      // ... lista de objetos de transação ...
    ],
    "pagination": {
      "total_items": 100,
      "total_pages": 10,
      "current_page": 1,
      "limit": 10
    }
  }
  ```
- **Respostas de Erro:**
  - `401 Unauthorized`.

#### `GET /transacoes/:id`
- **Descrição:** Obtém detalhes de uma transação específica do usuário autenticado.
- **Autenticação:** Requerida.
- **Parâmetros de Path:**
  - `id` (String UUID): ID da transação.
- **Resposta de Sucesso (200 OK):** Retorna o objeto da transação.
- **Respostas de Erro:**
  - `401 Unauthorized`.
  - `404 Not Found`: Transação não encontrada ou não pertence ao usuário.

#### `PUT /transacoes/:id`
- **Descrição:** Atualiza uma transação existente do usuário autenticado.
- **Autenticação:** Requerida.
- **Parâmetros de Path:**
  - `id` (String UUID): ID da transação.
- **Corpo da Requisição:** `application/json` (campos a serem atualizados).
- **Resposta de Sucesso (200 OK):** Retorna o objeto da transação atualizada.
- **Respostas de Erro:**
  - `400 Bad Request`: Dados inválidos.
  - `401 Unauthorized`.
  - `404 Not Found`: Transação não encontrada ou não pertence ao usuário.

#### `DELETE /transacoes/:id`
- **Descrição:** Exclui uma transação do usuário autenticado.
- **Autenticação:** Requerida.
- **Parâmetros de Path:**
  - `id` (String UUID): ID da transação.
- **Resposta de Sucesso (204 No Content):**
- **Respostas de Erro:**
  - `401 Unauthorized`.
  - `404 Not Found`: Transação não encontrada ou não pertence ao usuário.

### 3. Categorias (Categories)

Categorias podem ser globais (sem `usuario_id`) ou específicas do usuário.

#### `POST /categorias`
- **Descrição:** Cria uma nova categoria para o usuário autenticado.
- **Autenticação:** Requerida.
- **Corpo da Requisição:** `application/json`
  ```json
  {
    "nome": "Lazer",
    "tipo": "saida", // "entrada" ou "saida"
    "cor": "#4CAF50", // Opcional
    "icone": "games-icon" // Opcional
  }
  ```
- **Resposta de Sucesso (201 Created):** Retorna o objeto da categoria criada.
- **Respostas de Erro:**
  - `400 Bad Request`: Dados inválidos.
  - `401 Unauthorized`.

#### `GET /categorias`
- **Descrição:** Lista todas as categorias do usuário autenticado e categorias globais.
- **Autenticação:** Requerida.
- **Parâmetros de Query (Opcionais):**
  - `tipo` (String: "entrada" ou "saida"): Filtra por tipo de categoria.
- **Resposta de Sucesso (200 OK):** Retorna uma lista de categorias.
- **Respostas de Erro:**
  - `401 Unauthorized`.

#### `GET /categorias/:id`
- **Descrição:** Obtém detalhes de uma categoria específica (do usuário ou global).
- **Autenticação:** Requerida.
- **Parâmetros de Path:**
  - `id` (String UUID): ID da categoria.
- **Resposta de Sucesso (200 OK):** Retorna o objeto da categoria.
- **Respostas de Erro:**
  - `401 Unauthorized`.
  - `404 Not Found`: Categoria não encontrada.

#### `PUT /categorias/:id`
- **Descrição:** Atualiza uma categoria existente (apenas as criadas pelo usuário).
- **Autenticação:** Requerida.
- **Parâmetros de Path:**
  - `id` (String UUID): ID da categoria.
- **Corpo da Requisição:** `application/json` (campos a serem atualizados).
- **Resposta de Sucesso (200 OK):** Retorna o objeto da categoria atualizada.
- **Respostas de Erro:**
  - `400 Bad Request`: Dados inválidos.
  - `401 Unauthorized`.
  - `403 Forbidden`: Usuário não tem permissão para alterar esta categoria (ex: categoria global).
  - `404 Not Found`: Categoria não encontrada.

#### `DELETE /categorias/:id`
- **Descrição:** Exclui uma categoria (apenas as criadas pelo usuário).
- **Autenticação:** Requerida.
- **Parâmetros de Path:**
  - `id` (String UUID): ID da categoria.
- **Resposta de Sucesso (204 No Content):**
- **Respostas de Erro:**
  - `401 Unauthorized`.
  - `403 Forbidden`: Usuário não tem permissão para excluir esta categoria.
  - `404 Not Found`: Categoria não encontrada.

### 4. Contas (Accounts)

Todos os endpoints de contas operam no contexto do usuário autenticado.

#### `POST /contas`
- **Descrição:** Cria uma nova conta financeira para o usuário autenticado.
- **Autenticação:** Requerida.
- **Corpo da Requisição:** `application/json`
  ```json
  {
    "nome": "Banco Principal",
    "tipo": "conta_corrente", // Veja enum em models.md
    "saldo_inicial": 1000.00,
    "moeda": "BRL", // Opcional, default "BRL"
    "incluir_soma_geral": true // Opcional, default true
  }
  ```
- **Resposta de Sucesso (201 Created):** Retorna o objeto da conta criada.
- **Respostas de Erro:**
  - `400 Bad Request`: Dados inválidos.
  - `401 Unauthorized`.

#### `GET /contas`
- **Descrição:** Lista todas as contas financeiras do usuário autenticado.
- **Autenticação:** Requerida.
- **Resposta de Sucesso (200 OK):** Retorna uma lista de contas.
- **Respostas de Erro:**
  - `401 Unauthorized`.

#### `GET /contas/:id`
- **Descrição:** Obtém detalhes de uma conta financeira específica do usuário autenticado.
- **Autenticação:** Requerida.
- **Parâmetros de Path:**
  - `id` (String UUID): ID da conta.
- **Resposta de Sucesso (200 OK):** Retorna o objeto da conta.
- **Respostas de Erro:**
  - `401 Unauthorized`.
  - `404 Not Found`: Conta não encontrada ou não pertence ao usuário.

#### `PUT /contas/:id`
- **Descrição:** Atualiza uma conta financeira existente do usuário autenticado.
- **Autenticação:** Requerida.
- **Parâmetros de Path:**
  - `id` (String UUID): ID da conta.
- **Corpo da Requisição:** `application/json` (campos a serem atualizados).
- **Resposta de Sucesso (200 OK):** Retorna o objeto da conta atualizada.
- **Respostas de Erro:**
  - `400 Bad Request`: Dados inválidos.
  - `401 Unauthorized`.
  - `404 Not Found`: Conta não encontrada ou não pertence ao usuário.

#### `DELETE /contas/:id`
- **Descrição:** Exclui uma conta financeira do usuário autenticado.
- **Autenticação:** Requerida.
- **Parâmetros de Path:**
  - `id` (String UUID): ID da conta.
- **Resposta de Sucesso (204 No Content):**
- **Respostas de Erro:**
  - `401 Unauthorized`.
  - `404 Not Found`: Conta não encontrada ou não pertence ao usuário.
  - `400 Bad Request`: Se a conta tiver transações associadas (pode exigir confirmação ou reatribuição de transações).

### 5. Relatórios (Reports)

Endpoints para fornecer dados consolidados e análises financeiras.

#### `GET /relatorios/saldo-total`
- **Descrição:** Retorna o saldo total consolidado de todas as contas do usuário que `incluir_soma_geral` seja `true`.
- **Autenticação:** Requerida.
- **Resposta de Sucesso (200 OK):**
  ```json
  {
    "saldo_total": 12345.67,
    "moeda": "BRL"
  }
  ```
- **Respostas de Erro:**
  - `401 Unauthorized`.

#### `GET /relatorios/fluxo-caixa`
- **Descrição:** Retorna um resumo do fluxo de caixa (total de entradas e saídas) para um período.
- **Autenticação:** Requerida.
- **Parâmetros de Query (Obrigatórios ou Opcionais com default):**
  - `data_inicio` (String YYYY-MM-DD): Data de início do período.
  - `data_fim` (String YYYY-MM-DD): Data de fim do período.
  - `conta_id` (String UUID, Opcional): Filtra por uma conta específica.
- **Resposta de Sucesso (200 OK):**
  ```json
  {
    "periodo": {
      "inicio": "YYYY-MM-DD",
      "fim": "YYYY-MM-DD"
    },
    "total_entradas": 5000.00,
    "total_saidas": 2500.00,
    "saldo_periodo": 2500.00,
    "moeda": "BRL"
  }
  ```
- **Respostas de Erro:**
  - `400 Bad Request`: Datas inválidas ou ausentes.
  - `401 Unauthorized`.

#### `GET /relatorios/despesas-por-categoria`
- **Descrição:** Retorna um resumo das despesas agrupadas por categoria para um período.
- **Autenticação:** Requerida.
- **Parâmetros de Query (Obrigatórios ou Opcionais com default):**
  - `data_inicio` (String YYYY-MM-DD): Data de início do período.
  - `data_fim` (String YYYY-MM-DD): Data de fim do período.
  - `conta_id` (String UUID, Opcional): Filtra por uma conta específica.
- **Resposta de Sucesso (200 OK):**
  ```json
  {
    "periodo": {
      "inicio": "YYYY-MM-DD",
      "fim": "YYYY-MM-DD"
    },
    "despesas_por_categoria": [
      {
        "categoria_id": "uuid-categoria-1",
        "nome_categoria": "Alimentação",
        "total_gasto": 800.50,
        "percentual_total": 32.02 // % em relação ao total de saídas no período
      },
      {
        "categoria_id": "uuid-categoria-2",
        "nome_categoria": "Transporte",
        "total_gasto": 400.00,
        "percentual_total": 16.00
      }
      // ... outras categorias
    ],
    "total_geral_despesas": 2500.00,
    "moeda": "BRL"
  }
  ```
- **Respostas de Erro:**
  - `400 Bad Request`: Datas inválidas ou ausentes.
  - `401 Unauthorized`.

#### `GET /relatorios/receitas-por-categoria`
- **Descrição:** Similar ao anterior, mas para receitas agrupadas por categoria.
- **Autenticação:** Requerida.
- **Parâmetros de Query e Resposta:** Análogos ao `despesas-por-categoria`.

Este documento fornece uma base sólida para os endpoints da API. Detalhes adicionais, como códigos de erro específicos e payloads de erro, seriam definidos durante a implementação.

