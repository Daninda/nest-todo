import { ApiProperty } from '@nestjs/swagger';
import { TodoColumn } from 'src/modules/column/column.model';
import { Project } from 'src/modules/project/project.model';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskFieldValueNumber } from '../task-field-value/task-field-value.number.model';
import { TaskFieldValueString } from '../task-field-value/task-field-value.string.model';
import { TaskFieldTypeEnum } from './task-field.utils';

@Entity()
export class TaskField {
  @ApiProperty({ description: 'task field id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'task field name',
    example: 'Task field name',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'task field type',
    enum: TaskFieldTypeEnum,
    example: 'number',
  })
  @Column({
    type: 'enum',
    enum: TaskFieldTypeEnum,
  })
  type: TaskFieldTypeEnum;

  @ApiProperty({ description: 'task field creating date' })
  @CreateDateColumn()
  createAt: Date;

  @ApiProperty({ description: 'task field updating date' })
  @UpdateDateColumn()
  updateAt: Date;

  @ManyToOne(() => Project, (project) => project.taskFields, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @OneToMany(() => TodoColumn, (todoColumn) => todoColumn.project)
  columns: TodoColumn[];

  @OneToMany(
    () => TaskFieldValueNumber,
    (taskFieldValueNumber) => taskFieldValueNumber.taskField,
  )
  taskFieldValueNumbers: TaskFieldValueNumber[];

  @OneToMany(
    () => TaskFieldValueString,
    (taskFieldValueString) => taskFieldValueString.taskField,
  )
  taskFieldValueStrings: TaskFieldValueString[];
}
