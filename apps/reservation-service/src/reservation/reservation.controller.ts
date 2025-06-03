import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/reservation.dto';

@Controller('reservations') // Using plural for REST conventions
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createReservationDto: CreateReservationDto) {
    // Zod validation pipe will be added later
    return this.reservationService.create(createReservationDto);
  }

  @Get('/user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.reservationService.findByUser(userId);
  }

  // Get a specific reservation by its ID (useful for fetching details or for cancellation)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    // Or could be a PATCH to update status to 'cancelada'
    return this.reservationService.remove(id);
  }
}
