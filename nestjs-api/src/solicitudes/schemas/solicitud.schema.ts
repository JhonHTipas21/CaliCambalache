import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Usuario } from '../../usuarios/schemas/usuario.schema';
import { Publicacion } from '../../publicaciones/schemas/publicacion.schema';

export type SolicitudDocument = Solicitud & Document;

@Schema({ timestamps: true })
export class Solicitud {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Publicacion', required: true, index: true })
  publicacion: Publicacion | string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Usuario', required: true, index: true })
  receptora: Usuario | string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Usuario', required: true, index: true })
  donante: Usuario | string;

  @Prop({ required: true, trim: true })
  mensaje: string;

  @Prop({ required: true, enum: ['pendiente', 'aprobada', 'rechazada', 'entregada'], default: 'pendiente', index: true })
  estado: string;
}

export const SolicitudSchema = SchemaFactory.createForClass(Solicitud);
