import { Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Discipline } from 'src/disciplines/discipline.entity';
import { Session } from 'src/sessions/session.entity';

@Entity()
export class Teacher extends User {
  @OneToMany(() => Discipline, (discipline) => discipline.teacher)
  disciplines: Discipline[];

  @OneToMany(() => Session, (session) => session.openedBy)
  sessionResponsible: Session[];
}
