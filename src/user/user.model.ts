import { ApiProperty } from '@nestjs/swagger';
import { Project } from 'src/project/project.model';
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
  @ApiProperty({ description: 'user name' })
  name: string;

  @Column({
    unique: true,
  })
  @ApiProperty({ description: 'user email' })
  email: string;

  @Column()
  @ApiProperty({ description: 'user password' })
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
