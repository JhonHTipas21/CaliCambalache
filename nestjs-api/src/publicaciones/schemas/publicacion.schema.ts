import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Usuario } from '../../usuarios/schemas/usuario.schema';

export type PublicacionDocument = Publicacion & Document;

@Schema({ timestamps: true })
export class Publicacion {
  @Prop({ required: true, trim: true })
  titulo: string;

  @Prop({ required: true, trim: true })
  descripcion: string;

  @Prop({ required: true, enum: ['perecedero', 'no_perecedero', 'preparado'] })
  categoria: string;

  @Prop({ required: true, trim: true })
  cantidad: string;

  @Prop({ required: true })
  fechaLimite: Date;

  @Prop({ required: true, trim: true })
  ubicacion: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Usuario', required: true, index: true })
  donante: Usuario | string;

  @Prop({ required: true, enum: ['activo', 'solicitado', 'entregado'], default: 'activo', index: true })
  estado: string;
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);
