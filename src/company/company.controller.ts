import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { AuthGuard } from '@nestjs/passport';
import { CustomRequest } from 'src/request-interface';
import { Company } from './company.schema';
import { Role } from 'src/utils/roles.enum';
import { Roles } from 'src/utils/roles.decorator';
import { RolesGuard } from 'src/utils/roles.guard';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Roles(Role.User, Role.Admin, Role.Company)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Get('/:id?')
  companies(
    @Param('id') id: string,
    @Req() req: CustomRequest,
  ): Promise<Company[]> {
    const user_uuid = req.user.uuid;
    return this.companyService.companies(user_uuid, id);
  }

  @Post()
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @Req() req: CustomRequest,
  ): Promise<Company> {
    createCompanyDto.user_uuid = req.user.uuid;
    return this.companyService.create(createCompanyDto);
  }

  @Get('/add/users/:company_uuid')
  usersToAdd(
    @Param('company_uuid') company_uuid: string,
    @Req() req: CustomRequest,
  ) {
    const user_uuid = req.user.uuid;
    return this.companyService.usersToAdd(user_uuid, company_uuid);
  }

  @Put('/:uuid')
  update(
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Req() req: CustomRequest,
    @Param('uuid') uuid: string,
  ) {
    updateCompanyDto.user_uuid = req.user.uuid;
    updateCompanyDto.uuid = uuid;
    return this.companyService.update(updateCompanyDto);
  }
}
