import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

export const s3 = new AWS.S3({
  endpoint: process.env.AWS_ENDPOINT,  // LocalStack
  s3ForcePathStyle: true,              // Necesario para LocalStack
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION,
});