import { Discipline } from 'src/disciplines/discipline.entity';
import { Student } from 'src/users/entities/student.entity';
import { Teacher } from 'src/users/entities/teacher.entity';

export interface CreateSession {
  startedAt: Date;
  endedAt: Date;
  cameraIndex: number;
  discipline: Discipline;
  openedBy: Teacher;
  presentStudents: Student[];
  absentStudents: Student[];
}
