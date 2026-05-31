import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

@Schema({ timestamps: true })
export class Usuario {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email: string;

  // Opcional: usuarios OAuth no tienen contraseña local
  @Prop({ select: false })
  password?: string;

  @Prop({ required: true, enum: ['donante', 'receptora', 'admin'], default: 'donante', index: true })
  rol: string;

  @Prop()
  telefono?: string;

  @Prop()
  ubicacionCali?: string;

  @Prop({ default: true, index: true })
  activo: boolean;

  @Prop()
  ultimoAcceso?: Date;

  @Prop({ select: false })
  refreshToken?: string;

  // ── OAuth Google ──
  @Prop({ sparse: true, index: true })
  googleId?: string;

  @Prop()
  avatar?: string;

  // Indica si la cuenta fue creada via OAuth (sin contraseña local)
  @Prop({ default: false })
  esOAuth: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);

UsuarioSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};
