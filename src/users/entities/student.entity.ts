import { Column, Entity, ManyToMany } from 'typeorm';
import { User } from './user.entity';
import { Discipline } from 'src/disciplines/discipline.entity';
import { Session } from 'src/sessions/session.entity';

@Entity()
export class Student extends User {
  @ManyToMany(() => Discipline, (discipline) => discipline.students, {
    onDelete: 'CASCADE',
  })
  disciplines: Discipline[];

  @Column({
    type: 'varchar',
    nullable: false,
  })
  course: string;

  @ManyToMany(() => Session, (session) => session.presentStudents, {
    onDelete: 'CASCADE',
  })
  presentSessions?: Session[];

  @ManyToMany(() => Session, (session) => session.absentStudents, {
    onDelete: 'CASCADE',
  })
  absentSessions?: Session[];
}
