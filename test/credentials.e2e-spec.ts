import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { E2EUtils } from './utils/e2e-utils';
import { UserFactory } from './factories/user.factory';
import { faker } from '@faker-js/faker';
import { CredentialFactory } from './factories/credential.factory';

describe('Credentials (e2e)', () => {
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

  it('Post /credentials => should return 401 unauthorized if token is invalid', async () => {
    await UserFactory.build(prisma);
    const token = '';

    const response = await request(app.getHttpServer())
      .post('/credentials')
      .set('authorization', `Bearer ${token}`)
      .send({
        title: faker.company.name(),
        url: faker.internet.url(),
        username: faker.internet.avatar(),
        password: faker.internet.password(),
      });

    expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('Post /credentials => should return 401 unauthorized if user not sign-in', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);

    const response = await request(app.getHttpServer())
      .post('/credentials')
      .set('authorization', `Bearer ${token}`)
      .send({
        title: faker.company.name(),
        url: faker.internet.url(),
        username: faker.internet.avatar(),
        password: faker.internet.password(),
      });

    expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('Post /credentials => should return 201 created a credentials', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);
    await UserFactory.session(prisma, user.id, token);

    const response = await request(app.getHttpServer())
      .post('/credentials')
      .set('authorization', `Bearer ${token}`)
      .send({
        title: faker.company.name(),
        url: faker.internet.url(),
        username: faker.internet.avatar(),
        password: faker.internet.password(),
      });

    expect(response.statusCode).toBe(HttpStatus.CREATED);
  });

  it('Post /credentials => should return 400 if body has invalid data', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);
    await UserFactory.session(prisma, user.id, token);

    const response = await request(app.getHttpServer())
      .post('/credentials')
      .set('authorization', `Bearer ${token}`)
      .send({
        title: faker.company.name(),
        url: faker.internet.url(),
        username: faker.internet.avatar(),
      });
    expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('Post /credentials => should return 409 if user try to create a credential with the same title', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);
    await UserFactory.session(prisma, user.id, token);
    const credential = await new CredentialFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .post('/credentials')
      .set('authorization', `Bearer ${token}`)
      .send({
        title: credential.title,
        url: faker.internet.url(),
        username: faker.internet.avatar(),
        password: faker.internet.password(),
      });
    expect(response.statusCode).toBe(HttpStatus.CONFLICT);
  });

  it('Post /credentials => should return 201 if created a credential with the same title by another user', async () => {
    const user = await UserFactory.build(prisma);
    const user2 = await UserFactory.build(prisma);

    const token = E2EUtils.generateValidToken(user);
    const token2 = E2EUtils.generateValidToken(user2);

    await UserFactory.session(prisma, user.id, token);
    await UserFactory.session(prisma, user2.id, token2);

    const credential = await new CredentialFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .post('/credentials')
      .set('authorization', `Bearer ${token2}`)
      .send({
        title: credential.title,
        url: faker.internet.url(),
        username: faker.internet.avatar(),
        password: faker.internet.password(),
      });
    expect(response.statusCode).toBe(HttpStatus.CREATED);
  });

  it('GET /credentials => should return 401 if user is not login', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);

    await new CredentialFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .get('/credentials')
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('GET /credentials => should return 401 if token is not valid', async () => {
    const user = await UserFactory.build(prisma);
    const token = '';

    await new CredentialFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .get('/credentials')
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('GET /credentials => should return 200 all credentials users', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);
    await UserFactory.session(prisma, user.id, token);

    await new CredentialFactory().build(prisma, user.id);
    await new CredentialFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .get('/credentials')
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.body).toHaveLength(2);
  });

  it('GET /credentials => should return 200 all credentials by another users', async () => {
    const user = await UserFactory.build(prisma);
    const user2 = await UserFactory.build(prisma);

    const token = E2EUtils.generateValidToken(user);
    const token2 = E2EUtils.generateValidToken(user2);

    await UserFactory.session(prisma, user.id, token);
    await UserFactory.session(prisma, user2.id, token2);

    await new CredentialFactory().build(prisma, user.id);
    await new CredentialFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .get('/credentials')
      .set('authorization', `Bearer ${token2}`);
    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.body).toHaveLength(0);
  });

  it('GET /credentials/:id => should return 403 if id dont belong to user', async () => {
    const user = await UserFactory.build(prisma);
    const user2 = await UserFactory.build(prisma);

    const token = E2EUtils.generateValidToken(user);
    const token2 = E2EUtils.generateValidToken(user2);

    await UserFactory.session(prisma, user.id, token);
    await UserFactory.session(prisma, user2.id, token2);

    const credential = await new CredentialFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .get(`/credentials/${credential.id}`)
      .set('authorization', `Bearer ${token2}`);

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  it('GET /credentials/:id => should return 404 if id dont exist', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);
    await UserFactory.session(prisma, user.id, token);

    await new CredentialFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .get(`/credentials/1`)
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('GET /credentials/:id => should return 200 if credential by id', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);
    await UserFactory.session(prisma, user.id, token);
    const credential = await new CredentialFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .get(`/credentials/${credential.id}`)
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(HttpStatus.OK);
  });

  it('DELETE /credentials => should return 401 if user is not login', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);

    const credential = await new CredentialFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .delete(`/credentials/${credential.id}`)
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('DELETE /credentials => should return 401 if token is not valid', async () => {
    const user = await UserFactory.build(prisma);
    const token = '';

    const credential = await new CredentialFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .delete(`/credentials/${credential.id}`)
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('DELETE /credentials/:id => should return 404 if credential id not exist', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);
    await UserFactory.session(prisma, user.id, token);
    await new CredentialFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .delete(`/credentials/1`)
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('DELETE /credentials/:id => should return 403 if id dont belong to user', async () => {
    const user = await UserFactory.build(prisma);
    const user2 = await UserFactory.build(prisma);

    const token = E2EUtils.generateValidToken(user);
    const token2 = E2EUtils.generateValidToken(user2);

    await UserFactory.session(prisma, user.id, token);
    await UserFactory.session(prisma, user2.id, token2);

    const credential = await new CredentialFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .delete(`/credentials/${credential.id}`)
      .set('authorization', `Bearer ${token2}`);

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  it('DELETE /credentials/:id => should return 200 if credential by id', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);
    await UserFactory.session(prisma, user.id, token);
    const credential = await new CredentialFactory().build(prisma, user.id);

    const response = await request(app.getHttpServer())
      .delete(`/credentials/${credential.id}`)
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(HttpStatus.OK);
  });
});
