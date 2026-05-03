import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from './schemas/usuario.schema';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<UsuarioDocument>,
  ) {}

  async findByEmail(email: string, incluirPassword = false): Promise<UsuarioDocument | null> {
    const query = this.usuarioModel.findOne({ email });
    if (incluirPassword) {
      query.select('+password +refreshToken');
    }
    return query.exec();
  }

  async findById(id: string): Promise<UsuarioDocument | null> {
    return this.usuarioModel.findById(id).exec();
  }

  async crearUsuario(datos: Partial<Usuario>): Promise<UsuarioDocument> {
    const nuevoUsuario = new this.usuarioModel(datos);
    return nuevoUsuario.save();
  }

  async actualizarUsuario(id: string, datos: Partial<Usuario>): Promise<UsuarioDocument | null> {
    return this.usuarioModel.findByIdAndUpdate(id, datos, { new: true }).exec();
  }

  async bloquearUsuario(id: string): Promise<void> {
    await this.actualizarUsuario(id, { activo: false });
  }

  async activarUsuario(id: string): Promise<void> {
    await this.actualizarUsuario(id, { activo: true });
  }
}
