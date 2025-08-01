import { BadRequestException } from '@nestjs/common';
import { fileTypeFromBuffer } from 'file-type';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { MediaService } from '../media.service';

// Mock interfaces/types for dependencies
interface MockArrayBuffer {
  byteLength: number;
  slice: jest.Mock<any, any>;
}
type MockFileTypeResult = {
  ext: string;
  mime: string;
};
interface MockFile {
  buffer: Buffer | MockArrayBuffer;
  originalname?: string;
  mimetype?: string;
  size?: number;
  fieldname?: string;
  encoding?: string;
}

// Mock CloudinaryService
const mockCloudinaryService = {
  uploadFile: jest.fn(),
} as unknown as jest.Mocked<CloudinaryService>;

// Mock fileTypeFromBuffer
jest.mock('file-type', () => ({
  fileTypeFromBuffer: jest.fn(),
}));

const mockedFileTypeFromBuffer = jest.mocked(fileTypeFromBuffer);

describe('MediaService.uploadPostMedia() uploadPostMedia method', () => {
  let service: MediaService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MediaService(mockCloudinaryService as any);
  });

  // =========================
  // Happy Path Tests
  // =========================

  it('should upload a valid image file when expectedType is "image"', async () => {
    // This test ensures that a valid image file is processed and uploaded correctly.
    const mockFile: MockFile = {
      buffer: Buffer.from('mock image data'),
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
      size: 1234,
    };
    const mockFileTypeResult: MockFileTypeResult = {
      ext: 'jpg',
      mime: 'image/jpeg',
    };

    mockedFileTypeFromBuffer.mockResolvedValueOnce(
      mockFileTypeResult as any as never,
    );
    jest
      .mocked(mockCloudinaryService.uploadFile)
      .mockResolvedValueOnce({ url: 'mock-url' } as any as never);

    const result = await service.uploadPostMedia(mockFile as any, 'image');

    expect(mockedFileTypeFromBuffer).toHaveBeenCalledWith(mockFile.buffer);
    expect(mockCloudinaryService.uploadFile).toHaveBeenCalledWith(
      mockFile as any,
      'posts/image',
    );
    expect(result).toEqual({ url: 'mock-url' });
  });

  it('should upload a valid video file when expectedType is "video"', async () => {
    // This test ensures that a valid video file is processed and uploaded correctly.
    const mockFile: MockFile = {
      buffer: Buffer.from('mock video data'),
      originalname: 'test.mp4',
      mimetype: 'video/mp4',
      size: 4321,
    };
    const mockFileTypeResult: MockFileTypeResult = {
      ext: 'mp4',
      mime: 'video/mp4',
    };

    mockedFileTypeFromBuffer.mockResolvedValueOnce(
      mockFileTypeResult as any as never,
    );
    jest
      .mocked(mockCloudinaryService.uploadFile)
      .mockResolvedValueOnce({ url: 'mock-video-url' } as any as never);

    const result = await service.uploadPostMedia(mockFile as any, 'video');

    expect(mockedFileTypeFromBuffer).toHaveBeenCalledWith(mockFile.buffer);
    expect(mockCloudinaryService.uploadFile).toHaveBeenCalledWith(
      mockFile as any,
      'posts/video',
    );
    expect(result).toEqual({ url: 'mock-video-url' });
  });

  it('should upload a valid audio file when expectedType is "audio"', async () => {
    // This test ensures that a valid audio file is processed and uploaded correctly.
    const mockFile: MockFile = {
      buffer: Buffer.from('mock audio data'),
      originalname: 'test.mp3',
      mimetype: 'audio/mpeg',
      size: 2222,
    };
    const mockFileTypeResult: MockFileTypeResult = {
      ext: 'mp3',
      mime: 'audio/mpeg',
    };

    mockedFileTypeFromBuffer.mockResolvedValueOnce(
      mockFileTypeResult as any as never,
    );
    jest
      .mocked(mockCloudinaryService.uploadFile)
      .mockResolvedValueOnce({ url: 'mock-audio-url' } as any as never);

    const result = await service.uploadPostMedia(mockFile as any, 'audio');

    expect(mockedFileTypeFromBuffer).toHaveBeenCalledWith(mockFile.buffer);
    expect(mockCloudinaryService.uploadFile).toHaveBeenCalledWith(
      mockFile as any,
      'posts/audio',
    );
    expect(result).toEqual({ url: 'mock-audio-url' });
  });

  it('should upload any file type when expectedType is "other"', async () => {
    // This test ensures that any file type is accepted and uploaded when expectedType is "other".
    const mockFile: MockFile = {
      buffer: Buffer.from('mock pdf data'),
      originalname: 'test.pdf',
      mimetype: 'application/pdf',
      size: 5555,
    };
    const mockFileTypeResult: MockFileTypeResult = {
      ext: 'pdf',
      mime: 'application/pdf',
    };

    mockedFileTypeFromBuffer.mockResolvedValueOnce(
      mockFileTypeResult as any as never,
    );
    jest
      .mocked(mockCloudinaryService.uploadFile)
      .mockResolvedValueOnce({ url: 'mock-other-url' } as any as never);

    const result = await service.uploadPostMedia(mockFile as any, 'other');

    expect(mockedFileTypeFromBuffer).toHaveBeenCalledWith(mockFile.buffer);
    expect(mockCloudinaryService.uploadFile).toHaveBeenCalledWith(
      mockFile as any,
      'posts/other',
    );
    expect(result).toEqual({ url: 'mock-other-url' });
  });

  // =========================
  // Edge Case & Error Tests
  // =========================

  it('should throw BadRequestException if file is not provided', async () => {
    // This test ensures that the method throws if file is missing.
    await expect(
      service.uploadPostMedia(undefined as any, 'image'),
    ).rejects.toThrow(BadRequestException);
    await expect(
      service.uploadPostMedia(undefined as any, 'image'),
    ).rejects.toThrow('File not provided or invalid.');
  });

  it('should throw BadRequestException if file.buffer is not provided', async () => {
    // This test ensures that the method throws if file.buffer is missing.
    const mockFile: MockFile = {
      buffer: undefined as any,
      originalname: 'test.jpg',
    };
    await expect(
      service.uploadPostMedia(mockFile as any, 'image'),
    ).rejects.toThrow(BadRequestException);
    await expect(
      service.uploadPostMedia(mockFile as any, 'image'),
    ).rejects.toThrow('File not provided or invalid.');
  });

  it('should throw BadRequestException if fileTypeFromBuffer returns undefined', async () => {
    // This test ensures that the method throws if fileTypeFromBuffer cannot detect the file type.
    const mockFile: MockFile = {
      buffer: Buffer.from('mock data'),
      originalname: 'test.unknown',
    };
    mockedFileTypeFromBuffer.mockResolvedValueOnce(undefined as any as never);

    await expect(
      service.uploadPostMedia(mockFile as any, 'image'),
    ).rejects.toThrow(BadRequestException);
    await expect(
      service.uploadPostMedia(mockFile as any, 'image'),
    ).rejects.toThrow('Unable to detect file type.');
  });

  it('should throw BadRequestException if detected mime does not match expectedType "image"', async () => {
    // This test ensures that the method throws if the detected mime does not match the expected type.
    const mockFile: MockFile = {
      buffer: Buffer.from('mock data'),
      originalname: 'test.mp4',
    };
    const mockFileTypeResult: MockFileTypeResult = {
      ext: 'mp4',
      mime: 'video/mp4',
    };
    mockedFileTypeFromBuffer.mockResolvedValueOnce(
      mockFileTypeResult as any as never,
    );

    await expect(
      service.uploadPostMedia(mockFile as any, 'image'),
    ).rejects.toThrow(BadRequestException);
    await expect(
      service.uploadPostMedia(mockFile as any, 'image'),
    ).rejects.toThrow(
      'Uploaded file is not a valid image. Detected MIME type: video/mp4',
    );
  });

  it('should throw BadRequestException if detected mime does not match expectedType "video"', async () => {
    // This test ensures that the method throws if the detected mime does not match the expected type.
    const mockFile: MockFile = {
      buffer: Buffer.from('mock data'),
      originalname: 'test.jpg',
    };
    const mockFileTypeResult: MockFileTypeResult = {
      ext: 'jpg',
      mime: 'image/jpeg',
    };
    mockedFileTypeFromBuffer.mockResolvedValueOnce(
      mockFileTypeResult as any as never,
    );

    await expect(
      service.uploadPostMedia(mockFile as any, 'video'),
    ).rejects.toThrow(BadRequestException);
    await expect(
      service.uploadPostMedia(mockFile as any, 'video'),
    ).rejects.toThrow(
      'Uploaded file is not a valid video. Detected MIME type: image/jpeg',
    );
  });

  it('should throw BadRequestException if detected mime does not match expectedType "audio"', async () => {
    // This test ensures that the method throws if the detected mime does not match the expected type.
    const mockFile: MockFile = {
      buffer: Buffer.from('mock data'),
      originalname: 'test.jpg',
    };
    const mockFileTypeResult: MockFileTypeResult = {
      ext: 'jpg',
      mime: 'image/jpeg',
    };
    mockedFileTypeFromBuffer.mockResolvedValueOnce(
      mockFileTypeResult as any as never,
    );

    await expect(
      service.uploadPostMedia(mockFile as any, 'audio'),
    ).rejects.toThrow(BadRequestException);
    await expect(
      service.uploadPostMedia(mockFile as any, 'audio'),
    ).rejects.toThrow(
      'Uploaded file is not a valid audio. Detected MIME type: image/jpeg',
    );
  });

  it('should call cloudinary.uploadFile with correct folder for "other" type', async () => {
    // This test ensures that the folder passed to uploadFile is correct for "other" type.
    const mockFile: MockFile = {
      buffer: Buffer.from('mock data'),
      originalname: 'test.txt',
    };
    const mockFileTypeResult: MockFileTypeResult = {
      ext: 'txt',
      mime: 'text/plain',
    };
    mockedFileTypeFromBuffer.mockResolvedValueOnce(
      mockFileTypeResult as any as never,
    );
    jest
      .mocked(mockCloudinaryService.uploadFile)
      .mockResolvedValueOnce({ url: 'mock-other-url' } as any as never);

    const result = await service.uploadPostMedia(mockFile as any, 'other');

    expect(mockCloudinaryService.uploadFile).toHaveBeenCalledWith(
      mockFile as any,
      'posts/other',
    );
    expect(result).toEqual({ url: 'mock-other-url' });
  });

  it('should handle file with extra properties and still upload correctly', async () => {
    // This test ensures that files with extra properties are still processed and uploaded.
    const mockFile: MockFile = {
      buffer: Buffer.from('mock data'),
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
      size: 1000,
      fieldname: 'file',
      encoding: '7bit',
    };
    const mockFileTypeResult: MockFileTypeResult = {
      ext: 'jpg',
      mime: 'image/jpeg',
    };
    mockedFileTypeFromBuffer.mockResolvedValueOnce(
      mockFileTypeResult as any as never,
    );
    jest
      .mocked(mockCloudinaryService.uploadFile)
      .mockResolvedValueOnce({ url: 'mock-url' } as any as never);

    const result = await service.uploadPostMedia(mockFile as any, 'image');

    expect(mockCloudinaryService.uploadFile).toHaveBeenCalledWith(
      mockFile as any,
      'posts/image',
    );
    expect(result).toEqual({ url: 'mock-url' });
  });
});
