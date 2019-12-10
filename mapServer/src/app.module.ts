import { Module } from '@nestjs/common';
import { GeoJsonController, DivisionController } from './controller';
import { GeoJsonService, DivisionService } from './services/index';
@Module({
  imports: [],
  controllers: [DivisionController, GeoJsonController],
  providers: [DivisionService, GeoJsonService],
})
export class AppModule { }
