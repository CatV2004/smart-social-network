import { CreatePostDto } from '../dto/create-post.dto';
import { Post as PostEntity } from '../entities/post.entity';
import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';

describe('PostsController.createPost() createPost method', () => {
  // Mocks
  const mockPostsService = {
    create: jest.fn(),
  } as unknown as jest.Mocked<PostsService>;

  let controller: PostsController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new PostsController(mockPostsService);
  });

  // Happy Paths
  describe('Happy paths', () => {
    it('should create a post and return the expected response object', async () => {
      // This test aims to verify that a valid post is created and the correct response is returned.
      const dto = {
        title: 'Test Title',
        content: 'Test Content',
      } as CreatePostDto;
      const createdPost = {
        id: 'abc123',
        title: 'Test Title',
        content: 'Test Content',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any as PostEntity;

      jest
        .mocked(mockPostsService.create)
        .mockResolvedValue(createdPost as any as never);

      const result = await controller.createPost(dto);

      expect(mockPostsService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        message: 'Post created successfully',
        postId: createdPost.id,
        post: createdPost,
      });
    });

    it('should handle posts with minimal required fields', async () => {
      // This test aims to verify that a post with only required fields is handled correctly.
      const dto = { title: 'Only Title' } as CreatePostDto;
      const createdPost = {
        id: 'id-minimal',
        title: 'Only Title',
        content: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any as PostEntity;

      jest
        .mocked(mockPostsService.create)
        .mockResolvedValue(createdPost as any as never);

      const result = await controller.createPost(dto);

      expect(mockPostsService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        message: 'Post created successfully',
        postId: createdPost.id,
        post: createdPost,
      });
    });

    it('should handle posts with extra optional fields', async () => {
      // This test aims to verify that a post with extra optional fields is handled correctly.
      const dto = {
        title: 'Title',
        content: 'Content',
        tags: ['nestjs', 'typescript'],
        isPublished: true,
      } as any as CreatePostDto;

      const createdPost = {
        id: 'id-extra',
        title: 'Title',
        content: 'Content',
        tags: ['nestjs', 'typescript'],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any as PostEntity;

      jest
        .mocked(mockPostsService.create)
        .mockResolvedValue(createdPost as any as never);

      const result = await controller.createPost(dto);

      expect(mockPostsService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        message: 'Post created successfully',
        postId: createdPost.id,
        post: createdPost,
      });
    });
  });

  // Edge Cases
  describe('Edge cases', () => {
    it('should propagate errors thrown by PostsService.create', async () => {
      // This test aims to verify that errors from the service are not swallowed and are propagated.
      const dto = { title: 'Error Case' } as CreatePostDto;
      const error = new Error('Service failure');

      jest.mocked(mockPostsService.create).mockRejectedValue(error as never);

      await expect(controller.createPost(dto)).rejects.toThrow(
        'Service failure',
      );
      expect(mockPostsService.create).toHaveBeenCalledWith(dto);
    });

    it('should handle posts with very long content', async () => {
      // This test aims to verify that posts with very long content are handled correctly.
      const longContent = 'a'.repeat(10000);
      const dto = {
        title: 'Long Content',
        content: longContent,
      } as CreatePostDto;
      const createdPost = {
        id: 'id-long',
        title: 'Long Content',
        content: longContent,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any as PostEntity;

      jest
        .mocked(mockPostsService.create)
        .mockResolvedValue(createdPost as any as never);

      const result = await controller.createPost(dto);

      expect(mockPostsService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        message: 'Post created successfully',
        postId: createdPost.id,
        post: createdPost,
      });
    });

    it('should handle posts with empty content if allowed', async () => {
      // This test aims to verify that posts with empty content are handled correctly if allowed by the DTO.
      const dto = { title: 'Empty Content', content: '' } as CreatePostDto;
      const createdPost = {
        id: 'id-empty',
        title: 'Empty Content',
        content: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any as PostEntity;

      jest
        .mocked(mockPostsService.create)
        .mockResolvedValue(createdPost as any as never);

      const result = await controller.createPost(dto);

      expect(mockPostsService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        message: 'Post created successfully',
        postId: createdPost.id,
        post: createdPost,
      });
    });

    it('should handle posts with special characters in title and content', async () => {
      // This test aims to verify that posts with special characters are handled correctly.
      const dto = {
        title: 'Tïtlé!@#$',
        content: 'Cøntënt*&^%',
      } as CreatePostDto;
      const createdPost = {
        id: 'id-special',
        title: 'Tïtlé!@#$',
        content: 'Cøntënt*&^%',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any as PostEntity;

      jest
        .mocked(mockPostsService.create)
        .mockResolvedValue(createdPost as any as never);

      const result = await controller.createPost(dto);

      expect(mockPostsService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        message: 'Post created successfully',
        postId: createdPost.id,
        post: createdPost,
      });
    });
  });
});
