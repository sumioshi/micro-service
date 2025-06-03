import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { BookService } from './book.service';
import { Book as BookSchemaClass, BookDocument } from './schemas/book.schema';
import { Book as BookDto, CreateBookDto, UpdateBookDto, UpdateBookStatusDto } from './dto/book.dto';
import { v4 as uuidv4 } from 'uuid';

// Mock Mongoose Document
const mockBookDoc = (bookDto: BookDto): Partial<BookDocument> => ({
  ...bookDto,
  // toObject: jest.fn().mockReturnValue(bookDto), // if service used toObject()
  // save: jest.fn().mockResolvedValue(bookDto), // if service used instance.save()
});

// Mock Model methods
const mockBookModel = {
  new: jest.fn().mockImplementation(dto => mockBookDoc(dto)), // For `new this.bookModel(data)`
  create: jest.fn().mockImplementation(async (dto) => mockBookDoc(dto)), // If service used Model.create()
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
  // Mongoose model methods like save are on the instance, not static.
  // If we test `new Model(dto).save()`, the `save` mock should be on the instance.
  // For `this.bookModel(data).save()`, we can mock the constructor and prototype.save.
  // However, the current service uses `new this.bookModel(bookData)` then `createdBook.save()`.
  // So, we mock the `save` method on the object returned by `new this.bookModel()`.
};

// Helper to mock the save method on instances
const mockSave = jest.fn();


describe('BookService', () => {
  let service: BookService;
  let model: Model<BookDocument>;

  beforeEach(async () => {
    // Reset mocks for each test
    mockSave.mockReset();
    Object.values(mockBookModel).forEach(mockFn => {
        if (typeof mockFn.mockClear === 'function') mockFn.mockClear();
    });
    // Mock the constructor of bookModel to return an object with a save method
    mockBookModel.new.mockImplementation(dto => ({ ...dto, save: mockSave }));


    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(BookSchemaClass.name),
          useValue: mockBookModel,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    model = module.get<Model<BookDocument>>(getModelToken(BookSchemaClass.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a book, assign ID and default status, and return a DTO', async () => {
      const createDto: CreateBookDto = { titulo: 'New Book', autor: 'Test Author' };
      const expectedId = uuidv4(); // We can't know the exact UUID, but can check structure
      const expectedStatus = 'disponível';

      // Mock the save method for this specific test instance
      const savedBookDoc = {
        ...createDto,
        id: expectedId,
        status: expectedStatus
      };
      mockSave.mockResolvedValue(savedBookDoc);

      const result = await service.create(createDto);

      // Check that `new this.bookModel()` was called with appropriate data structure
      expect(mockBookModel.new).toHaveBeenCalledWith(expect.objectContaining({
        id: expect.any(String), // UUID will be generated
        titulo: createDto.titulo,
        autor: createDto.autor,
        status: expectedStatus,
      }));
      // Check that `save()` was called on the instance
      expect(mockSave).toHaveBeenCalled();

      expect(result.id).toEqual(expectedId); // Or just expect.any(String) if not pre-mocking id
      expect(result.titulo).toEqual(createDto.titulo);
      expect(result.autor).toEqual(createDto.autor);
      expect(result.status).toEqual(expectedStatus);
    });
  });

  describe('findAll', () => {
    it('should return an array of book DTOs', async () => {
      const booksArray: BookDto[] = [
        { id: '1', titulo: 'Book 1', autor: 'Author 1', status: 'disponível' },
      ];
      const bookDocs = booksArray.map(book => mockBookDoc(book));
      mockBookModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(bookDocs) } as any);

      const result = await service.findAll();
      expect(mockBookModel.find).toHaveBeenCalled();
      expect(result).toEqual(booksArray);
    });
  });

  describe('findOne', () => {
    const bookId = 'test-id';
    const bookDto: BookDto = { id: bookId, titulo: 'Test Book', autor: 'Test Author', status: 'disponível' };

    it('should return a book DTO if found', async () => {
      const bookDoc = mockBookDoc(bookDto);
      mockBookModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(bookDoc) } as any);

      const result = await service.findOne(bookId);
      expect(mockBookModel.findOne).toHaveBeenCalledWith({ id: bookId });
      expect(result).toEqual(bookDto);
    });

    it('should throw NotFoundException if book not found', async () => {
      mockBookModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) } as any);
      await expect(service.findOne(bookId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const bookId = 'test-id';
    const updateDto: UpdateBookDto = { titulo: 'Updated Title' };
    const updatedBookDto: BookDto = { id: bookId, titulo: 'Updated Title', autor: 'Original Author', status: 'disponível' };

    it('should update and return the book DTO', async () => {
      const updatedDoc = mockBookDoc(updatedBookDto);
      mockBookModel.findOneAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(updatedDoc) } as any);

      const result = await service.update(bookId, updateDto);
      expect(mockBookModel.findOneAndUpdate).toHaveBeenCalledWith({ id: bookId }, updateDto, { new: true });
      expect(result).toEqual(updatedBookDto);
    });

    it('should throw NotFoundException if book to update not found', async () => {
      mockBookModel.findOneAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) } as any);
      await expect(service.update(bookId, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    const bookId = 'test-id';
    const statusDto: UpdateBookStatusDto = { status: 'reservado' };
    const updatedBookDto: BookDto = { id: bookId, titulo: 'Test Book', autor: 'Test Author', status: 'reservado' };

    it('should update status and return the book DTO', async () => {
      const updatedDoc = mockBookDoc(updatedBookDto);
      mockBookModel.findOneAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(updatedDoc) } as any);

      const result = await service.updateStatus(bookId, statusDto);
      expect(mockBookModel.findOneAndUpdate).toHaveBeenCalledWith({ id: bookId }, { status: statusDto.status }, { new: true });
      expect(result).toEqual(updatedBookDto);
    });

    it('should throw NotFoundException if book to update status not found', async () => {
      mockBookModel.findOneAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) } as any);
      await expect(service.updateStatus(bookId, statusDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    const bookId = 'test-id';
    const bookDto: BookDto = { id: bookId, titulo: 'Test Book', autor: 'Test Author', status: 'disponível' };

    it('should call findOneAndDelete and not throw error if book found', async () => {
      const deletedDoc = mockBookDoc(bookDto); // findOneAndDelete returns the deleted document
      mockBookModel.findOneAndDelete.mockReturnValue({ exec: jest.fn().mockResolvedValue(deletedDoc) } as any);

      await expect(service.remove(bookId)).resolves.not.toThrow();
      expect(mockBookModel.findOneAndDelete).toHaveBeenCalledWith({ id: bookId });
    });

    it('should throw NotFoundException if book to remove not found', async () => {
      mockBookModel.findOneAndDelete.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) } as any);
      await expect(service.remove(bookId)).rejects.toThrow(NotFoundException);
    });
  });
});
