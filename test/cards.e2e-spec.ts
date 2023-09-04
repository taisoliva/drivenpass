import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { E2EUtils } from './utils/e2e-utils';
import { UserFactory } from './factories/user.factory';
import { faker } from '@faker-js/faker';
import { CardFactory } from './factories/card.factory';

describe('Cards (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = app.get(PrismaService);

    await E2EUtils.cleanDB(prisma);
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Post /cards => should return 401 unauthorized if token is invalid', async () => {
    await UserFactory.build(prisma);
    const token = '';

    const response = await request(app.getHttpServer())
      .post('/cards')
      .set('authorization', `Bearer ${token}`)
      .send({
        title: 'itau',
        cardNumber: faker.string.alphanumeric({ length: 16 }),
        name: faker.person.firstName(),
        cvc: faker.string.alphanumeric({ length: 3 }),
        date: new Date(),
        password: faker.internet.password(),
        virtual: faker.datatype.boolean(),
        type: 'credito',
      });

    expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('Post /cards => should return 401 unauthorized if user not sign-in', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);

    const response = await request(app.getHttpServer())
      .post('/cards')
      .set('authorization', `Bearer ${token}`)
      .send({
        title: 'itau',
        cardNumber: faker.string.alphanumeric({ length: 16 }),
        name: faker.person.firstName(),
        cvc: faker.string.alphanumeric({ length: 3 }),
        date: new Date(),
        password: faker.internet.password(),
        virtual: faker.datatype.boolean(),
        type: 'credito',
      });

    expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('Post /cards => should return 201 created a card', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);
    await UserFactory.session(prisma, user.id, token);

    const response = await request(app.getHttpServer())
      .post('/cards')
      .set('authorization', `Bearer ${token}`)
      .send({
        title: 'itau',
        cardNumber: faker.string.alphanumeric({ length: 16 }),
        name: faker.person.firstName(),
        cvc: faker.string.alphanumeric({ length: 3 }),
        date: new Date(),
        password: faker.internet.password(),
        virtual: faker.datatype.boolean(),
        type: 'credito',
      });

    expect(response.statusCode).toBe(HttpStatus.CREATED);
  });

  it('Post /cards => should return 400 if body has invalid data', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);
    await UserFactory.session(prisma, user.id, token);

    const response = await request(app.getHttpServer())
      .post('/cards')
      .set('authorization', `Bearer ${token}`)
      .send({});
    expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('Post /cards => should return 409 if user try to create a card with the same title', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);
    await UserFactory.session(prisma, user.id, token);
    const card = await new CardFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .post('/cards')
      .set('authorization', `Bearer ${token}`)
      .send({
        title: card.title,
        cardNumber: faker.string.alphanumeric({ length: 16 }),
        name: faker.person.firstName(),
        cvc: faker.string.alphanumeric({ length: 3 }),
        date: new Date(),
        password: faker.internet.password(),
        virtual: faker.datatype.boolean(),
        type: 'credito',
      });
    expect(response.statusCode).toBe(HttpStatus.CONFLICT);
  });

  it('Post /cards => should return 201 if created a card with the same title by another user', async () => {
    const user = await UserFactory.build(prisma);
    const user2 = await UserFactory.build(prisma);

    const token = E2EUtils.generateValidToken(user);
    const token2 = E2EUtils.generateValidToken(user2);

    await UserFactory.session(prisma, user.id, token);
    await UserFactory.session(prisma, user2.id, token2);

    const card = await new CardFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .post('/cards')
      .set('authorization', `Bearer ${token2}`)
      .send({
        title: card.title,
        cardNumber: faker.string.alphanumeric({ length: 16 }),
        name: faker.person.firstName(),
        cvc: faker.string.alphanumeric({ length: 3 }),
        date: new Date(),
        password: faker.internet.password(),
        virtual: faker.datatype.boolean(),
        type: 'credito',
      });
    expect(response.statusCode).toBe(HttpStatus.CREATED);
  });

  it('GET /cards => should return 401 if user is not login', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);

    await new CardFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .get('/cards')
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('GET /cards => should return 401 if token is not valid', async () => {
    const user = await UserFactory.build(prisma);
    const token = '';

    await new CardFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .get('/cards')
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('GET /cards => should return 200 all cards users', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);
    await UserFactory.session(prisma, user.id, token);

    await new CardFactory().build(prisma, user.id);
    await new CardFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .get('/cards')
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.body).toHaveLength(2);
  });

  it('GET /cards => should return 200 all cards by another users', async () => {
    const user = await UserFactory.build(prisma);
    const user2 = await UserFactory.build(prisma);

    const token = E2EUtils.generateValidToken(user);
    const token2 = E2EUtils.generateValidToken(user2);

    await UserFactory.session(prisma, user.id, token);
    await UserFactory.session(prisma, user2.id, token2);

    await new CardFactory().build(prisma, user.id);
    await new CardFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .get('/cards')
      .set('authorization', `Bearer ${token2}`);
    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.body).toHaveLength(0);
  });

  it('GET /cards/:id => should return 403 if id dont belong to user', async () => {
    const user = await UserFactory.build(prisma);
    const user2 = await UserFactory.build(prisma);

    const token = E2EUtils.generateValidToken(user);
    const token2 = E2EUtils.generateValidToken(user2);

    await UserFactory.session(prisma, user.id, token);
    await UserFactory.session(prisma, user2.id, token2);

    const card = await new CardFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .get(`/cards/${card.id}`)
      .set('authorization', `Bearer ${token2}`);

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  it('GET /cardss/:id => should return 404 if id dont exist', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);
    await UserFactory.session(prisma, user.id, token);

    await new CardFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .get(`/cards/1`)
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('GET /cards/:id => should return 200 if card by id', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);
    await UserFactory.session(prisma, user.id, token);
    const card = await new CardFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .get(`/cards/${card.id}`)
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(HttpStatus.OK);
  });

  it('DELETE /cards => should return 401 if user is not login', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);

    const card = await new CardFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .delete(`/cards/${card.id}`)
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('DELETE /cards => should return 401 if token is not valid', async () => {
    const user = await UserFactory.build(prisma);
    const token = '';

    const card = await new CardFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .delete(`/cards/${card.id}`)
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('DELETE /cards/:id => should return 404 if card id not exist', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);
    await UserFactory.session(prisma, user.id, token);
    await new CardFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .delete(`/cards/1`)
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('DELETE /cards/:id => should return 403 if id dont belong to user', async () => {
    const user = await UserFactory.build(prisma);
    const user2 = await UserFactory.build(prisma);

    const token = E2EUtils.generateValidToken(user);
    const token2 = E2EUtils.generateValidToken(user2);

    await UserFactory.session(prisma, user.id, token);
    await UserFactory.session(prisma, user2.id, token2);

    const card = await new CardFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .delete(`/cards/${card.id}`)
      .set('authorization', `Bearer ${token2}`);

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  it('DELETE /cards/:id => should return 200 if card by id', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);
    await UserFactory.session(prisma, user.id, token);
    const card = await new CardFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .delete(`/cards/${card.id}`)
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(HttpStatus.OK);
  });
});
