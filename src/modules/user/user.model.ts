import { ApiProperty } from '@nestjs/swagger';
import { Project } from 'src/modules/project/project.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'user id' })
  id: number;

  @Column()
  @ApiProperty({ description: 'user name', example: 'username' })
  name: string;

  @Column({
    unique: true,
  })
  @ApiProperty({ description: 'user email', example: 'email@email.com' })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'user creating date' })
  createAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'user updating date' })
  updateAt: Date;

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];
}
