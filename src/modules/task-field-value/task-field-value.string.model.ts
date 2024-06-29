import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskField } from '../task-field/task-field.model';
import { Task } from '../task/task.model';

@Entity()
export class TaskFieldValueString {
  @ApiProperty({
    description: 'task field number value',
    example: 'value',
  })
  @Column()
  value: string;

  @ApiProperty({ description: 'task field creating date' })
  @CreateDateColumn()
  createAt: Date;

  @ApiProperty({ description: 'task field updating date' })
  @UpdateDateColumn()
  updateAt: Date;

  @PrimaryColumn()
  taskId: number;

  @ManyToOne(() => Task, (task) => task.taskFieldValueStrings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @PrimaryColumn()
  taskFieldId: number;

  @ManyToOne(() => TaskField, (taskField) => taskField.taskFieldValueStrings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'taskFieldId' })
  taskField: TaskField;
}
