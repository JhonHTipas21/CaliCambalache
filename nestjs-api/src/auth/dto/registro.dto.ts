import { IsString, IsEmail, MinLength, MaxLength, Matches, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegistroDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  nombre: string;

  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Debe tener mínimo 1 mayúscula y 1 número',
  })
  password: string;

  @IsString()
  passwordConfirm: string;

  @IsEnum(['donante', 'receptora'])
  rol: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  ubicacionCali?: string;
}
