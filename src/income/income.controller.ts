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
import { AuthGuard } from '@nestjs/passport';
import { CreateIncomeDto } from './dto/create-income.dto';
import { CustomRequest } from 'src/request-interface';
import { IncomeService } from './income.service';
import { Income } from './income.schema';
import { UpdateIncomeDto } from './dto/update-income.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('income')
export class IncomeController {
  constructor(private incomeService: IncomeService) {}

  @Get('/:id?')
  incomes(
    @Req() req: CustomRequest,
    @Param('id') id?: string,
  ): Promise<Income[]> {
    const user_id = req.user.uuid;
    return this.incomeService.incomes(user_id, id);
  }

  @Post()
  create(@Body() createIncomeDto: CreateIncomeDto, @Req() req: CustomRequest) {
    createIncomeDto.user_id = req.user.uuid;
    return this.incomeService.create(createIncomeDto);
  }

  @Put('/:id')
  update(
    @Body() updateIncomeDto: UpdateIncomeDto,
    @Param('id') id: string,
    @Req() req: CustomRequest,
  ) {
    updateIncomeDto.user_id = req.user.uuid;
    return this.incomeService.update(updateIncomeDto, id);
  }

  @Delete('/:id')
  delete(@Param('id') id: string, @Req() req: CustomRequest) {
    const user_id = req.user.uuid;
    return this.incomeService.delete(user_id, id);
  }
}
