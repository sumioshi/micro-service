import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { CreateBookDto, UpdateBookDto, UpdateBookStatusDto, Book as BookDto } from './dto/book.dto';
import { NotFoundException } from '@nestjs/common';

// Mock BookService
const mockBookService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  updateStatus: jest.fn(),
  remove: jest.fn(),
};

describe('BookController', () => {
  let controller: BookController;
  let service: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: mockBookService,
        },
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
    service = module.get<BookService>(BookService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const createDto: CreateBookDto = { titulo: 'New Book', autor: 'Author' };
      const expectedResult: BookDto = { id: '1', status: 'disponível', ...createDto };
      mockBookService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return the result', async () => {
      const expectedResult: BookDto[] = [{ id: '1', titulo: 'Book 1', autor: 'Author 1', status: 'disponível' }];
      mockBookService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    const bookId = 'test-id';
    const expectedResult: BookDto = { id: bookId, titulo: 'Test', autor: 'Test', status: 'disponível' };

    it('should call service.findOne and return the result if found', async () => {
      mockBookService.findOne.mockResolvedValue(expectedResult);
      const result = await controller.findOne(bookId);
      expect(service.findOne).toHaveBeenCalledWith(bookId);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if service.findOne throws it (or returns null)', async () => {
      // Service findOne is expected to throw NotFoundException if not found, as per its implementation
      mockBookService.findOne.mockRejectedValue(new NotFoundException());
      await expect(controller.findOne(bookId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const bookId = 'test-id';
    const updateDto: UpdateBookDto = { titulo: 'Updated' };
    const expectedResult: BookDto = { id: bookId, titulo: 'Updated', autor: 'Test', status: 'disponível' };

    it('should call service.update and return the result', async () => {
      mockBookService.update.mockResolvedValue(expectedResult);
      const result = await controller.update(bookId, updateDto);
      expect(service.update).toHaveBeenCalledWith(bookId, updateDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if service.update throws it', async () => {
      mockBookService.update.mockRejectedValue(new NotFoundException());
      await expect(controller.update(bookId, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    const bookId = 'test-id';
    const statusDto: UpdateBookStatusDto = { status: 'reservado' };
    const expectedResult: BookDto = { id: bookId, titulo: 'Test', autor: 'Test', status: 'reservado' };

    it('should call service.updateStatus and return the result', async () => {
      mockBookService.updateStatus.mockResolvedValue(expectedResult);
      const result = await controller.updateStatus(bookId, statusDto);
      expect(service.updateStatus).toHaveBeenCalledWith(bookId, statusDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if service.updateStatus throws it', async () => {
      mockBookService.updateStatus.mockRejectedValue(new NotFoundException());
      await expect(controller.updateStatus(bookId, statusDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    const bookId = 'test-id';
    it('should call service.remove and not throw error', async () => {
      mockBookService.remove.mockResolvedValue(undefined); // remove returns void
      await expect(controller.remove(bookId)).resolves.toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(bookId);
    });

    it('should throw NotFoundException if service.remove throws it', async () => {
      mockBookService.remove.mockRejectedValue(new NotFoundException());
      await expect(controller.remove(bookId)).rejects.toThrow(NotFoundException);
    });
  });
});
