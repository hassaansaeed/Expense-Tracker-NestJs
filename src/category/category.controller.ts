import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { Category } from './category.schema';
import { CustomRequest } from 'src/request-interface';

@UseGuards(AuthGuard('jwt'))
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  // @Get('/')
  // categories(): Promise<Category[]> {
  //   return this.categoryService.categories();
  // }

  @Get('/:id?')
  category(
    @Param('id') id: string,
    @Req() req: CustomRequest,
  ): Promise<Category[]> {
    const user_id = req.user.uuid;
    return this.categoryService.category(user_id, id);
  }

  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: CustomRequest,
  ) {
    createCategoryDto.user_id = req.user.uuid;
    return this.categoryService.create(createCategoryDto);
  }

  @Put('/:id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req: CustomRequest,
  ) {
    updateCategoryDto.user_id = req.user.uuid;
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete('/:id')
  delete(@Param('id') id: string, @Req() req: CustomRequest) {
    const user_id = req.user.uuid;
    return this.categoryService.delete(id, user_id);
  }
}
