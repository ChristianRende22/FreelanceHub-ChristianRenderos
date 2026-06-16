# FreelanceHub API — Implementation Plan

> **REQUIRED:** Use sp-executing-plans to implement this plan task-by-task.
> Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** API REST NestJS para plataforma freelance con JWT auth, TypeORM + PostgreSQL, Swagger.
**Architecture:** Módulos independientes (auth/users/services/public), entidades User y Service con relación ManyToOne, seed automático en bootstrap, rutas públicas y protegidas separadas.
**Tech Stack:** NestJS 10, TypeScript, TypeORM, PostgreSQL, passport-jwt, @nestjs/swagger, class-validator.

---

## File Map

```
FreelanceHubApi-202452662-ChristianRenderos/
├── .env
├── .env.example
├── package.json           ← generado por nest new
├── tsconfig.json          ← generado por nest new
├── nest-cli.json          ← generado por nest new
└── src/
    ├── main.ts
    ├── app.module.ts
    ├── auth/
    │   ├── auth.module.ts
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── jwt.strategy.ts
    │   ├── jwt-auth.guard.ts
    │   └── dto/
    │       └── login.dto.ts
    ├── users/
    │   ├── users.module.ts
    │   ├── user.entity.ts
    │   └── users.service.ts   ← incluye seed en onApplicationBootstrap
    ├── services/
    │   ├── services.module.ts
    │   ├── service.entity.ts
    │   ├── services.service.ts
    │   ├── services.controller.ts
    │   └── dto/
    │       └── create-service.dto.ts
    └── public/
        ├── public.module.ts
        └── public.controller.ts
```

---

## Task 1: Scaffold + Install Dependencies

**Files:**
- Create: proyecto base NestJS en carpeta actual

- [ ] **Step 1: Scaffold NestJS**
```bash
cd /sessions/relaxed-brave-planck/mnt/Api/apiParcial/FreelanceHubApi-202452662-ChristianRenderos
npx @nestjs/cli new . --package-manager npm --skip-git --language TypeScript
```
Cuando pregunte si sobreescribir: presionar `y` o usar `--skip-git`.

- [ ] **Step 2: Install deps**
```bash
cd /sessions/relaxed-brave-planck/mnt/Api/apiParcial/FreelanceHubApi-202452662-ChristianRenderos
npm install @nestjs/typeorm typeorm pg @nestjs/jwt @nestjs/passport passport passport-jwt class-validator class-transformer @nestjs/config @nestjs/swagger swagger-ui-express
npm install --save-dev @types/passport-jwt
```

- [ ] **Step 3: Verify install**
```bash
npm run build 2>&1 | tail -5
```
Expected: `Successfully compiled` o sin errores críticos.

- [ ] **Step 4: Create .env**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=freelancehub
JWT_SECRET=freelancehubsecret
PORT=3000
```
Guardar como `.env` y `.env.example` en raíz del proyecto.

---

## Task 2: User Entity + UsersModule + Seed

**Files:**
- Create: `src/users/user.entity.ts`
- Create: `src/users/users.service.ts`
- Create: `src/users/users.module.ts`

- [ ] **Step 1: user.entity.ts**
```typescript
// src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;
}
```

- [ ] **Step 2: users.service.ts** (con seed automático)
```typescript
// src/users/users.service.ts
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

  async onApplicationBootstrap() {
    const count = await this.usersRepo.count();
    if (count === 0) {
      await this.usersRepo.save({
        email: 'freelancer@test.com',
        name: 'Juan Pérez',
        password: '123456',
      });
      console.log('✅ Seed: usuario inicial creado → freelancer@test.com / 123456');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }
}
```

- [ ] **Step 3: users.module.ts**
```typescript
// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

---

## Task 3: Service Entity + ServicesModule + ServicesService

**Files:**
- Create: `src/services/service.entity.ts`
- Create: `src/services/services.service.ts`
- Create: `src/services/services.module.ts`
- Create: `src/services/dto/create-service.dto.ts`

- [ ] **Step 1: service.entity.ts**
```typescript
// src/services/service.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  category: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'provider_id' })
  provider: User;
}
```

- [ ] **Step 2: create-service.dto.ts**
```typescript
// src/services/dto/create-service.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Landing Page Profesional' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Desarrollo' })
  @IsString()
  category: string;

  @ApiProperty({ example: 'Diseño y desarrollo de landing page responsive' })
  @IsString()
  description: string;

  @ApiProperty({ example: 150 })
  @IsNumber()
  price: number;
}
```

- [ ] **Step 3: services.service.ts**
```typescript
// src/services/services.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepo: Repository<Service>,
  ) {}

  async create(dto: CreateServiceDto, provider: User): Promise<Service> {
    const service = this.servicesRepo.create({ ...dto, provider });
    return this.servicesRepo.save(service);
  }

  async findAllPublic(): Promise<{ title: string; category: string; price: number; provider: string }[]> {
    const services = await this.servicesRepo.find();
    return services.map((s) => ({
      title: s.title,
      category: s.category,
      price: Number(s.price),
      provider: s.provider?.name ?? 'Unknown',
    }));
  }
}
```

- [ ] **Step 4: services.module.ts**
```typescript
// src/services/services.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service.entity';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  providers: [ServicesService],
  controllers: [ServicesController],
  exports: [ServicesService],
})
export class ServicesModule {}
```

---

## Task 4: Auth (JWT Login)

**Files:**
- Create: `src/auth/dto/login.dto.ts`
- Create: `src/auth/auth.service.ts`
- Create: `src/auth/jwt.strategy.ts`
- Create: `src/auth/jwt-auth.guard.ts`
- Create: `src/auth/auth.controller.ts`
- Create: `src/auth/auth.module.ts`

- [ ] **Step 1: login.dto.ts**
```typescript
// src/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'freelancer@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  password: string;
}
```

- [ ] **Step 2: auth.service.ts**
```typescript
// src/auth/auth.service.ts
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
    const user = await this.usersService.findByEmail(email);
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
```

- [ ] **Step 3: jwt.strategy.ts**
```typescript
// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'freelancehubsecret',
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
```

- [ ] **Step 4: jwt-auth.guard.ts**
```typescript
// src/auth/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

- [ ] **Step 5: auth.controller.ts**
```typescript
// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login → retorna JWT' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
```

- [ ] **Step 6: auth.module.ts**
```typescript
// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'freelancehubsecret',
      signOptions: { expiresIn: '24h' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
```

---

## Task 5: ServicesController (protegido)

**Files:**
- Create: `src/services/services.controller.ts`

- [ ] **Step 1: services.controller.ts**
```typescript
// src/services/services.controller.ts
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @ApiOperation({ summary: 'Crear servicio (requiere JWT)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateServiceDto, @Req() req) {
    return this.servicesService.create(dto, req.user);
  }
}
```

---

## Task 6: PublicController

**Files:**
- Create: `src/public/public.controller.ts`
- Create: `src/public/public.module.ts`

- [ ] **Step 1: public.controller.ts**
```typescript
// src/public/public.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ServicesService } from '../services/services.service';

@ApiTags('Public')
@Controller('public')
export class PublicController {
  constructor(private readonly servicesService: ServicesService) {}

  @ApiOperation({ summary: 'Ver todos los servicios (sin auth)' })
  @Get('services')
  findAll() {
    return this.servicesService.findAllPublic();
  }
}
```

- [ ] **Step 2: public.module.ts**
```typescript
// src/public/public.module.ts
import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [PublicController],
})
export class PublicModule {}
```

---

## Task 7: AppModule + main.ts

**Files:**
- Modify: `src/app.module.ts`
- Modify: `src/main.ts`

- [ ] **Step 1: app.module.ts**
```typescript
// src/app.module.ts
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
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST') || 'localhost',
        port: parseInt(config.get<string>('DB_PORT')) || 5432,
        username: config.get<string>('DB_USERNAME') || 'postgres',
        password: config.get<string>('DB_PASSWORD') || 'postgres',
        database: config.get<string>('DB_NAME') || 'freelancehub',
        entities: [User, Service],
        synchronize: true,
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
```

- [ ] **Step 2: main.ts**
```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('FreelanceHub API')
    .setDescription('API para plataforma de servicios freelance — ESEN 2026')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 FreelanceHub API: http://localhost:${port}`);
  console.log(`📖 Swagger: http://localhost:${port}/api`);
}
bootstrap();
```

---

## Task 8: Verify & Final Check

- [ ] **Step 1: Build check**
```bash
npm run build 2>&1 | tail -20
```
Expected: sin errores TypeScript.

- [ ] **Step 2: Start dev**
```bash
npm run start:dev
```
Expected en consola:
- `✅ Seed: usuario inicial creado`
- `🚀 FreelanceHub API: http://localhost:3000`
- `📖 Swagger: http://localhost:3000/api`

- [ ] **Step 3: Test POST /auth/login**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"freelancer@test.com","password":"123456"}'
```
Expected: `{"access_token":"eyJ..."}`

- [ ] **Step 4: Test POST /services (con token)**
```bash
curl -X POST http://localhost:3000/services \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Logo Profesional","category":"Diseño","description":"Diseño de logo SVG","price":50}'
```
Expected: objeto Service con id.

- [ ] **Step 5: Test GET /public/services**
```bash
curl http://localhost:3000/public/services
```
Expected:
```json
[{"title":"Logo Profesional","category":"Diseño","price":50,"provider":"Juan Pérez"}]
```

- [ ] **Step 6: Test POST /services sin token**
```bash
curl -X POST http://localhost:3000/services \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","category":"X","description":"Y","price":10}'
```
Expected: `401 Unauthorized`

- [ ] **Step 7: Checklist final**
Verificar contra rúbrica:
- [x] Estructura NestJS ✓
- [x] Entidades User + Service con ManyToOne ✓
- [x] JWT + AuthGuard ✓
- [x] GET /public/services (público) ✓
- [x] POST /services (protegido) ✓
- [x] Swagger en /api con BearerAuth ✓
- [x] DTOs con class-validator ✓
- [x] Seed usuario inicial ✓

---

## Endpoints Summary

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /auth/login | ❌ | Login → JWT |
| GET | /public/services | ❌ | Ver servicios públicos |
| POST | /services | ✅ JWT | Crear servicio |
