import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@UserId() userId: number) {
    const projects = await this.projectService.findAll(userId);
    return projects;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOneById(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const project = await this.projectService.findOneById(userId, id);
    return project;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@UserId() userId: number, @Body() projectDto: CreateProjectDto) {
    const project = await this.projectService.create(userId, projectDto);
    return project;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateById(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() projectDto: CreateProjectDto,
  ) {
    const project = await this.projectService.updateById(
      userId,
      id,
      projectDto,
    );
    return project;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeById(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const project = await this.projectService.removeById(userId, id);
    return project;
  }
}
