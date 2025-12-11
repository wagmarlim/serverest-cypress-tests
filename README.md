# Automated Tests with Cypress - Serverest

This repository contains automated E2E scenarios for the frontend and API tests of the Serverest application.

**Links:**
- API: https://serverest.dev/
- FrontEnd: https://front.serverest.dev/

## ✅ Pré-requisitos

- [Node.js](https://nodejs.org/)
- npm ou yarn
- Git instalado
- Cypress (instalado via npm)
```bash
npm install cypress --save-dev
```
- Para testes que envolvem upload de arquivos, instale o plugin `cypress-file-upload`:
```bash
npm install --save-dev cypress-file-upload
```

- Para manipular diretórios (limpeza de screenshots/videos) use `fs-extra`:
```bash
npm install fs-extra --save-dev
```

---

## 📦 Instalação

Clone o projeto e instale as dependências:

```bash
git clone https://github.com/seu-usuario/serverest-cypress-tests.git
cd serverest-cypress-tests
npm install
```

---

## 🧪 Executando os testes

Abrir Cypress (GUI):
```bash
npm test
```

Rodar todos os testes em headless:
```bash
npx cypress run
```

---

## 🧹 Limpeza automática de evidências

O script `scripts/cleanCypressDirs.js` apaga screenshots e vídeos antigos antes de novas execuções.

---

## 📁 Estrutura do projeto

```
cypress/
├── e2e/
│   ├── api/
│   └── frontend/
├── fixtures/
├── pageObjects/
├── support/
├── screenshots/
├── videos/
└── scripts/
```

Detalhes em `cypress/e2e/`, `cypress/pageObjects/` e `cypress/fixtures/`.

---

## 🧱 Organização dos testes

- `cypress/e2e/api`: testes de integração com backend (login, produtos, usuários).
- `cypress/e2e/frontend`: testes E2E da interface (login, produtos, usuários).
- `cypress/fixtures`: dados de teste reutilizáveis.
- `cypress/pageObjects`: Page Objects para encapsular interações com UI.
- `cypress/support`: comandos e configuração global.

---

## **Atualizações Recentes**

- **Intercepts e validações de rede (fail-fast):** Foram adicionados `cy.intercept()` e `cy.wait()` com aliases em vários testes de frontend para garantir que rotas críticas (ex: `**/produtos**`, requisições de edição) sejam chamadas e validadas; se a API permitir ações indevidas para usuários não-admin, os testes falham imediatamente com uma mensagem clara de BUG.
- **Timeouts reduzidos para fail-fast:** Vários `cy.wait()` e assertivas tiveram timeouts reduzidos (p.ex. para 3000–5000ms) para evitar que testes fiquem longos quando uma requisição não ocorre.
- **Page Objects otimizados para performance:** `cypress/pageObjects/listaProdutosPage.js` e `listaUsuariosPage.js` passaram a usar busca em memória via `Cypress.$(el).text()` + `filter()` em vez de depender de scrolls (evita rolagem desnecessária e acelera localização de linhas em tabelas grandes).
- **Carregamento controlado de tabelas:** Adicionado método `carregarTodosOsElementos()` que faz um pequeno scroll até o fim da tabela para lidar com lazy-loading antes de buscar elementos.
- **Testes API para usuários não-admin:** Novos specs focados em validar que usuários não-admin não conseguem criar/atualizar/deletar produtos e usuários (`cypress/e2e/api/validacaoProdutoApi.cy.js`, `cypress/e2e/api/validacaoUsuarioApi.cy.js`). Esses testes criam usuários não-admin dinamicamente, usam token admin para setup/teardown e validam respostas (esperam 401/403; se 200/201 é reportado como BUG).
- **Criação dinâmica e cleanup:** Em vez de fixtures estáticas para usuários não-admin, os testes criam usuários dinamicamente via API quando possível e armazenam IDs para remoção na etapa de `afterEach`, garantindo um ambiente limpo.
- **Ajustes no payload:** Ajustes nos payloads enviados ao API (ex: `administrador` enviado como string `'true'`/`'false'`) para corresponder às validações da API e evitar `400 Bad Request`.
- **Fallback de credenciais admin:** Login admin nos testes agora tenta credenciais provenientes de `Cypress.env` (variáveis de ambiente) antes de cair para fixtures, para facilitar execução em ambientes distintos.

## **Padrões de Projeto**

- **Page Object Pattern:** A interação com a UI está encapsulada em arquivos sob `cypress/pageObjects/` (`LoginPage`, `ListaProdutosPage`, `CadastroProdutoPage`, etc.). Isso melhora a reutilização, clareza e manutenção dos testes.
- **Separation of Concerns (Frontend x API):** Testes UI e API estão separados (`cypress/e2e/frontend` vs `cypress/e2e/api`) para permitir execuções independentes e diagnósticos mais rápidos.
- **Fixture-driven data:** Dados repetíveis e previsíveis são armazenados em `cypress/fixtures/` para cenários que não exigem criação dinâmica.
- **Custom commands e helpers:** Operações repetitivas ficam em `cypress/support/commands.js` e helpers (ex: scripts de limpeza em `scripts/`) para manter testes concisos.

## **Boas Práticas Adotadas**

- **Fail-fast nas expectativas de rede:** Interceptamos requisições críticas e assertamos o código HTTP (esperando 200 quando permitido, ou 401/403 quando não). Se uma rota for permitida indevidamente, os testes lançam um erro explícito com tag `BUG:` para facilitar triagem.
- **Setup determinístico via API quando aplicável:** Quando possível, os testes usam chamadas API para criar/limpar recursos (usuários/produtos) em vez do fluxo UI — isso torna os testes mais rápidos e menos frágeis.
- **Isolamento e cleanup:** IDs de recursos criados são rastreados e removidos em hooks `afterEach`/`after` para evitar poluição do ambiente de testes.
- **Evitar rolagem excessiva:** Busca de elementos em tabelas foi alterada para filtragem in-memory, evitando scrolls longos que tornam os testes lentos e instáveis.
- **Uso de aliases e intercepts padronizados:** Todos os pontos de rede relevantes usam alias (`@listarProdutos`, `@cadastrarProduto`, `@produtosRequest`), facilitando espera e assertivas.
- **Mensagens de erro claras e assertivas:** Em casos de comportamento inesperado do backend, o teste falha com mensagens explícitas que facilitam o diagnóstico (ex: `BUG: API permitiu ...`).
- **Uso de variáveis de ambiente para credenciais sensíveis:** Preferência por `Cypress.env()` para admin credentials, permitindo execução segura em CI.
- **Evidência para debug:** Capturas (`screenshots/`) e vídeos (`videos/`) são mantidos por execução para análise de falhas; o script `scripts/cleanCypressDirs.js` limpa-os antes de novas execuções.

## **Como executar os testes (dicas e opções)**

- Executar apenas um spec (UI de produtos):
```bash
npx cypress run --spec "cypress/e2e/frontend/validacaoProdutos.cy.js"
```

- Fornecer credenciais admin via `--env` (útil quando fixtures não funcionam com o ambiente público):
```bash
npx cypress run --spec "cypress/e2e/frontend/validacaoProdutos.cy.js" --env adminEmail=seu@admin.com,adminPassword=SenhaAdmin
```

- Executar todos os testes em modo headless:
```bash
npx cypress run
```

## **Observações e próximos passos recomendados**

- Se os testes falharem por `401 Unauthorized` usando fixtures, forneça credenciais admin válidas via `--env` ou `cypress.env.json` para o ambiente alvo.
- Considere migrar todos os fluxos de criação/limpeza de usuários para chamadas API (onde possível) para acelerar e estabilizar a suíte.
- Se desejar, posso:
  - Converter os testes UI de criação de usuário para criação via API com cleanup automatizado.
  - Adicionar um utilitário central de login (API) para reduzir repetição de hooks.
  - Adicionar um script de geração de dados de teste com variáveis configuráveis.

---

## ✍️ Author
Developed by **Wagner Campos Martins de Lima**

