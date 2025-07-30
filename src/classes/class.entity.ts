import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
