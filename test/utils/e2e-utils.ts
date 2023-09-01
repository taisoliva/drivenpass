import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';

export class E2EUtils {
  static async cleanDB(prisma: PrismaService) {
    await prisma.card.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.note.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  }

  private static EXPIRATION_TIME = '7 days';
  private static ISSUER = 'Tais';
  private static AUDIENCE = 'users';

  static generateValidToken(user: User) {
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: this.EXPIRATION_TIME,
        subject: String(user.id),
        issuer: this.ISSUER,
        audience: this.AUDIENCE,
      },
    );
    return token;
  }
}
