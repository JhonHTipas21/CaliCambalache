import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

@Schema({ timestamps: true })
export class Usuario {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, enum: ['donante', 'receptora', 'admin'], index: true })
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
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);

UsuarioSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};
