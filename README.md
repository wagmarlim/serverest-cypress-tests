# Testes Automatizados com Cypress - Serverest

Este repositório contém cenários E2E automatizados para o frontend e testes de API da aplicação Serverest.

**Links:**
- API: https://serverest.dev/
- FrontEnd: https://front.serverest.dev/

## ✅ Pré-requisitos

- [Node.js](https://nodejs.org/)
- npm ou yarn
- Git instalado
- Cypress (instalado via `npm install`)
  ```bash
  npm install cypress --save-dev
  ```
- Para fazer testes que fazem upload de arquivo, é necessário instalar o plugin `cypress-file-upload`:
  ```bash
  npm install --save-dev cypress-file-upload
  ```

- Para melhor funcionamento da exclusão de screenshots e videos ao começar uma nova execução dos testes, vamos usar pacote `fs-extra` que ajuda a lidar com diretórios e funciona melhor em diferentes sistemas operacionais:
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

## 🧪 Execução dos Testes

Abrir o Cypress com interface gráfica:
```bash
npm test
```

Executar todos os testes em modo headless:
```bash
npx cypress run
```

---

## 🧹 Limpeza automática de evidências anteriores

Antes de cada execução, o script `cleanCypressDirs.js` é executado para remover diretórios antigos de screenshots e vídeos.
Ele pode ser encontrado em `scripts/cleanCypressDirs.js`.

---

## 📁 Estrutura de Pastas

```
cypress/
├── e2e/
│   ├── api/
│   │   ├── loginValidations.cy.js
│   │   ├── productsValidations.cy.js
│   │   └── userValidations.cy.js
│   └── frontend/
│       ├── validacaoLogin.cy.js
│       ├── validacaoProdutos.cy.js
│       └── validacaoUsuario.cy.js
│
├── fixtures/
│   ├── login.json
│   ├── produtos.png
│   ├── produtos.json
│   └── usuarios.json
│
├── pageObjects/
│   ├── cadastroProdutoPage.js
│   ├── cadastroUsuarioAdminPage.js
│   ├── cadastroUsuarioLoginPage.js
│   ├── listaProdutosPage.js
│   ├── listaUsuariosPage.js
│   └── loginPage.js
│
├── support/
│   ├── commands.js
│   ├── e2e.js
│
├── screenshots/
├── videos/
└── scripts/
    └── cleanCypressDirs.js
```

---

## 🧱 Estrutura dos Testes

A estrutura de diretórios e arquivos está organizada da seguinte forma:

### `cypress/e2e/`
Contém os testes automatizados organizados por categoria (API e Frontend).

#### `api/`
Contém os testes de API, que validam a integração da aplicação com os serviços backend.
- **loginValidations.cy.js**: Testes para validar o login de usuários na aplicação.
- **productsValidations.cy.js**: Testes para validar a criação, atualização e exclusão de produtos.
- **userValidations.cy.js**: Testes para validar a criação, atualização e exclusão de usuários.

#### `frontend/`
Contém os testes E2E para o frontend da aplicação.
- **validacaoLogin.cy.js**: Testes para validar o processo de login no frontend.
- **validacaoProdutos.cy.js**: Testes para validar a criação, visualização e exclusão de produtos no frontend.
- **validacaoUsuario.cy.js**: Testes para validar a criação, visualização e exclusão de usuários no frontend.

### `cypress/fixtures/`
Contém os arquivos de dados de teste (fixtures) usados nos testes.
- **login.json**: Dados de login utilizados para realizar testes de autenticação.
- **produtos.png**: Imagem de exemplo usada em testes de cadastro de produtos.
- **produtos.json**: Dados de exemplo para a criação de produtos.
- **usuarios.json**: Dados de exemplo para a criação de usuários.

### `cypress/pageObjects/`
Contém os arquivos de Page Objects, que encapsulam interações com a interface do usuário (UI) para facilitar a reutilização e a manutenção dos testes.
- **cadastroProdutoPage.js**: Página de cadastro de produtos.
- **cadastroUsuarioAdminPage.js**: Página de cadastro de usuários com perfil de admin.
- **cadastroUsuarioLoginPage.js**: Página de cadastro de usuários para login.
- **listaProdutosPage.js**: Página que lista os produtos cadastrados.
- **listaUsuariosPage.js**: Página que lista os usuários cadastrados.
- **loginPage.js**: Página de login, onde o usuário insere suas credenciais.

### `cypress/support/`
Contém arquivos de suporte para os testes.
- **commands.js**: Arquivo onde comandos customizados são definidos, como login automatizado e outras funções reutilizáveis.
- **e2e.js**: Configurações globais para os testes E2E.

### `cypress/screenshots/`
Contém as capturas de tela geradas durante a execução dos testes. As imagens são salvas automaticamente quando há falhas nos testes.

### `cypress/videos/`
Contém os vídeos das execuções dos testes. As gravações são feitas quando a execução é configurada para gerar vídeos (geralmente útil para depuração).

### `cypress/scripts/`
Contém scripts auxiliares que podem ser usados durante a execução do Cypress.
- **cleanCypressDirs.js**: Script para limpar os diretórios de screenshots e vídeos antes da execução dos testes, garantindo que os dados antigos não interfiram nos novos testes.

---

## 📌 Funcionalidades Testadas

## ✅ Frontend

- Login de usuários
- Cadastro de produtos com imagem
- Listagem e exclusão de produtos
- Cadastro e exclusão de usuários
- Intercepts para validação de requisições XHR ((XML HTTP Request))
- Upload de imagem via cypress-file-upload

## ✅ API

- Login via API
- Validação de senha errada
- Validação de email inexistente
- Cadastro de produtos com token
- Validação de produto duplicado
- Atualização e exclusão de produtos
- Cadastrar novo usuário
- Validar cadastro de usuário existente
- Listar usuários cadastrados e encontrar usuário cadastrado anteriomente
- Deletar usuário cadastrado


## 🤝 Contribuindo

1. Faça um fork deste repositório.
2. Crie uma branch para sua funcionalidade:
   ```bash
   git checkout -b feature-nome-da-funcionalidade
   ```
3. Faça as modificações necessárias e commit:
   ```bash
   git commit -am 'Adicionando nova funcionalidade'
   ```
4. Envie sua branch para o repositório remoto:
   ```bash
   git push origin feature-nome-da-funcionalidade
   ```
5. Abra um pull request.

---

## ✍️ Autor
Desenvolvido por **Wagner Campos Martins de Lima**

