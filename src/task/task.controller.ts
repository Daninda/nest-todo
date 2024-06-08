import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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
import { UserId } from 'src/decorators/user-id.decorator';
import { ChangeTaskPositionDto } from './dto/change-task-position.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.model';
import { TaskService } from './task.service';

@ApiTags('Tasks')
@ApiHeader({
  name: 'Authorization',
  description: 'Access token',
})
@Controller('task')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @ApiOperation({ summary: 'Get column task by id' })
  @ApiOkResponse({
    type: Task,
  })
  @Get(':id')
  async getOneById(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const task = await this.taskService.findOneById(userId, id);
    return task;
  }

  @ApiOperation({ summary: 'Create column task' })
  @ApiCreatedResponse({
    type: Task,
  })
  @Post()
  async create(@UserId() userId: number, @Body() taskDto: CreateTaskDto) {
    const task = await this.taskService.create(userId, taskDto);
    return task;
  }

  @ApiOperation({ summary: 'Update column task by id' })
  @ApiOkResponse({
    type: Task,
  })
  @Put(':id')
  async updateById(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() taskDto: UpdateTaskDto,
  ) {
    const task = await this.taskService.updateById(userId, id, taskDto);
    return task;
  }

  @ApiOperation({ summary: 'Remove column task by id' })
  @ApiOkResponse({
    type: Number,
  })
  @Delete(':id')
  async removeById(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const deletedId = await this.taskService.removeById(userId, id);
    return deletedId;
  }

  @ApiOperation({ summary: 'Change task position by id' })
  @ApiOkResponse({
    type: Task,
  })
  @Patch(':id')
  async changePositionById(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() changePositionDto: ChangeTaskPositionDto,
  ) {
    const task = await this.taskService.changePositionById(
      userId,
      id,
      changePositionDto.newPosition,
      changePositionDto?.newColumnId,
    );
    return task;
  }
}
