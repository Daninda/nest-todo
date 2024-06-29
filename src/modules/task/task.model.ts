import { ApiProperty } from '@nestjs/swagger';
import { TodoColumn } from 'src/modules/column/column.model';
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

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Task id' })
  id: number;

  @Column()
  @ApiProperty({ description: 'Task name', example: 'Task name' })
  name: string;

  @Column()
  @ApiProperty({ description: 'Task description', example: 'Task description' })
  description: string;

  @Column()
  @ApiProperty({ description: 'Task position' })
  position: number;

  @CreateDateColumn()
  @ApiProperty({ description: 'Task creating date' })
  createAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Task updating date' })
  updateAt: Date;

  @ManyToOne(() => TodoColumn, (todoColumn) => todoColumn.tasks, {
    onDelete: 'CASCADE',
  })
  column: TodoColumn;

  @OneToMany(
    () => TaskFieldValueNumber,
    (taskFieldValueNumber) => taskFieldValueNumber.task,
  )
  taskFieldValueNumbers: TaskFieldValueNumber[];

  @OneToMany(
    () => TaskFieldValueString,
    (taskFieldValueString) => taskFieldValueString.task,
  )
  taskFieldValueStrings: TaskFieldValueString[];
}
