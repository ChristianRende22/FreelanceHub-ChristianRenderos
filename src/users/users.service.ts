import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  // Se ejecuta automáticamente cuando NestJS termina de iniciar
  // Si la tabla users está vacía, inserta el freelancer de prueba
  async onApplicationBootstrap() {
    const count = await this.usersRepo.count();
    if (count === 0) {
      await this.usersRepo.save({
        email: 'freelancer@test.com',
        name: 'Juan Pérez',
        password: '123456',
      });
      console.log('✅ Seed: usuario creado → freelancer@test.com / 123456');
    }
  }

  // Usado por AuthService para validar login
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  // Usado por JwtStrategy para reconstruir req.user desde el token
  async findById(id: number): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }
}
