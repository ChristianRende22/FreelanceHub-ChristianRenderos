import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

// DTO = Data Transfer Object
// Valida y tipifica exactamente lo que el cliente debe enviar en el body
// ValidationPipe en main.ts lo activa automáticamente
export class CreateServiceDto {
  @ApiProperty({ example: 'Landing Page Profesional' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Desarrollo Web' })
  @IsString()
  category: string;

  @ApiProperty({ example: 'Diseño y desarrollo de landing page responsive' })
  @IsString()
  description: string;

  @ApiProperty({ example: 150 })
  @IsNumber()
  price: number;
}
