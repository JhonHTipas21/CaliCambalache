import { CreateMensajeDto } from './create-mensaje.dto';

// Partial representa que todas las propiedades de CreateMensajeDto son opcionales
export class UpdateMensajeDto extends CreateMensajeDto {
  readonly isRead?: boolean;
}
