import { z } from 'zod';

// Basic ISO Date regex (YYYY-MM-DD) - can be made more strict if needed
const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

// Base Reservation Schema
export const ReservationSchema = z.object({
  id: z.string().uuid({ message: 'ID da reserva inválido' }),
  userId: z.string().min(1, { message: 'ID do usuário não pode ser vazio' }),
  bookId: z.string().uuid({ message: 'ID do livro inválido' }),
  dataReserva: z.string().regex(isoDateRegex, {
    message: 'Data da reserva deve estar no formato YYYY-MM-DD',
  }),
  status: z.enum(['ativa', 'cancelada', 'concluída', 'expirada'], {
    errorMap: () => ({ message: 'Status da reserva inválido' }),
  }),
});

export type Reservation = z.infer<typeof ReservationSchema>;

// DTO for creating a new reservation
export const CreateReservationDtoSchema = ReservationSchema.pick({
  userId: true,
  bookId: true,
  dataReserva: true,
});

export type CreateReservationDto = z.infer<typeof CreateReservationDtoSchema>;

// DTO for updating reservation status (example, not explicitly asked but good to have)
export const UpdateReservationStatusDtoSchema = ReservationSchema.pick({
  status: true,
});

export type UpdateReservationStatusDto = z.infer<
  typeof UpdateReservationStatusDtoSchema
>;
