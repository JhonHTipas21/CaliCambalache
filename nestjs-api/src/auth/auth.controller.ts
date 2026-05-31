import { Controller, Post, Body, Get, Patch, Request, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CambiarPasswordDto } from './dto/cambiar-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // ── OAuth 2.0 Google ──────────────────────────────────────────────────────

  /** Inicia el flujo OAuth — redirige al consent screen de Google */
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  iniciarGoogleOAuth() {
    // Passport intercepta y redirige automáticamente a Google
  }

  /** Callback de Google — genera tokens y redirige al frontend */
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Request() req, @Res() res: Response) {
    const { access_token, refresh_token } = req.user;
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5500';

    // Redirige al frontend con los tokens como query params
    return res.redirect(
      `${frontendUrl}/pages/oauth-callback.html?access_token=${access_token}&refresh_token=${refresh_token}`,
    );
  }

  // ── Auth tradicional ──────────────────────────────────────────────────────

  @Post('registro')
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  registro(@Body() dto: RegistroDto) {
    return this.authService.registro(dto);
  }

  @Post('login')
  @Throttle({ default: { limit: 100, ttl: 60000 } })
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
