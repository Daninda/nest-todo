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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { ColumnService } from './column.service';
import { ChangePositionDto } from './dto/change-position.dto';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Controller('column')
export class ColumnController {
  constructor(private columnService: ColumnService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOneById(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const column = await this.columnService.findOneById(userId, id);
    return column;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@UserId() userId: number, @Body() columnDto: CreateColumnDto) {
    const column = await this.columnService.create(userId, columnDto);
    return column;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateById(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() columnDto: UpdateColumnDto,
  ) {
    const column = await this.columnService.updateById(userId, id, columnDto);
    return column;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeById(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const deletedId = await this.columnService.removeById(userId, id);
    return deletedId;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async changePositionById(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() changePositionDto: ChangePositionDto,
  ) {
    const project = await this.columnService.changePositionById(
      userId,
      id,
      changePositionDto.newPosition,
    );
    return project;
  }
}
