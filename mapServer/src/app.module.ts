import { Module } from '@nestjs/common';
import { GeoJsonController, StatisticController, DivisionController } from './controller';
import { GeoJsonService, StatisticService, DivisionService } from './services/index';
@Module({
  imports: [],
  controllers: [DivisionController, GeoJsonController, StatisticController],
  providers: [DivisionService, GeoJsonService, StatisticService],
})
export class AppModule { }
