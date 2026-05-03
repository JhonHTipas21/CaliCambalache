import { Injectable, ConflictException, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcryptjs from 'bcryptjs';

import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { CambiarPasswordDto } from './dto/cambiar-password.dto';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private generarTokens(payload: { sub: string; email: string; rol: string }) {
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: (this.configService.get<string>('JWT_EXPIRES_IN') || '8h') as any,
    });

    const refresh_token = this.jwtService.sign(
      { sub: payload.sub },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d') as any,
      },
    );

    return { access_token, refresh_token };
  }

  async registro(dto: RegistroDto) {
    if (dto.password !== dto.passwordConfirm) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const usuarioExistente = await this.usuariosService.findByEmail(dto.email);
    if (usuarioExistente) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const hashedPassword = await bcryptjs.hash(dto.password, 12);

    const nuevoUsuario = await this.usuariosService.crearUsuario({
      ...dto,
      password: hashedPassword,
    });

    const { access_token, refresh_token } = this.generarTokens({
      sub: nuevoUsuario._id.toString(),
      email: nuevoUsuario.email,
      rol: nuevoUsuario.rol,
    });

    const hashedRefreshToken = await bcryptjs.hash(refresh_token, 10);
    await this.usuariosService.actualizarUsuario(nuevoUsuario._id.toString(), {
      refreshToken: hashedRefreshToken,
    });

    const usuarioParaRetornar = nuevoUsuario.toJSON();

    return {
      usuario: usuarioParaRetornar,
      access_token,
      refresh_token,
    };
  }

  async login(dto: LoginDto) {
    const usuario = await this.usuariosService.findByEmail(dto.email, true);
    
    if (!usuario) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    let passwordValida = false;
    
    // Primero intentamos comparar asumiendo que es un hash de bcrypt
    try {
      passwordValida = await bcryptjs.compare(dto.password, usuario.password);
    } catch (e) {
      passwordValida = false;
    }

    // Si falla, verificamos si es una contraseña en texto plano (usuarios antiguos)
    if (!passwordValida) {
      if (dto.password === usuario.password) {
        passwordValida = true;
        // Opcional: Actualizar la contraseña a bcrypt de forma silenciosa para el futuro
        const hashedPassword = await bcryptjs.hash(dto.password, 12);
        await this.usuariosService.actualizarUsuario(usuario._id.toString(), { password: hashedPassword });
      } else {
        throw new UnauthorizedException('Email o contraseña incorrectos');
      }
    }

    if (!usuario.activo) {
      throw new ForbiddenException('Cuenta suspendida');
    }

    await this.usuariosService.actualizarUsuario(usuario._id.toString(), { ultimoAcceso: new Date() });

    const { access_token, refresh_token } = this.generarTokens({
      sub: usuario._id.toString(),
      email: usuario.email,
      rol: usuario.rol,
    });

    const hashedRefreshToken = await bcryptjs.hash(refresh_token, 10);
    await this.usuariosService.actualizarUsuario(usuario._id.toString(), {
      refreshToken: hashedRefreshToken,
    });

    const usuarioParaRetornar = usuario.toJSON();

    return {
      usuario: usuarioParaRetornar,
      access_token,
      refresh_token,
    };
  }

  async renovarTokens(userId: string, refreshToken: string) {
    const usuario = await this.usuariosService.findByEmail((await this.usuariosService.findById(userId)).email, true);
    
    if (!usuario || !usuario.refreshToken || !usuario.activo) {
      throw new ForbiddenException('No autorizado para renovar token');
    }

    const isValid = await bcryptjs.compare(refreshToken, usuario.refreshToken);
    if (!isValid) {
      throw new ForbiddenException('Refresh token inválido');
    }

    const tokens = this.generarTokens({
      sub: usuario._id.toString(),
      email: usuario.email,
      rol: usuario.rol,
    });

    const hashedRefreshToken = await bcryptjs.hash(tokens.refresh_token, 10);
    await this.usuariosService.actualizarUsuario(usuario._id.toString(), {
      refreshToken: hashedRefreshToken,
    });

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.usuariosService.actualizarUsuario(userId, { refreshToken: null });
  }

  async obtenerPerfil(userId: string) {
    return this.usuariosService.findById(userId);
  }

  async cambiarPassword(userId: string, dto: CambiarPasswordDto): Promise<void> {
    if (dto.passwordNueva !== dto.passwordNuevaConfirm) {
      throw new BadRequestException('Las contraseñas nuevas no coinciden');
    }

    const usuario = await this.usuariosService.findByEmail((await this.usuariosService.findById(userId)).email, true);
    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const passwordValida = await bcryptjs.compare(dto.passwordActual, usuario.password);
    if (!passwordValida) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    const hashedPassword = await bcryptjs.hash(dto.passwordNueva, 12);
    
    await this.usuariosService.actualizarUsuario(userId, {
      password: hashedPassword,
      refreshToken: null,
    });
  }
}
