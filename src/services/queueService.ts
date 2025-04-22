import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { generatePDF } from './pdfService';
import dotenv from 'dotenv';
import { Webhook } from '../models/Webhook';
import crypto from 'crypto';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

dotenv.config();

console.log('🔐 Redis password:', process.env.REDIS_PASSWORD);
console.log('🔐 Redis host:', process.env.REDIS_HOST);
console.log('🔐 Redis port:', process.env.REDIS_PORT);

// Conexión a Redis
const redisConnection = new IORedis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

// Configuración de S3 (AWS SDK v3)
const s3 = new S3Client({
  endpoint: process.env.AWS_ENDPOINT,  // Para LocalStack
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,  // Necesario para LocalStack
});

// Cola para generación de PDFs
export const pdfQueue = new Queue('pdf-generation', {
  connection: redisConnection,
});

// Worker que procesa los jobs
export const pdfWorker = new Worker(
  'pdf-generation',
  async (job) => {
    const { data } = job;
    const pdfBuffer = await generatePDF(data);
    
    // Subir a S3 (AWS SDK v3)
    const fileName = `cv-${job.id}.pdf`;
    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileName,
      Body: pdfBuffer,
      ContentType: 'application/pdf',
    }));

    return fileName; // Devuelve el nombre del archivo
  },
  { connection: redisConnection }
);

// Generación de URL firmada (AWS SDK v3)
export async function getDownloadUrl(fileName: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: fileName,
  });
  
  return await getSignedUrl(s3, command, { expiresIn });
}

// Función para firmar payloads
function signPayload(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

// Manejador de eventos para webhooks
pdfWorker.on('completed', async (job, fileName: string) => {
  const webhooks = await Webhook.find({ events: 'pdf_generated' });
  
  for (const webhook of webhooks) {
    const payload = JSON.stringify({
      event: 'pdf_generated',
      jobId: job.id,
      downloadUrl: await getDownloadUrl(fileName),
      timestamp: new Date().toISOString(),
    });

    const signature = signPayload(payload, webhook.secret);

    try {
      await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': `sha256=${signature}`,
        },
        body: payload,
      });
    } catch (error) {
      console.error(`Error notifying webhook ${webhook.url}:`, error);
    }
  }
});