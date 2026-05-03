import { Controller, Post, Body, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CambiarPasswordDto } from './dto/cambiar-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registro')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  registro(@Body() dto: RegistroDto) {
    return this.authService.registro(dto);
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 900000 } })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  renovarTokens(@Body() dto: RefreshTokenDto, @Request() req) {
    return this.authService.renovarTokens(req.user.userId, dto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Request() req) {
    return this.authService.logout(req.user.userId);
  }

  @Get('perfil')
  @UseGuards(JwtAuthGuard)
  obtenerPerfil(@Request() req) {
    return this.authService.obtenerPerfil(req.user.userId);
  }

  @Patch('cambiar-password')
  @UseGuards(JwtAuthGuard)
  cambiarPassword(@Body() dto: CambiarPasswordDto, @Request() req) {
    return this.authService.cambiarPassword(req.user.userId, dto);
  }
}
