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
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-resonse.decorator';
import { UserId } from 'src/decorators/user-id.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { TodoColumn } from 'src/modules/column/column.model';
import { Task } from '../task/task.model';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './project.model';
import { ProjectService } from './project.service';

@ApiTags('Projects')
@ApiHeader({
  name: 'Authorization',
  description: 'Access token',
})
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @ApiOperation({ summary: 'Get all user projects' })
  @ApiOkResponse({
    type: [Project],
    schema: {
      properties: {
        columns: undefined,
      },
    },
  })
  @Get()
  async getAll(@UserId() userId: number) {
    const projects = await this.projectService.findAll(userId);
    return projects;
  }

  @ApiOperation({ summary: 'Get user project by id' })
  @ApiPaginatedResponse(Project, TodoColumn, 'columns', Task, 'tasks')
  @Get(':projectId')
  async getOneById(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    const project = await this.projectService.findOneById(userId, projectId);
    return project;
  }

  @ApiOperation({ summary: 'Create user project' })
  @ApiCreatedResponse({
    type: Project,
  })
  @Post()
  async create(@UserId() userId: number, @Body() projectDto: CreateProjectDto) {
    const project = await this.projectService.create(userId, projectDto);
    return project;
  }

  @ApiOperation({ summary: 'Update user project by id' })
  @ApiPaginatedResponse(Project, TodoColumn, 'columns', Task, 'tasks')
  @Put(':projectId')
  async updateById(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() projectDto: CreateProjectDto,
  ) {
    const project = await this.projectService.updateById(
      userId,
      projectId,
      projectDto,
    );
    return project;
  }

  @ApiOperation({ summary: 'Remove user project by id' })
  @ApiOkResponse({
    type: Number,
  })
  @Delete(':projectId')
  async removeById(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    const deletedId = await this.projectService.removeById(userId, projectId);
    return deletedId;
  }
}
