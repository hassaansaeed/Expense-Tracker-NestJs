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
import { CreateIncomeDto } from './dto/create-income.dto';
import { CustomRequest } from 'src/request-interface';
import { IncomeService } from './income.service';
import { Income } from './income.schema';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { IncomeInterceptor } from 'src/interceptors/income.interceptor';
import { Currency } from './currence-enum';

@UseGuards(AuthGuard('jwt'))
@Controller('income')
export class IncomeController {
  constructor(private incomeService: IncomeService) {}

  @Get('/:id?')
  @UseInterceptors(IncomeInterceptor)
  incomes(
    @Req() req: CustomRequest,
    @Param('id') id?: string,
  ): Promise<Income | Income[]> {
    const userUuid = req.user.uuid;
    return this.incomeService.incomes(userUuid, id);
  }

  @Post()
  create(@Body() createIncomeDto: CreateIncomeDto, @Req() req: CustomRequest) {
    createIncomeDto.userUuid = req.user.uuid;
    return this.incomeService.create(createIncomeDto);
  }

  @Put('/:id')
  update(
    @Body() updateIncomeDto: UpdateIncomeDto,
    @Param('id') id: string,
    @Req() req: CustomRequest,
  ) {
    updateIncomeDto.userUuid = req.user.uuid;
    return this.incomeService.update(updateIncomeDto, id);
  }

  @Delete('/:id')
  delete(@Param('id') id: string, @Req() req: CustomRequest) {
    const userUuid = req.user.uuid;
    return this.incomeService.delete(userUuid, id);
  }

  @Get('/currencies')
  getCurrencies() {
    return Object.values(Currency);
  }
}
