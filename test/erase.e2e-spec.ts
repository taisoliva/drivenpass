import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { E2EUtils } from './utils/e2e-utils';
import { UserFactory } from './factories/user.factory';
import { faker } from '@faker-js/faker';

describe('Notes (e2e)', () => {
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

  it('DELETE /erase => should return 401 if user is not login', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);

    const response = await request(app.getHttpServer())
      .delete(`/erase`)
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('DELETE /erase => should return 401 if token is not valid', async () => {
    await UserFactory.build(prisma);
    const token = '';

    const response = await request(app.getHttpServer())
      .delete(`/erase`)
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('DELETE /erase => should return 401 if password is wrong', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);
    await UserFactory.session(prisma, user.id, token);

    const response = await request(app.getHttpServer())
      .delete(`/erase`)
      .set('authorization', `Bearer ${token}`)
      .send({
        password: faker.internet.password(),
      });
    expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('DELETE /erase => should return 200 ', async () => {
    const user = await UserFactory.build(prisma);
    const token = E2EUtils.generateValidToken(user);
    await UserFactory.session(prisma, user.id, token);

    const response = await request(app.getHttpServer())
      .delete(`/erase`)
      .set('authorization', `Bearer ${token}`)
      .send({
        password: 'S#nhaF3orte!',
      });
    expect(response.statusCode).toBe(HttpStatus.OK);
  });
});
