/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dotenv from 'dotenv';
dotenv.config();

const config = {
  NODE_ENV: process.env.NODE_ENV! as string,
  PORT: process.env.PORT! as string,

  MONGO_URI: process.env.MONGO_URI! as string,
  REDIS_HOST: process.env.REDIS_HOST! as string,
  REDIS_PORT: process.env.REDIS_PORT! as string,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET! as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET! as string,
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',
  JWT_REFRESH_EXPIRY_SECONDS: 7 * 24 * 60 * 60, // 7 days in seconds

  SERVER_NAME: `${process.env.SERVER_NAME || 'BRIDGE'}-${process.env.NODE_ENV}`,

  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME! as string,
  AWS_ACCESS_ID: process.env.AWS_ACCESS_ID! as string,
  AWS_SECRET: process.env.AWS_SECRET! as string,
  AWS_REGION: process.env.AWS_REGION! as string,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID! as string,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET! as string,

  CLOUDWATCH_LOG_GROUP_NAME: process.env.CLOUDWATCH_LOG_GROUP_NAME! as string,
  CLOUDWATCH_LOGS_ID: process.env.CLOUDWATCH_LOGS_ID! as string,
  CLOUDWATCH_LOGS_SECRET: process.env.CLOUDWATCH_LOGS_SECRET! as string,
  CLOUDWATCH_LOGS_REGION: process.env.CLOUDWATCH_LOGS_REGION! as string,

  JWT_CACHE_ENCRYPTION_KEY: process.env.JWT_CACHE_ENCRYPTION_KEY! as string,

  STATIC_OTP: '1111',
};

export default config;
