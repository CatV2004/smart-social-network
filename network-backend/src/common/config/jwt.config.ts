// import { registerAs } from '@nestjs/config';

// export default registerAs('jwt', () => {
//   return {
//     secret: process.env.JWT_SECRET,
//     expiresIn: process.env.JWT_EXPIRES_IN,
//     accessTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL || '3600', 10), //1h
//     refreshSecret: process.env.JWT_REFRESH_SECRET,
//     refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
//     refreshTokenTtl: parseInt(process.env.JWT_REFRESH_TOKEN_TTL || '86400', 10), //24h
//   };
// });

import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
  accessTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL || '3600', 10), // 1h
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  refreshTokenTtl: parseInt(process.env.JWT_REFRESH_TOKEN_TTL || '86400', 10), // 24h
}));
