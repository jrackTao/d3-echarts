import { Controller, Get, Param, Query, Delete, Res } from '@nestjs/common';
import { GeoJsonService } from 'src/services';
import { ResResultEntity, ErrorEntity, resError, resSuccess } from 'src/utils/ResResult'

@Controller('/geo-json')
export class GeoJsonController {

  constructor(private readonly geoJsonService: GeoJsonService) { }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<ResResultEntity> {
    try {
      const res = await this.geoJsonService.findGeoJson(id);
      return resSuccess(res)
    } catch (err) {
      return resError((err as ErrorEntity).message)
    }
  }
}
