import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { PublicModule } from './public/public.module';
import { User } from './users/user.entity';
import { Service } from './services/service.entity';

@Module({
  imports: [
    // Lee el .env y lo hace disponible en toda la app con ConfigService
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexión a PostgreSQL usando las variables del .env
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST') || 'localhost',
        port: parseInt(config.get<string>('DB_PORT') ?? '5432'),
        username: config.get<string>('DB_USERNAME') || 'postgres',
        password: config.get<string>('DB_PASSWORD') || 'BBo',
        database: config.get<string>('DB_NAME') || 'freelancehub',
        entities: [User, Service], // Entidades que TypeORM va a mapear a tablas
        synchronize: true, // Crea/actualiza tablas automáticamente (solo dev)
        logging: false,
      }),
    }),

    AuthModule,
    UsersModule,
    ServicesModule,
    PublicModule,
  ],
})
export class AppModule {}
