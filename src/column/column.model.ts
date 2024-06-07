import { ApiProperty } from '@nestjs/swagger';
import { Project } from 'src/project/project.model';
import { Task } from 'src/task/task.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class TodoColumn {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Column id' })
  id: number;

  @Column()
  @ApiProperty({ description: 'Column name' })
  name: string;

  @Column()
  @ApiProperty({ description: 'Column position' })
  position: number;

  @CreateDateColumn()
  @ApiProperty({ description: 'Column creating date' })
  createAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Column updating date' })
  updateAt: Date;

  @ApiProperty({ description: 'Column project' })
  @ManyToOne(() => Project, (project) => project.columns, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @ApiProperty({ description: 'Column project' })
  @ManyToOne(() => Task, (task) => task.column)
  tasks: Task[];
}
