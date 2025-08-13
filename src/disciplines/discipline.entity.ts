import { Student } from 'src/users/entities/student.entity';
import { Teacher } from 'src/users/entities/teacher.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Discipline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 24,
    nullable: false,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 24,
    nullable: false,
  })
  semester: string;

  @Column('text', {
    array: true,
    nullable: false,
  })
  classTime: string[];

  @Column({
    type: 'varchar',
    length: 24,
    nullable: false,
  })
  classRoom: string;

  @Column({
    type: 'varchar',
    length: 24,
    nullable: false,
  })
  ipCamera: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.disciplines)
  teacher: Teacher;

  @ManyToMany(() => Student, (student) => student.disciplines)
  @JoinTable()
  students?: Student[];

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
