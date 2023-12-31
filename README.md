# DrivenPass 🔒

Pensando nas diversas senhas que o usuário precisa guardar de diferentes lugares possíveis, essa API é resposável por fazer isso pelo usuário. Utilizando criptografia nos dados sensíveis.

## Sobre

O drivenPass foi criado para gerenciar informações que o usuário deseja guardar como senhas, notas, username ou nicknames de sites.

- Banco de Dados: PostgreSql
- Modelagem de dados
- PrismaORM
- Orientação a Objeto com NestJs
- Typescript
- Testes automatizados de integração com Jest
- Próximos passos: Criar o front-End para a aplicação.

  Caso queria explorar mais a API segue o link do deploy no render: <a href="https://drivenpass-api-s4nm.onrender.com"> drivenpass-api </a>

## Tecnologias

<p>
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" />
  <img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
</p>
O prisma foi utilizado para a criação do banco de dados e também para monitorar as migrações e as alterações realizadas. O Jest foi utilizado juntamente com a biblioteca <a href="https://fakerjs.dev/api/"> faker </a> para realizar os testes de integração nas rotas da aplicação. 

## Como rodar

1. Clone o repositório em https://github.com/taisoliva/drivenpass.git
2. Instale as dependências
   ```
   npm i
   ```
3. Inicialize o banco de dados com o Prisma
   ```
   npx prisma migrate dev
   ```
   ```
   npx prisma generate
   ```
   ```
   npx prisma seed
   ```
4. Crie as variáveis de ambiente no arquivo .env na raiz do projeto
   ```
      DATABASE_URL="postgresql://seu-usuario:sua-senha@localhost:5432/mydb?schema=public"
      JWT_SECRET="sua-senha-super-secreta"
      CRYPTR = "sua-senha-super-secreta"
   ```

6. Inicialize a API
   ```
   npm run start:dev
   ```
## Como rodar os testes 

1. Crie as variáveis de ambiente no .env.test na raiz do projeto
   ```
      DATABASE_URL="postgresql://seu-usuario:sua-senha@localhost:5432/mydb-test?schema=public"
   ```
2. Crie um banco de dados para teste
   ```
   npm run test:prisma
   ```
3. Rode os testes
   ```
   npm run test:e2e
   ```
  
   
<!-- 
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

<!-- 
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE) 

-->
