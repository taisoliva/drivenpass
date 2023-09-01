import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  private EXPIRATION_TIME = '7 days';
  private ISSUER = 'Tais';
  private AUDIENCE = 'users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email } = signUpDto;
    const user = await this.usersService.findEmail(email);

    if (user !== null) {
      throw new ConflictException('email alread in use');
    }

    return await this.usersService.create(signUpDto);
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.usersService.findEmail(email);

    if (!user) throw new UnauthorizedException('Email or password not valid.');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Email or password not valid.');

    return await this.usersService.createSession(
      user.id,
      await this.createToken(user),
    );
  }

  private async createToken(user: User) {
    const { id, email } = user;

    const token = this.jwtService.sign(
      { id, email },
      {
        expiresIn: this.EXPIRATION_TIME,
        subject: String(id),
        issuer: this.ISSUER,
        audience: this.AUDIENCE,
      },
    );

    return token;
  }

  checkToken(token: string) {
    const data = this.jwtService.verify(token, {
      audience: this.AUDIENCE,
      issuer: this.ISSUER,
    });

    return data;
  }
}
