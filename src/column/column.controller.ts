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
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-resonse.decorator';
import { UserId } from 'src/decorators/user-id.decorator';
import { Task } from 'src/task/task.model';
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
@Controller('column')
@UseGuards(JwtAuthGuard)
export class ColumnController {
  constructor(private columnService: ColumnService) {}

  @ApiOperation({ summary: 'Get project column by id' })
  @ApiPaginatedResponse(TodoColumn, Task, 'tasks')
  @Get(':id')
  async getOneById(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const column = await this.columnService.findOneById(userId, id);
    return column;
  }

  @ApiOperation({ summary: 'Create project column' })
  @ApiCreatedResponse({
    type: TodoColumn,
  })
  @Post()
  async create(@UserId() userId: number, @Body() columnDto: CreateColumnDto) {
    const column = await this.columnService.create(userId, columnDto);
    return column;
  }

  @ApiOperation({ summary: 'Update project column by id' })
  @ApiCreatedResponse({
    type: TodoColumn,
  })
  @Put(':id')
  async updateById(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() columnDto: UpdateColumnDto,
  ) {
    const column = await this.columnService.updateById(userId, id, columnDto);
    return column;
  }

  @ApiOperation({ summary: 'Remove project column by id' })
  @ApiOkResponse({
    type: Number,
  })
  @Delete(':id')
  async removeById(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const deletedId = await this.columnService.removeById(userId, id);
    return deletedId;
  }

  @ApiOperation({ summary: 'Change project column position by id' })
  @ApiPaginatedResponse(TodoColumn, Task, 'tasks')
  @Patch(':id')
  async changePositionById(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() changePositionDto: ChangeColumnPositionDto,
  ) {
    const column = await this.columnService.changePositionById(
      userId,
      id,
      changePositionDto.newPosition,
    );
    return column;
  }
}
