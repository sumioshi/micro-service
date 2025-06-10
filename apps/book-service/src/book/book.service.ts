import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { BookDto, CreateBookDto, UpdateBookDto, UpdateBookStatusDto } from './dto/book.dto';
import { Book as BookSchemaClass, BookDocument } from './schemas/book.schema'; // Renamed to avoid confusion

@Injectable()
export class BookService {
  constructor(
    @InjectModel(BookSchemaClass.name) private bookModel: Model<BookDocument>,
  ) {}
  private toDto(bookDoc: BookDocument | null): BookDto | null {
    if (!bookDoc) {
      return null;
    }
    // Mongoose documents have a .toObject() method, or we can manually map
    // Ensure all fields required by BookDto are present
    // Our BookSchemaClass directly matches BookDto structure for id, titulo, autor, status
    // Timestamps (createdAt, updatedAt) are extra but not in BookDto.
    // Mongoose's _id and __v are also not in BookDto.
    const { id, titulo, autor, status } = bookDoc;
    return { id, titulo, autor, status: status as 'disponível' | 'reservado' | 'emprestado' | 'perdido' };
  }

  async create(createBookDto: CreateBookDto): Promise<BookDto> {
    const newBookId = uuidv4();
    const bookData: BookDto = {
      id: newBookId,
      ...createBookDto,
      status: 'disponível', // Default status
    };
    const createdBook = new this.bookModel(bookData);
    const savedDoc = await createdBook.save();
    console.log(`Book created: ${savedDoc.titulo}, ID: ${savedDoc.id}`);
    return this.toDto(savedDoc)!; // Should not be null after successful save
  }
  async findAll(): Promise<BookDto[]> {
    console.log('Finding all books from DB.');
    const books = await this.bookModel.find().exec();
    return books.map((doc: BookDocument) => this.toDto(doc)!);
  }

  async findOne(id: string): Promise<BookDto | null> {
    console.log(`Finding book with custom ID: ${id} from DB.`);
    const bookDoc = await this.bookModel.findOne({ id: id }).exec(); // Query by our custom 'id' field
    if (!bookDoc) {
      throw new NotFoundException(`Livro com ID "${id}" não encontrado.`);
    }
    return this.toDto(bookDoc);
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<BookDto | null> {
    console.log(`Updating book with custom ID: ${id} in DB.`);
    const updatedBookDoc = await this.bookModel
      .findOneAndUpdate({ id: id }, updateBookDto, { new: true })
      .exec();
    if (!updatedBookDoc) {
      throw new NotFoundException(`Livro com ID "${id}" não encontrado para atualização.`);
    }
    console.log(`Book updated: ${updatedBookDoc.titulo}, ID: ${id}`);
    return this.toDto(updatedBookDoc);
  }

  async updateStatus(id: string, updateBookStatusDto: UpdateBookStatusDto): Promise<BookDto | null> {
    console.log(`Updating status for book with custom ID: ${id} in DB.`);
    const updatedBookDoc = await this.bookModel
      .findOneAndUpdate({ id: id }, { status: updateBookStatusDto.status }, { new: true })
      .exec();
    if (!updatedBookDoc) {
      throw new NotFoundException(`Livro com ID "${id}" não encontrado para atualização de status.`);
    }
    console.log(
      `Book status updated: ${updatedBookDoc.titulo}, ID: ${id}, New Status: ${updateBookStatusDto.status}`,
    );
    return this.toDto(updatedBookDoc);
  }

  async remove(id: string): Promise<void> {
    console.log(`Removing book with custom ID: ${id} from DB.`);
    const result = await this.bookModel.findOneAndDelete({ id: id }).exec();
    if (!result) {
      throw new NotFoundException(`Livro com ID "${id}" não encontrado para remoção.`);
    }
    console.log(`Book removed: ${result.titulo}, ID: ${id}`);
  }
}
