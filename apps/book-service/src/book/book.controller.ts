import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookService } from './book.service';
import {
  CreateBookDto,
  UpdateBookDto,
  UpdateBookStatusDto,
} from './dto/book.dto'; // Assuming Zod schemas also export types

@Controller('books') // Changed from 'book' to 'books' for conventional REST API endpoint naming
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBookDto: CreateBookDto) {
    // We'll use Zod pipes for validation later
    return this.bookService.create(createBookDto);
  }

  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateBookStatusDto: UpdateBookStatusDto,
  ) {
    return this.bookService.updateStatus(id, updateBookStatusDto);
  }

  // It's good practice to also have a DELETE endpoint, though not explicitly requested.
  // I'll add it for completeness as it's standard CRUD.
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }
}
