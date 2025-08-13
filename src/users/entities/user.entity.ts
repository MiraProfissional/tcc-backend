import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';

@Entity()
export abstract class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  dateBirth: Date;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  cpf: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  cellphone: string;

  @Column({
    type: 'int',
    nullable: false,
    unique: true,
  })
  registrationNumber: number;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  userRole: UserRole;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
