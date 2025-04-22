import dotenv from 'dotenv';
dotenv.config();

export default {
  PORT: process.env.PORT || 3000,
  AWS: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    region: process.env.AWS_REGION!,
    bucket: process.env.AWS_S3_BUCKET_NAME!,
  },
  REDIS: {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
  WEBHOOK: {
    url: process.env.WEBHOOK_URL!,
    secret: process.env.WEBHOOK_SECRET!,
  },
};