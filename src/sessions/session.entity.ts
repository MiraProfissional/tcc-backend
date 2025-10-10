import { Discipline } from 'src/disciplines/discipline.entity';
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
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'date',
    nullable: false,
  })
  day: string;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  startedAt: Date;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  endedAt: Date;

  @Column({
    type: 'int',
    nullable: false,
  })
  cameraIndex: number;

  @ManyToOne(() => Discipline, (discipline) => discipline.sessions)
  discipline: Discipline;

  @ManyToOne(() => Teacher, (teacher) => teacher.sessionResponsible, {
    eager: true,
  })
  openedBy: Teacher;

  @ManyToMany(() => Student, (student) => student.presentSessions, {
    eager: true,
  })
  @JoinTable()
  presentStudents: Student[];

  @ManyToMany(() => Student, (student) => student.absentSessions, {
    eager: true,
  })
  @JoinTable()
  absentStudents: Student[];

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
