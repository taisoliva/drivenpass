import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { E2EUtils } from './utils/e2e-utils';
import { UserFactory } from './factories/user.factory';
import { fa, faker } from '@faker-js/faker';
import { CredentialFactory } from './factories/credential.factory';

describe('Credentials (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();

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

  it('Post /credentials => should return 409 if created a credential with the same title', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);
    await UserFactory.session(prisma, user.id, token);
    const credential = await CredentialFactory.build(prisma, user.id);

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

    const credential = await CredentialFactory.build(prisma, user.id);

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

  /* it('Post /users/sign-up => should return 409 when email already is used', async () => {
    const user = await UserFactory.build(prisma);

    const response = await request(app.getHttpServer())
      .post('/users/sign-up')
      .send({
        email: user.email,
        password: 'S#nhaF3orte!',
      });
    expect(response.body.statusCode).toBe(HttpStatus.CONFLICT);
  });

  it('Post /users/sign-up => should return 400 if password is not strong enough', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/sign-up')
      .send({
        email: faker.internet.email(),
        password: '123456',
      });

    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('Post /users/sign-in => should return 200 when user login', async () => {
    const user = await UserFactory.build(prisma);
    await request(app.getHttpServer())
      .post('/users/sign-in')
      .send({
        email: user.email,
        password: 'S#nhaF3orte!',
      })
      .expect(HttpStatus.OK);
  });

  it('Post /users/sign-in => should return 401 if email or password is invalid', async () => {
    const user = await UserFactory.build(prisma);
    await request(app.getHttpServer())
      .post('/users/sign-in')
      .send({
        email: user.email,
        password: 'S#nhaF3orte!!',
      })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('Post /users/sign-in => should return userId and token', async () => {
    const user = await UserFactory.build(prisma);
    const response = await request(app.getHttpServer())
      .post('/users/sign-in')
      .send({
        email: user.email,
        password: 'S#nhaF3orte!',
      });
    const session = await prisma.session.findFirst({
      where: {
        userId: user.id,
      },
    });
    expect(response.body.userId).toBe(user.id);
    expect(response.body.token).toBe(session.token);
  }); */
});
