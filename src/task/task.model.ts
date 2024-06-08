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
}
