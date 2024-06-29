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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-resonse.decorator';
import { UserId } from 'src/decorators/user-id.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Task } from '../task/task.model';
import { TodoColumn } from './column.model';
import { ColumnService } from './column.service';
import { ChangeColumnPositionDto } from './dto/change-column-position.dto';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@ApiTags('Columns')
@ApiHeader({
  name: 'Authorization',
  description: 'Access token',
})
@Controller('projects/:projectId/columns')
@UseGuards(JwtAuthGuard)
export class ColumnController {
  constructor(private columnService: ColumnService) {}

  @ApiOperation({ summary: 'Get all project columns' })
  @ApiResponse({ type: [TodoColumn] })
  @Get()
  async getAll(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    const columns = await this.columnService.findAll(userId, projectId);
    return columns;
  }

  @ApiOperation({ summary: 'Get project column by id' })
  @ApiPaginatedResponse(TodoColumn, Task, 'tasks')
  @Get(':columnId')
  async getOneById(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
  ) {
    const column = await this.columnService.findOneById(
      userId,
      projectId,
      columnId,
    );
    return column;
  }

  @ApiOperation({ summary: 'Create project column' })
  @ApiCreatedResponse({
    type: TodoColumn,
  })
  @Post()
  async create(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() columnDto: CreateColumnDto,
  ) {
    const column = await this.columnService.create(
      userId,
      projectId,
      columnDto,
    );
    return column;
  }

  @ApiOperation({ summary: 'Update project column by id' })
  @ApiCreatedResponse({
    type: TodoColumn,
  })
  @Put(':columnId')
  async updateById(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body() columnDto: UpdateColumnDto,
  ) {
    const column = await this.columnService.updateById(
      userId,
      projectId,
      columnId,
      columnDto,
    );
    return column;
  }

  @ApiOperation({ summary: 'Remove project column by id' })
  @ApiOkResponse({
    type: Number,
  })
  @Delete(':columnId')
  async removeById(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
  ) {
    const deletedId = await this.columnService.removeById(
      userId,
      projectId,
      columnId,
    );
    return deletedId;
  }

  @ApiOperation({ summary: 'Change project column position by id' })
  @ApiPaginatedResponse(TodoColumn, Task, 'tasks')
  @Patch(':columnId')
  async changePositionById(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body() changePositionDto: ChangeColumnPositionDto,
  ) {
    const column = await this.columnService.changePositionById(
      userId,
      projectId,
      columnId,
      changePositionDto.newPosition,
    );
    return column;
  }
}
