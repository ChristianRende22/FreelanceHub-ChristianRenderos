import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ServicesService } from '../services/services.service';

@ApiTags('Public')
@Controller('public')
export class PublicController {
  constructor(private readonly servicesService: ServicesService) {}

  // GET /public/services — completamente público, sin guard ni token
  // Devuelve title, category, price y nombre del freelancer
  @ApiOperation({ summary: 'Ver todos los servicios disponibles (sin autenticación)' })
  @Get('services')
  findAll() {
    return this.servicesService.findAllPublic();
  }
}
