import { Controller, Get, Param, Query, Delete, Res } from '@nestjs/common';
import { DivisionService } from 'src/services';
import { ResResultEntity, ErrorEntity, resError, resSuccess } from 'src/utils/ResResult'

@Controller('/division')
export class DivisionController {

  constructor(private readonly divisionService: DivisionService) { }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<ResResultEntity> {
    try {
      const res = await this.divisionService.findDivision(id);
      return resSuccess(res)
    } catch (err) {
      return resError((err as ErrorEntity).message)
    }
  }
}
