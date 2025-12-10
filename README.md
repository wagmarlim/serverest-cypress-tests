# Automated Tests with Cypress - Serverest

This repository contains automated E2E scenarios for the frontend and API tests of the Serverest application.

**Links:**
- API: https://serverest.dev/
- FrontEnd: https://front.serverest.dev/

## ✅ Prerequisites

- [Node.js](https://nodejs.org/)
- npm or yarn
- Git installed
- Cypress (installed via npm)
  ```bash
  npm install cypress --save-dev
  ```
- To perform tests that involve uploading files, you need to install the `cypress-file-upload` plugin:
  ```bash
  npm install --save-dev cypress-file-upload
  ```

- For better performance in excluding screenshots and videos when starting a new test run, we will use the `fs-extra` package, which helps manage directories and works better on different operating systems:
  ```bash
  npm install fs-extra --save-dev
  ```

---

## 📦 Installation

Clone the project and install the dependencies:

```bash
git clone https://github.com/seu-usuario/serverest-cypress-tests.git
cd serverest-cypress-tests
npm install
```

---

## 🧪 Running the Tests

Open Cypress with GUI:
```bash
npm test
```

Run all tests in headless mode:
```bash
npx cypress run
```

---

## 🧹 Automatic Cleanup of Old Evidence

Before each test run, the script cleanCypressDirs.js deletes old screenshot and video folders.
It could be found in `scripts/cleanCypressDirs.js`.

---

## 📁 Folder Structure

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

## 🧱 Test Structure

The test suite is organized as follows:

### `cypress/e2e/`
Contains automated tests divided into API and Frontend.

#### `api/`
It contains API tests that validate the application's integration with backend services.
- **loginValidations.cy.js**: Validates user login via API.
- **productsValidations.cy.js**: Validates product creation, update, and deletion.
- **userValidations.cy.js**: Validates user creation, update, and deletion.

#### `frontend/`
Contains the E2E tests for the application's frontend.
- **validacaoLogin.cy.js**: Validates the login process in the UI.
- **validacaoProdutos.cy.js**: Validates creation, visualization, and deletion of products in the UI.
- **validacaoUsuario.cy.js**: Validates creation, visualization, and deletion of users in the UI.

### `cypress/fixtures/`
Contains the test data files (fixtures) used in the tests.
- **login.json**: Login credentials for tests.
- **produtos.png**: Sample image for product creation.
- **produtos.json**: Sample product data.
- **usuarios.json**: Sample user data.

### `cypress/pageObjects/`
It contains the Page Objects files, which encapsulate interactions with the user interface (UI) to facilitate the reuse and maintenance of tests.
- **cadastroProdutoPage.js**: Product creation page.
- **cadastroUsuarioAdminPage.js**: Admin user creation page.
- **cadastroUsuarioLoginPage.js**: Login user creation page.
- **listaProdutosPage.js**: Product listing page.
- **listaUsuariosPage.js**: User listing page.
- **loginPage.js**: Login page.

### `cypress/support/`
Contains supporting files for the tests.
- **commands.js**: Custom reusable commands.
- **e2e.js**: Global Cypress configuration.

### `cypress/screenshots/`
Stores screenshots from failed tests.

### `cypress/videos/`
Stores videos from test executions.

### `cypress/scripts/`
It contains auxiliary scripts that can be used while Cypress is running.
- **cleanCypressDirs.js**: Cleans screenshots and videos before each run

---

## 📌 Funcionalidades Testadas

## ✅ Frontend

- User login.
- Product creation with image upload.
- Product listing and deletion.
- User registration and deletion.
- XHR request validation using cy.intercept().
- File upload using cypress-file-upload.

## ✅ API

- Login via API.
- Invalid password validation.
- Nonexistent email validation.
- Product registration with JWT token.
- Duplicate product validation.
- Product update and deletion.
- User creation.
- Existing user validation.
- Listing users and locating previously created users.
- User deletion.


## 🤝 Contributing

1. Fork this repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name-of-functionality
   ```
3. Make your changes and commit:
   ```bash
   git commit -am 'Adicionando nova funcionalidade'
   ```
4. Push your branch:
   ```bash
   git push origin feature-nome-da-funcionalidade
   ```
5. Open a pull request.

---

## ✍️ Author
Developed by **Wagner Campos Martins de Lima**

