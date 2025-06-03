import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true }) // Enables createdAt and updatedAt
export class Book {
  @Prop({ type: String, unique: true, required: true }) // Our application-level UUID
  id: string;

  @Prop({ type: String, required: true })
  titulo: string;

  @Prop({ type: String, required: true })
  autor: string;

  @Prop({ type: String, required: true, enum: ['disponível', 'reservado', 'emprestado', 'perdido'] })
  status: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);

// Optional: You can add indexes for fields you query often, e.g., status
// BookSchema.index({ status: 1 });
// BookSchema.index({ autor: 1 });

// Ensure our custom 'id' field is used instead of Mongoose's default '_id' for queries if needed,
// or handle the mapping in the service. For this subtask, service will query by `id`.
// Mongoose by default creates an _id. We are adding a separate `id` field for our UUID.
// If we wanted `id` to be the primary `_id`, we'd configure the schema differently:
// @Prop({ type: String, unique: true, required: true, alias: '_id' })
// id: string;
// And then in DTOs ensure _id is mapped to id.
// For now, having both `_id` (Mongoose default) and `id` (our UUID) is acceptable.
// The service layer will use the string `id` field for operations.
