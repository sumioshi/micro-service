import { z } from 'zod';

// Base Book Schema
export const BookValidationSchema = z.object({
  id: z.string().uuid(),
  titulo: z.string().min(1, { message: 'Título não pode ser vazio' }),
  autor: z.string().min(1, { message: 'Autor não pode ser vazio' }),
  status: z.enum(['disponível', 'reservado', 'emprestado', 'perdido'], {
    errorMap: () => ({ message: 'Status inválido' }),
  }),
});

export type BookDto = z.infer<typeof BookValidationSchema>;

// DTO for creating a new book
export const CreateBookDtoSchema = BookValidationSchema.pick({
  titulo: true,
  autor: true,
});

export type CreateBookDto = z.infer<typeof CreateBookDtoSchema>;

// DTO for updating book information (all fields optional)
export const UpdateBookDtoSchema = BookValidationSchema.pick({
  titulo: true,
  autor: true,
  status: true,
}).partial();

export type UpdateBookDto = z.infer<typeof UpdateBookDtoSchema>;

// DTO for specifically updating book status
export const UpdateBookStatusDtoSchema = BookValidationSchema.pick({
  status: true,
});

export type UpdateBookStatusDto = z.infer<typeof UpdateBookStatusDtoSchema>;
