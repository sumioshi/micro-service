import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import {
  Reservation,
  ReservationSchema,
} from './schemas/reservation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    HttpModule.register({
      baseURL: 'http://localhost:3001', // Default for book-service
      timeout: 5000, // 5 seconds
    }),
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
