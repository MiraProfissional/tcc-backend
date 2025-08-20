import { Column, Entity, ManyToMany } from 'typeorm';
import { User } from './user.entity';
import { Discipline } from 'src/disciplines/discipline.entity';

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
}
