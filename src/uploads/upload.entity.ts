import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { fileTypes } from './enums/file-types.enum';
import { Student } from 'src/users/entities/student.entity';

@Entity()
export class Upload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: fileTypes,
    default: fileTypes.IMAGE,
    nullable: false,
  })
  type: string;

  @OneToOne(() => Student, (student) => student.faceUpload, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  student: Student;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
