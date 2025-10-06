import { Session } from 'src/sessions/session.entity';
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
  OneToMany,
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
  disciplineTime: string[];

  @Column({
    type: 'varchar',
    length: 24,
    nullable: false,
  })
  disciplineRoom: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  ipCamera: number;

  @ManyToOne(() => Teacher, (teacher) => teacher.disciplines, {
    eager: true,
  })
  teacher: Teacher;

  @ManyToMany(() => Student, (student) => student.disciplines, {
    eager: true,
  })
  @JoinTable()
  students?: Student[];

  @OneToMany(() => Session, (session) => session.discipline)
  sessions?: Session[];

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
