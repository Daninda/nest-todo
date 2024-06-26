import { ApiProperty } from '@nestjs/swagger';
import { TodoColumn } from 'src/modules/column/column.model';
import { User } from 'src/modules/user/user.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskField } from '../task-field/task-field.model';

@Entity()
export class Project {
  @ApiProperty({ description: 'project id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'project name', example: 'Project name' })
  @Column()
  name: string;

  @ApiProperty({
    description: 'project description',
    example: 'Project description',
  })
  @Column()
  description: string;

  @ApiProperty({ description: 'user creating date' })
  @CreateDateColumn()
  createAt: Date;

  @ApiProperty({ description: 'user updating date' })
  @UpdateDateColumn()
  updateAt: Date;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => TodoColumn, (todoColumn) => todoColumn.project)
  columns: TodoColumn[];

  @OneToMany(() => TaskField, (taskField) => taskField.project)
  taskFields: TaskField[];
}
