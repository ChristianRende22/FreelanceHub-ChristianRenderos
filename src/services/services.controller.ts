import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // POST /services — solo usuarios con JWT válido pueden crear servicios
  // @UseGuards(JwtAuthGuard) bloquea la ruta si no hay token o es inválido
  // req.user lo inyecta JwtStrategy automáticamente después de validar el token
  @ApiOperation({ summary: 'Crear servicio (requiere JWT en Authorization header)' })
  @ApiBearerAuth() // Le dice a Swagger que esta ruta necesita Bearer token
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateServiceDto, @Req() req) {
    return this.servicesService.create(dto, req.user);
  }
}
