import { Controller, Get, Param, Query, Delete, Res } from '@nestjs/common';
import { StatisticService } from 'src/services';
import { ResResultEntity, ErrorEntity, resError, resSuccess } from 'src/utils/ResResult'

@Controller('statistic')
export class StatisticController {

  constructor(private readonly statisticService: StatisticService) { }

  @Get('/:type')
  async findOne(@Param('type') type: string): Promise<ResResultEntity> {
    try {
      const res = await this.statisticService.findStatistic(type);
      return resSuccess(res)
    } catch (err) {
      return resError((err as ErrorEntity).message)
    }
  }
}