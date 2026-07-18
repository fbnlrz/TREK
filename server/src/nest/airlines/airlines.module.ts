import { Module } from '@nestjs/common';
import { AirlinesController } from './airlines.controller';
import { AirlinesService } from './airlines.service';

/** Airlines lookup (leaf module, sibling of AirportsModule). Registered in AppModule. */
@Module({
  controllers: [AirlinesController],
  providers: [AirlinesService],
})
export class AirlinesModule {}
