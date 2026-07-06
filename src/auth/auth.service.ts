import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.prisma.matchmaker.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const matchmaker = await this.prisma.matchmaker.create({
      data: { name: dto.name, email: dto.email, passwordHash },
    });

    return this.buildAuthResponse(matchmaker.id, matchmaker.email, matchmaker.name);
  }

  async login(dto: LoginDto) {
    const matchmaker = await this.prisma.matchmaker.findUnique({ where: { email: dto.email } });
    if (!matchmaker) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, matchmaker.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.buildAuthResponse(matchmaker.id, matchmaker.email, matchmaker.name);
  }

  private buildAuthResponse(id: string, email: string, name: string) {
    const accessToken = this.jwt.sign({ sub: id, email });
    return { accessToken, matchmaker: { id, email, name } };
  }
}
