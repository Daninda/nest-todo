import { ApiProperty } from '@nestjs/swagger';
import { TodoColumn } from 'src/column/column.model';
import { User } from 'src/user/user.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'project id' })
  id: number;

  @Column()
  @ApiProperty({ description: 'project name' })
  name: string;

  @Column()
  @ApiProperty({ description: 'project description' })
  description: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'user creating date' })
  createAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'user updating date' })
  updateAt: Date;

  @ApiProperty({ description: 'Project user' })
  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ description: 'Project columns' })
  @OneToMany(() => TodoColumn, (todoColumn) => todoColumn.project)
  columns: TodoColumn[];
}
