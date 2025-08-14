import { IPaginated } from '@/common/dtos/paginated.interface';
import { PaginationQueryDto } from '@/common/dtos/pagination-query.dto';
import { PostResponseDto } from '../dto/response-post.dto';
import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';

// Manual mock for PaginationQueryDto
class MockPaginationQueryDto implements PaginationQueryDto {
  // Add properties as needed for edge cases
  public limit: number = 10;
  public offset: number = 0;
}

// Manual mock for PostResponseDto
class MockPostResponseDto implements PostResponseDto {
  public id: string = 'post-id';
  public title: string = 'Test Title';
  public content: string = 'Test Content';
  public authorId: string = 'author-id';
}

// Manual mock for IPaginated<PostResponseDto>
class MockPaginationMetaDto {
  public totalItems: number = 1;
  public itemCount: number = 1;
  public itemsPerPage: number = 10;
  public totalPages: number = 1;
  public currentPage: number = 1;
}

class MockIPaginated implements IPaginated<PostResponseDto> {
  public data: PostResponseDto[] = [new MockPostResponseDto() as any];
  public meta: MockPaginationMetaDto = new MockPaginationMetaDto();
}

// Manual mock for PostsService
const mockPostsService = {
  findByProfileId: jest.fn(),
} as unknown as jest.Mocked<PostsService>;

// Mock PaginatedResponseDto factory as per instruction
jest.mock('@/common/dtos/paginated-response.factory', () => {
  const actual = jest.requireActual('@/common/dtos/paginated-response.factory');
  return {
    ...actual,
    PaginatedResponseDto: jest.fn() as any,
  };
});

describe('PostsController.getByProfile() getByProfile method', () => {
  let controller: PostsController;

  beforeEach(() => {
    controller = new PostsController(mockPostsService as any);
    jest.clearAllMocks();
  });

  // Happy Path Tests
  it('should return paginated posts for a valid profileId and default pagination', async () => {
    // This test ensures that the method returns paginated posts for a valid profileId and default pagination.
    const profileId = 'profile-123';
    const pagination = new MockPaginationQueryDto() as any;
    const paginatedResult = new MockIPaginated() as any;

    jest
      .mocked(mockPostsService.findByProfileId)
      .mockResolvedValue(paginatedResult as any as never);

    const result = await controller.getByProfile(profileId, pagination);

    expect(mockPostsService.findByProfileId).toHaveBeenCalledWith(
      profileId,
      pagination,
    );
    expect(result).toBe(paginatedResult);
  });

  it('should return paginated posts for a valid profileId and custom pagination', async () => {
    // This test ensures that the method works with custom pagination parameters.
    const profileId = 'profile-456';
    const pagination = new MockPaginationQueryDto() as any;
    pagination.limit = 5;
    pagination.offset = 2;
    const paginatedResult = new MockIPaginated() as any;
    paginatedResult.meta.itemsPerPage = 5;
    paginatedResult.meta.currentPage = 1;

    jest
      .mocked(mockPostsService.findByProfileId)
      .mockResolvedValue(paginatedResult as any as never);

    const result = await controller.getByProfile(profileId, pagination);

    expect(mockPostsService.findByProfileId).toHaveBeenCalledWith(
      profileId,
      pagination,
    );
    expect(result).toBe(paginatedResult);
  });

  it('should return empty data array if no posts found for profileId', async () => {
    // This test ensures that the method returns an empty data array if no posts are found for the given profileId.
    const profileId = 'profile-empty';
    const pagination = new MockPaginationQueryDto() as any;
    const paginatedResult = {
      data: [],
      meta: new MockPaginationMetaDto(),
    } as any;

    jest
      .mocked(mockPostsService.findByProfileId)
      .mockResolvedValue(paginatedResult as any as never);

    const result = await controller.getByProfile(profileId, pagination);

    expect(mockPostsService.findByProfileId).toHaveBeenCalledWith(
      profileId,
      pagination,
    );
    expect(result.data).toEqual([]);
    expect(result.meta).toBeInstanceOf(MockPaginationMetaDto);
  });

  // Edge Case Tests
  it('should handle profileId with special characters', async () => {
    // This test ensures that the method can handle profileId containing special characters.
    const profileId = 'profile-!@#$%^&*()_+';
    const pagination = new MockPaginationQueryDto() as any;
    const paginatedResult = new MockIPaginated() as any;

    jest
      .mocked(mockPostsService.findByProfileId)
      .mockResolvedValue(paginatedResult as any as never);

    const result = await controller.getByProfile(profileId, pagination);

    expect(mockPostsService.findByProfileId).toHaveBeenCalledWith(
      profileId,
      pagination,
    );
    expect(result).toBe(paginatedResult);
  });

  it('should handle pagination with zero limit and offset', async () => {
    // This test ensures that the method can handle pagination with zero limit and offset.
    const profileId = 'profile-789';
    const pagination = new MockPaginationQueryDto() as any;
    pagination.limit = 0;
    pagination.offset = 0;
    const paginatedResult = {
      data: [],
      meta: new MockPaginationMetaDto(),
    } as any;

    jest
      .mocked(mockPostsService.findByProfileId)
      .mockResolvedValue(paginatedResult as any as never);

    const result = await controller.getByProfile(profileId, pagination);

    expect(mockPostsService.findByProfileId).toHaveBeenCalledWith(
      profileId,
      pagination,
    );
    expect(result.data).toEqual([]);
  });

  it('should handle very large pagination values', async () => {
    // This test ensures that the method can handle very large pagination values.
    const profileId = 'profile-large';
    const pagination = new MockPaginationQueryDto() as any;
    pagination.limit = 10000;
    pagination.offset = 5000;
    const paginatedResult = new MockIPaginated() as any;
    paginatedResult.meta.itemsPerPage = 10000;
    paginatedResult.meta.currentPage = 1;

    jest
      .mocked(mockPostsService.findByProfileId)
      .mockResolvedValue(paginatedResult as any as never);

    const result = await controller.getByProfile(profileId, pagination);

    expect(mockPostsService.findByProfileId).toHaveBeenCalledWith(
      profileId,
      pagination,
    );
    expect(result.meta.itemsPerPage).toBe(10000);
  });

  it('should propagate errors thrown by PostsService.findByProfileId', async () => {
    // This test ensures that errors thrown by the PostsService are propagated.
    const profileId = 'profile-error';
    const pagination = new MockPaginationQueryDto() as any;
    const error = new Error('Service error');

    jest
      .mocked(mockPostsService.findByProfileId)
      .mockRejectedValue(error as never);

    await expect(
      controller.getByProfile(profileId, pagination),
    ).rejects.toThrow('Service error');
    expect(mockPostsService.findByProfileId).toHaveBeenCalledWith(
      profileId,
      pagination,
    );
  });

  it('should handle empty string as profileId', async () => {
    // This test ensures that the method can handle an empty string as profileId.
    const profileId = '';
    const pagination = new MockPaginationQueryDto() as any;
    const paginatedResult = {
      data: [],
      meta: new MockPaginationMetaDto(),
    } as any;

    jest
      .mocked(mockPostsService.findByProfileId)
      .mockResolvedValue(paginatedResult as any as never);

    const result = await controller.getByProfile(profileId, pagination);

    expect(mockPostsService.findByProfileId).toHaveBeenCalledWith(
      profileId,
      pagination,
    );
    expect(result.data).toEqual([]);
  });

  it('should handle numeric string as profileId', async () => {
    // This test ensures that the method can handle a numeric string as profileId.
    const profileId = '123456';
    const pagination = new MockPaginationQueryDto() as any;
    const paginatedResult = new MockIPaginated() as any;

    jest
      .mocked(mockPostsService.findByProfileId)
      .mockResolvedValue(paginatedResult as any as never);

    const result = await controller.getByProfile(profileId, pagination);

    expect(mockPostsService.findByProfileId).toHaveBeenCalledWith(
      profileId,
      pagination,
    );
    expect(result).toBe(paginatedResult);
  });
});
