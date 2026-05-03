import { IsString, MinLength, Matches } from 'class-validator';

export class CambiarPasswordDto {
  @IsString()
  passwordActual: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])/, {
    message: 'passwordNueva must contain at least 1 uppercase letter and 1 number',
  })
  passwordNueva: string;

  @IsString()
  passwordNuevaConfirm: string; // custom valid in service
}
