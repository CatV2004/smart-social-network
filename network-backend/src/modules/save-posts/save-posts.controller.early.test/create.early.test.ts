import { SavePostsController } from '../save-posts.controller';
import { SavePostsService } from '../save-posts.service';

// src/save-posts/save-posts.controller.create.spec.ts
// Manual Jest mock for SavePostsService
const mockSavePostsService = {
  create: jest.fn(),
  // other methods omitted for brevity
} as unknown as jest.Mocked<SavePostsService>;

describe('SavePostsController.create() create method', () => {
  let controller: SavePostsController;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    controller = new SavePostsController(mockSavePostsService);
  });

  // Happy Path Tests
  describe('Happy paths', () => {
    it('should create a post with valid dto and return the result', () => {
      // This test aims to verify that the controller calls the service with the correct DTO and returns its result.
      const dto: CreateSavePostDto = {
        userId: 'user-1',
        postId: 'post-1',
        savedAt: new Date().toISOString(),
      };
      const expectedResult = { id: 'saved-1', ...dto } as any;

      jest
        .mocked(mockSavePostsService.create)
        .mockReturnValue(expectedResult as any);

      const result = controller.create(dto);

      expect(mockSavePostsService.create).toHaveBeenCalledWith(dto);
      expect(result).toBe(expectedResult);
    });

    it('should handle multiple valid DTOs with different data', () => {
      // This test aims to verify that the controller works with different valid DTOs.
      const dto: CreateSavePostDto = {
        userId: 'user-2',
        postId: 'post-99',
        savedAt: '2024-06-01T12:00:00.000Z',
      };
      const expectedResult = { id: 'saved-99', ...dto } as any;

      jest
        .mocked(mockSavePostsService.create)
        .mockReturnValue(expectedResult as any);

      const result = controller.create(dto);

      expect(mockSavePostsService.create).toHaveBeenCalledWith(dto);
      expect(result).toBe(expectedResult);
    });

    it('should propagate the service return value (object, array, primitive)', () => {
      // This test aims to verify that the controller returns whatever the service returns, including arrays and primitives.
      const dto: CreateSavePostDto = {
        userId: 'user-3',
        postId: 'post-3',
        savedAt: '2024-06-02T10:00:00.000Z',
      };

      // Service returns an array
      jest
        .mocked(mockSavePostsService.create)
        .mockReturnValue([{ id: 'saved-3', ...dto }] as any);
      expect(controller.create(dto)).toEqual([{ id: 'saved-3', ...dto }]);

      // Service returns a primitive
      jest.mocked(mockSavePostsService.create).mockReturnValue('success');
      expect(controller.create(dto)).toBe('success');
    });
  });

  // Edge Case Tests
  describe('Edge cases', () => {
    it('should handle DTO with minimal required fields', () => {
      // This test aims to verify that the controller works with a DTO containing only minimal required fields.
      const dto: CreateSavePostDto = {
        userId: 'user-min',
        postId: 'post-min',
        savedAt: '2024-01-01T00:00:00.000Z',
      };
      const expectedResult = { id: 'saved-min', ...dto } as any;

      jest
        .mocked(mockSavePostsService.create)
        .mockReturnValue(expectedResult as any);

      const result = controller.create(dto);

      expect(mockSavePostsService.create).toHaveBeenCalledWith(dto);
      expect(result).toBe(expectedResult);
    });

    it('should handle DTO with extra/unexpected fields', () => {
      // This test aims to verify that the controller passes through extra fields in the DTO.
      const dto = {
        userId: 'user-extra',
        postId: 'post-extra',
        savedAt: '2024-01-01T00:00:00.000Z',
        extraField: 'unexpected',
      } as any as CreateSavePostDto;
      const expectedResult = { id: 'saved-extra', ...dto } as any;

      jest
        .mocked(mockSavePostsService.create)
        .mockReturnValue(expectedResult as any);

      const result = controller.create(dto);

      expect(mockSavePostsService.create).toHaveBeenCalledWith(dto);
      expect(result).toBe(expectedResult);
    });

    it('should propagate errors thrown by the service', () => {
      // This test aims to verify that if the service throws, the controller propagates the error.
      const dto: CreateSavePostDto = {
        userId: 'user-error',
        postId: 'post-error',
        savedAt: '2024-01-01T00:00:00.000Z',
      };
      const error = new Error('Service error');

      jest.mocked(mockSavePostsService.create).mockImplementation(() => {
        throw error;
      });

      expect(() => controller.create(dto)).toThrow(error);
    });

    it('should handle DTO with very large string values', () => {
      // This test aims to verify that the controller can handle DTOs with very large string values.
      const largeString = 'x'.repeat(10000);
      const dto: CreateSavePostDto = {
        userId: largeString,
        postId: largeString,
        savedAt: '2024-01-01T00:00:00.000Z',
      };
      const expectedResult = { id: 'saved-large', ...dto } as any;

      jest
        .mocked(mockSavePostsService.create)
        .mockReturnValue(expectedResult as any);

      const result = controller.create(dto);

      expect(mockSavePostsService.create).toHaveBeenCalledWith(dto);
      expect(result).toBe(expectedResult);
    });

    it('should handle DTO with empty string values', () => {
      // This test aims to verify that the controller can handle DTOs with empty string values.
      const dto: CreateSavePostDto = {
        userId: '',
        postId: '',
        savedAt: '',
      };
      const expectedResult = { id: 'saved-empty', ...dto } as any;

      jest
        .mocked(mockSavePostsService.create)
        .mockReturnValue(expectedResult as any);

      const result = controller.create(dto);

      expect(mockSavePostsService.create).toHaveBeenCalledWith(dto);
      expect(result).toBe(expectedResult);
    });
  });
});
