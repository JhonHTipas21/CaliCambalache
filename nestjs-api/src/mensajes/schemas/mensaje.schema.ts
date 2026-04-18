import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MensajeDocument = Mensaje & Document;

@Schema({ timestamps: true })
export class Mensaje {
  @Prop({ required: true })
  sender_type: string; // 'system' o 'user' o 'fundacion'

  @Prop({ required: true })
  sender_name: string; // Ej: 'Asistente CaliCambalache', 'Comedor Esperanza'

  @Prop({ required: true })
  content: string; // Contenido del mensaje

  @Prop({ default: Date.now })
  time: Date; // Timestamp opcional de envío

  @Prop({ default: '🤖' })
  avatar: string; // Un emoji o una URL pequeña

  @Prop({ default: false })
  isRead: boolean; // Si ha sido leído
}

// Genera el esquema de mongoose
export const MensajeSchema = SchemaFactory.createForClass(Mensaje);
