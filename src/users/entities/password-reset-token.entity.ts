import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { Teacher } from './teacher.entity';

@Entity()
export class PasswordResetToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
    unique: true,
  })
  token: string;

  @ManyToOne(() => Student, { onDelete: 'CASCADE', nullable: true })
  student: Student;

  @ManyToOne(() => Teacher, { onDelete: 'CASCADE', nullable: true })
  teacher: Teacher;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  email: string;

  @Column({
    type: 'enum',
    enum: ['STUDENT', 'TEACHER'],
    nullable: false,
  })
  userType: 'STUDENT' | 'TEACHER';

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  expiresAt: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  used: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
