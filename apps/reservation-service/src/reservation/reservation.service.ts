import { Injectable, NotFoundException, ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

import { CreateReservationDto, Reservation as ReservationDto } from './dto/reservation.dto';
import { Reservation as ReservationSchemaClass, ReservationDocument } from './schemas/reservation.schema';

// Define a simple interface for the expected book structure from BookService
interface BookFromServiceDto {
  id: string;
  titulo: string;
  autor: string;
  status: string;
}


@Injectable()
export class ReservationService {
  private readonly logger = new Logger(ReservationService.name);
  private readonly bookServiceUrl = process.env.BOOK_SERVICE_URL || 'http://localhost:3001/books';

  constructor(
    @InjectModel(ReservationSchemaClass.name) private reservationModel: Model<ReservationDocument>,
    private readonly httpService: HttpService,
  ) {}

  private toDto(reservationDoc: ReservationDocument | null): ReservationDto | null {
    if (!reservationDoc) return null;
    const { id, userId, bookId, dataReserva, status } = reservationDoc;
    return { id, userId, bookId, dataReserva, status };
  }

  async create(createReservationDto: CreateReservationDto): Promise<ReservationDto> {
    const { bookId, userId, dataReserva } = createReservationDto;

    // 1. Check book availability and status from BookService
    let book: BookFromServiceDto;
    try {
      this.logger.log(`Fetching book details from BookService for bookId: ${bookId}`);
      const response = await firstValueFrom(
        this.httpService.get<BookFromServiceDto>(`${this.bookServiceUrl}/${bookId}`),
      );
      book = response.data;
      if (!book || !book.id) { // Basic check on response data
        throw new NotFoundException(`Livro com ID "${bookId}" não encontrado no serviço de livros.`);
      }
      this.logger.log(`Book status for ${bookId}: ${book.status}`);
    } catch (error) {
      this.logger.error(`Error fetching book ${bookId} from BookService: ${error.message}`, error.stack);
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new NotFoundException(`Livro com ID "${bookId}" não encontrado no serviço de livros.`);
      }
      throw new InternalServerErrorException(`Erro ao comunicar com o serviço de livros: ${error.message}`);
    }

    if (book.status !== 'disponível') {
      throw new ConflictException(
        `Livro com ID "${bookId}" não está disponível para reserva (status: ${book.status}).`,
      );
    }

    // 2. Create and save the reservation
    const newReservationId = uuidv4();
    const reservationData: ReservationDto = {
      id: newReservationId, userId, bookId, dataReserva, status: 'ativa',
    };

    const createdReservation = new this.reservationModel(reservationData);
    const savedDoc = await createdReservation.save();
    this.logger.log(`Reservation created in DB: ${savedDoc.id} for book ${bookId}`);

    // 3. Update book status in BookService
    try {
      this.logger.log(`Updating book status to 'reservado' for bookId: ${bookId}`);
      await firstValueFrom(
        this.httpService.patch(`${this.bookServiceUrl}/${bookId}/status`, { status: 'reservado' }),
      );
      this.logger.log(`Book status updated successfully for ${bookId}`);
    } catch (error) {
      this.logger.error(
        `CRITICAL: Reservation ${savedDoc.id} created, but failed to update book ${bookId} status to 'reservado'. Manual intervention needed. Error: ${error.message}`,
        error.stack
      );
      // This is a compensation scenario. For now, we just log the critical error.
      // Depending on policy, we might try to delete the reservation or flag it.
      // For this exercise, we'll proceed and return the reservation, but the system is in an inconsistent state.
    }

    return this.toDto(savedDoc)!;
  }

  async findAllByUserId(userId: string): Promise<ReservationDto[]> {
    console.log(`[ReservationService] Finding reservations for userId: ${userId} from DB.`);
    // Example: find only 'ativa' reservations
    // const reservations = await this.reservationModel.find({ userId, status: 'ativa' }).exec();
    const reservations = await this.reservationModel.find({ userId }).exec();
    if (!reservations.length) {
        console.log(`[ReservationService] No reservations found for userId: ${userId} in DB.`);
    }
    return reservations.map(doc => this.toDto(doc)!);
  }

  async findOne(id: string): Promise<ReservationDto | null> {
    console.log(`[ReservationService] Finding reservation with custom ID: ${id} from DB.`);
    const reservationDoc = await this.reservationModel.findOne({ id: id }).exec();
    if (!reservationDoc) {
      throw new NotFoundException(`Reserva com ID "${id}" não encontrada.`);
    }
    return this.toDto(reservationDoc);
  }

  async remove(id: string): Promise<void> {
    console.log(`[ReservationService] Removing reservation with custom ID: ${id} from DB.`);
    const reservationToCancel = await this.reservationModel.findOneAndDelete({ id: id }).exec();

    if (!reservationToCancel) {
      throw new NotFoundException(`Reserva com ID "${id}" não encontrada para remoção.`);
    }
    console.log(`[ReservationService] Reservation removed from DB: ${id}`);

    if (reservationToCancel.status === 'ativa') {
        await this.updateBookStatus(reservationToCancel.bookId, 'disponível'); // Mock call
    }
  }
}
