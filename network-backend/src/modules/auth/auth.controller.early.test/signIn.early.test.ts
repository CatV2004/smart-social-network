import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { SignInDto } from '../dto/sign-in.dto';
import { TokensResponseDto } from '../dto/tokens-response.dto';

describe('AuthController.signIn() signIn method', () => {
  let controller: AuthController;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockSignInDto: jest.Mocked<SignInDto>;

  beforeEach(() => {
    // Create a mock for AuthService
    mockAuthService = {
      signIn: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    // Create a mock for SignInDto
    mockSignInDto = {} as unknown as jest.Mocked<SignInDto>;

    controller = new AuthController(mockAuthService);
  });

  // Happy Paths
  describe('Happy paths', () => {
    it('should return tokens when signIn is successful with typical credentials', async () => {
      // This test aims to verify that the controller returns the expected tokens when signIn is successful.
      const tokensResponse: TokensResponseDto = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      } as any;

      jest
        .mocked(mockAuthService.signIn)
        .mockResolvedValue(tokensResponse as any as never);

      const result = await controller.signIn(mockSignInDto);

      expect(mockAuthService.signIn).toHaveBeenCalledWith(mockSignInDto);
      expect(result).toBe(tokensResponse);
    });

    it('should return tokens with different valid token values', async () => {
      // This test aims to verify that the controller can handle and return different valid token values.
      const tokensResponse: TokensResponseDto = {
        accessToken: 'another-access-token',
        refreshToken: 'another-refresh-token',
      } as any;

      jest
        .mocked(mockAuthService.signIn)
        .mockResolvedValue(tokensResponse as any as never);

      const result = await controller.signIn(mockSignInDto);

      expect(mockAuthService.signIn).toHaveBeenCalledWith(mockSignInDto);
      expect(result).toBe(tokensResponse);
    });
  });

  // Edge Cases
  describe('Edge cases', () => {
    it('should propagate errors thrown by AuthService.signIn', async () => {
      // This test aims to verify that the controller correctly propagates errors from the AuthService.
      const error = new Error('Invalid credentials');
      jest.mocked(mockAuthService.signIn).mockRejectedValue(error as never);

      await expect(controller.signIn(mockSignInDto)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(mockAuthService.signIn).toHaveBeenCalledWith(mockSignInDto);
    });

    it('should handle empty string tokens returned by AuthService', async () => {
      // This test aims to verify that the controller can handle empty string tokens (edge case).
      const tokensResponse: TokensResponseDto = {
        accessToken: '',
        refreshToken: '',
      } as any;

      jest
        .mocked(mockAuthService.signIn)
        .mockResolvedValue(tokensResponse as any as never);

      const result = await controller.signIn(mockSignInDto);

      expect(mockAuthService.signIn).toHaveBeenCalledWith(mockSignInDto);
      expect(result).toBe(tokensResponse);
      expect(result.accessToken).toBe('');
      expect(result.refreshToken).toBe('');
    });

    it('should handle unusually long token strings', async () => {
      // This test aims to verify that the controller can handle very long token strings.
      const longToken = 'a'.repeat(10000);
      const tokensResponse: TokensResponseDto = {
        accessToken: longToken,
        refreshToken: longToken,
      } as any;

      jest
        .mocked(mockAuthService.signIn)
        .mockResolvedValue(tokensResponse as any as never);

      const result = await controller.signIn(mockSignInDto);

      expect(mockAuthService.signIn).toHaveBeenCalledWith(mockSignInDto);
      expect(result.accessToken).toBe(longToken);
      expect(result.refreshToken).toBe(longToken);
    });

    it('should handle AuthService.signIn returning an object with extra properties', async () => {
      // This test aims to verify that the controller can handle extra properties in the returned object.
      const tokensResponse = {
        accessToken: 'token',
        refreshToken: 'token',
        extra: 'extra-value',
      } as any;

      jest
        .mocked(mockAuthService.signIn)
        .mockResolvedValue(tokensResponse as any as never);

      const result = await controller.signIn(mockSignInDto);

      expect(mockAuthService.signIn).toHaveBeenCalledWith(mockSignInDto);
      expect(result.accessToken).toBe('token');
      expect(result.refreshToken).toBe('token');
      expect((result as any).extra).toBe('extra-value');
    });
  });
});
