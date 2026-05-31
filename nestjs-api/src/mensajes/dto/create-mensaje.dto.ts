export class CreateMensajeDto {
  readonly sender_type: string;
  readonly sender_name: string;
  readonly content: string;
  readonly avatar?: string;
  readonly solicitud?: string;
  readonly emisor?: string;
  readonly receptor?: string;
}
