import { Repository } from 'typeorm';
import { ProfilesService } from '../../profiles/profiles.service';
import { Post } from '../entities/post.entity';
import { PostsService } from '../posts.service';

// src/modules/posts/posts.service.spec.ts

// src/modules/posts/posts.service.spec.ts
// Manual mock for IPaginated interface
// Manual mock for UpdateResult
class MockUpdateResult {
  raw: any = {};
  affected: number = 1;
  generatedMaps: any[] = [];
}

// Manual mock for Repository<Post>
const mockPostRepository = {
  decrement: jest.fn(),
} as unknown as jest.Mocked<Repository<Post>>;

// Manual mock for ProfilesService
const mockProfilesService = {
  // No methods needed for decrementLikesCount
} as unknown as jest.Mocked<ProfilesService>;

// Mock paginate function from @/common/utils/pagination.util
jest.mock('@/common/utils/pagination.util', () => {
  const actual = jest.requireActual('@/common/utils/pagination.util');
  return {
    ...actual,
    paginate: jest.fn(),
    __esModule: true,
  };
});

describe('PostsService.decrementLikesCount() decrementLikesCount method', () => {
  let service: PostsService;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    service = new PostsService(
      mockPostRepository as any,
      mockProfilesService as any,
    );
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should decrement likesCount for a valid postId', async () => {
      // This test ensures that decrementLikesCount calls repository.decrement with correct arguments
      mockPostRepository.decrement = jest
        .fn()
        .mockResolvedValue(new MockUpdateResult() as any as never);

      const postId = 'valid-post-id';
      await service.decrementLikesCount(postId);

      expect(jest.mocked(mockPostRepository.decrement)).toHaveBeenCalledWith(
        { id: postId },
        'likesCount',
        1,
      );
      expect(jest.mocked(mockPostRepository.decrement)).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should handle repository.decrement resolving with UpdateResult', async () => {
      // This test ensures that the method works when repository.decrement returns a valid UpdateResult
      const updateResult = new MockUpdateResult();
      mockPostRepository.decrement = jest
        .fn()
        .mockResolvedValue(updateResult as any as never);

      const postId = 'another-valid-id';
      await expect(service.decrementLikesCount(postId)).resolves.not.toThrow();
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle repository.decrement throwing an error', async () => {
      // This test ensures that errors from repository.decrement are propagated
      mockPostRepository.decrement = jest
        .fn()
        .mockRejectedValue(new Error('DB error') as never);

      const postId = 'error-case-id';
      await expect(service.decrementLikesCount(postId)).rejects.toThrow(
        'DB error',
      );
    });

    it('should handle decrementing likesCount for a postId that does not exist', async () => {
      // This test simulates the repository returning UpdateResult with affected = 0 (no rows updated)
      const updateResult = new MockUpdateResult();
      updateResult.affected = 0;
      mockPostRepository.decrement = jest
        .fn()
        .mockResolvedValue(updateResult as any as never);

      const postId = 'non-existent-id';
      await expect(service.decrementLikesCount(postId)).resolves.not.toThrow();

      expect(jest.mocked(mockPostRepository.decrement)).toHaveBeenCalledWith(
        { id: postId },
        'likesCount',
        1,
      );
    });

    it('should handle decrementing likesCount for a postId with special characters', async () => {
      // This test ensures that special character postIds are handled
      mockPostRepository.decrement = jest
        .fn()
        .mockResolvedValue(new MockUpdateResult() as any as never);

      const postId = 'spécial-çhär$-id';
      await expect(service.decrementLikesCount(postId)).resolves.not.toThrow();

      expect(jest.mocked(mockPostRepository.decrement)).toHaveBeenCalledWith(
        { id: postId },
        'likesCount',
        1,
      );
    });

    it('should handle decrementing likesCount for a very long postId', async () => {
      // This test ensures that very long postIds are handled
      mockPostRepository.decrement = jest
        .fn()
        .mockResolvedValue(new MockUpdateResult() as any as never);

      const postId = 'a'.repeat(256);
      await expect(service.decrementLikesCount(postId)).resolves.not.toThrow();

      expect(jest.mocked(mockPostRepository.decrement)).toHaveBeenCalledWith(
        { id: postId },
        'likesCount',
        1,
      );
    });
  });
});
