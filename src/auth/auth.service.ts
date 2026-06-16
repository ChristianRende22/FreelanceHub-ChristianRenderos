import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    // 1. Buscar usuario por email
    const user = await this.usersService.findByEmail(email);

    // 2. Si no existe o la contraseña no coincide → 401
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3. Crear el payload que va dentro del JWT
    // sub = subject (estándar JWT), usamos el id del usuario
    const payload = { sub: user.id, email: user.email };

    // 4. Firmar y retornar el token
    return { access_token: this.jwtService.sign(payload) };
  }
}
