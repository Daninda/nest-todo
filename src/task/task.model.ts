import { ApiProperty } from '@nestjs/swagger';
import { TodoColumn } from 'src/column/column.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'task id' })
  id: number;

  @Column()
  @ApiProperty({ description: 'task name' })
  name: string;

  @Column()
  @ApiProperty({ description: 'task description' })
  description: string;

  @Column()
  @ApiProperty({ description: 'task position' })
  position: number;

  @CreateDateColumn()
  @ApiProperty({ description: 'task creating date' })
  createAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'task updating date' })
  updateAt: Date;

  @ApiProperty({ description: 'Task column' })
  @ManyToOne(() => TodoColumn, (todoColumn) => todoColumn.tasks, {
    onDelete: 'CASCADE',
  })
  column: TodoColumn;
}
