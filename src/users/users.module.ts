import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Registra la entidad User para este módulo
  providers: [UsersService],
  exports: [UsersService], // Exportado para que AuthModule lo pueda inyectar
})
export class UsersModule {}
