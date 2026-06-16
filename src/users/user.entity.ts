import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Define la tabla "users" en PostgreSQL
// TypeORM con synchronize:true la crea automáticamente al iniciar
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number; // Auto-incremental, lo genera la DB

  @Column({ unique: true })
  email: string; // No puede repetirse en la tabla

  @Column()
  name: string;

  @Column()
  password: string; // Sin cifrado (requerimiento del parcial)
}
