import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard que protege rutas: verifica el JWT antes de dejar pasar el request
// Si el token es inválido, expiró, o no existe → 401 automáticamente
// Se usa con @UseGuards(JwtAuthGuard) en cualquier controller o método
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
