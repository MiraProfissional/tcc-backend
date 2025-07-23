import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Class {
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
    type: 'int',
    nullable: false,
  })
  semester: number;

  @Column('text', {
    array: true,
    nullable: false,
  })
  day: string[];

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  startTime: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  endTime: string;

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

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
