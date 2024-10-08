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
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { CustomRequest } from 'src/request-interface';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { BudgetInterceptor } from 'src/interceptors/budget.interceptor';

@UseGuards(AuthGuard('jwt'))
@Controller('budget')
export class BudgetController {
  constructor(private budgetService: BudgetService) {}

  @Post()
  create(@Body() createBudgetDto: CreateBudgetDto, @Req() req: CustomRequest) {
    createBudgetDto.user_id = req.user.uuid;
    return this.budgetService.create(createBudgetDto);
  }

  @Get('/:id?')
  @UseInterceptors(BudgetInterceptor)
  budgets(@Param('id') id: string, @Req() req: CustomRequest) {
    const user_id = req.user.uuid;
    return this.budgetService.budgets(user_id, id);
  }

  @Put('/:id')
  update(
    @Body() updateBudgetDto: UpdateBudgetDto,
    @Param('id') id: string,
    @Req() req: CustomRequest,
  ) {
    updateBudgetDto.id = id;
    updateBudgetDto.user_id = req.user.uuid;
    return this.budgetService.update(updateBudgetDto);
  }

  @Delete('/:id')
  delete(@Param('id') id: string, @Req() req: CustomRequest) {
    const user_id = req.user.uuid;
    return this.budgetService.delete(user_id, id);
  }
}
