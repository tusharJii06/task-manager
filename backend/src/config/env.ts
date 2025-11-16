import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || '4000',
  nodeEnv: process.env.NODE_ENV || 'development',
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'dev-access-secret',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'dev-refresh-secret',
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000'
};
