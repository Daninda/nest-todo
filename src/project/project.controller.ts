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
  async getAllByUserId(@UserId() userId: number) {
    const projects = await this.projectService.findAllByUserId(userId);
    return projects;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOneByIdAndUserId(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const project = await this.projectService.findOneByIdAndUserId(userId, id);
    return project;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createByUserId(
    @UserId() userId: number,
    @Body() projectDto: CreateProjectDto,
  ) {
    const project = await this.projectService.createByUserId(
      userId,
      projectDto,
    );
    return project;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateOneByIdAndUserId(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() projectDto: CreateProjectDto,
  ) {
    const project = await this.projectService.updateOneByIdAndUserId(
      userId,
      id,
      projectDto,
    );
    return project;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeOneByIdAndUserId(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const project = await this.projectService.removeOneByIdAndUserId(
      userId,
      id,
    );
    return project;
  }
}
