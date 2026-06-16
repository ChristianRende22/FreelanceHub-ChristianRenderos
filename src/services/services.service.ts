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

  // Crea un nuevo servicio asignando el usuario autenticado como provider
  // El provider viene del JWT, no del body
  async create(dto: CreateServiceDto, provider: User): Promise<any> {
    const service = this.servicesRepo.create({ ...dto, provider });
    const saved = await this.servicesRepo.save(service);
    // Excluir password del provider antes de retornar
    const { password, ...providerSafe } = saved.provider;
    return { ...saved, provider: providerSafe };
  }

  // Devuelve todos los servicios en formato reducido para la ruta pública
  // No expone password ni datos sensibles del usuario
  async findAllPublic(): Promise<{ title: string; category: string; price: number; provider: string }[]> {
    const services = await this.servicesRepo.find();
    return services.map((s) => ({
      title: s.title,
      category: s.category,
      price: Number(s.price),
      provider: s.provider?.name ?? 'Desconocido',
    }));
  }
}
