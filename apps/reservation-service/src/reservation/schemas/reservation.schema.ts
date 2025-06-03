import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema({ timestamps: true }) // Enables createdAt and updatedAt
export class Reservation {
  @Prop({ type: String, unique: true, required: true }) // Our application-level UUID for the reservation
  id: string;

  @Prop({ type: String, required: true, index: true }) // Indexed for quick lookup by userId
  userId: string;

  @Prop({ type: String, required: true, index: true }) // Indexed for bookId
  bookId: string; // This would be the UUID of the book from BookService

  @Prop({ type: String, required: true }) // Storing as ISO String "YYYY-MM-DD"
  dataReserva: string;

  @Prop({ type: String, required: true, enum: ['ativa', 'cancelada', 'concluída', 'expirada'] })
  status: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

// Optional: Composite index if you often query by userId and status, for example
// ReservationSchema.index({ userId: 1, status: 1 });
