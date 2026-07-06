import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentMatchmaker } from '../common/decorators/current-matchmaker.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Quick way to verify the token works end-to-end from the frontend.
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentMatchmaker() matchmaker: { id: string; email: string }) {
    return matchmaker;
  }
}
