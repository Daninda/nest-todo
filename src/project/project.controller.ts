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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TodoColumn } from 'src/column/column.model';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-resonse.decorator';
import { UserId } from 'src/decorators/user-id.decorator';
import { Task } from 'src/task/task.model';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './project.model';
import { ProjectService } from './project.service';

@ApiTags('Projects')
@ApiHeader({
  name: 'Authorization',
  description: 'Access token',
})
@Controller('project')
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
  @Get(':id')
  async getOneById(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const project = await this.projectService.findOneById(userId, id);
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
  @Put(':id')
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

  @ApiOperation({ summary: 'Remove user project by id' })
  @ApiOkResponse({
    type: Number,
  })
  @Delete(':id')
  async removeById(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const deletedId = await this.projectService.removeById(userId, id);
    return deletedId;
  }
}
