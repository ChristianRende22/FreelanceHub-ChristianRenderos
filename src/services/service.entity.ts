import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

// Define la tabla "services" en PostgreSQL
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

  // Relación: muchos servicios pertenecen a un User (freelancer)
  // eager:true → cuando busques un Service, traer el User automáticamente
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'provider_id' }) // Nombre de la columna FK en la tabla
  provider: User;
}
