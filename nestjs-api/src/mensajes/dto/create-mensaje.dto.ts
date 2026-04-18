export class CreateMensajeDto {
  readonly sender_type: string;
  readonly sender_name: string;
  readonly content: string;
  readonly avatar?: string;
}
