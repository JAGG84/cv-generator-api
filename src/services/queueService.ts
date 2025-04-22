import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { generatePDF } from './pdfService';
import dotenv from 'dotenv';
import { s3 } from '../config/s3Client';

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

// Cola para generación de PDFs
export const pdfQueue = new Queue('pdf-generation', {
  connection: redisConnection,
});

// Worker que procesa los jobs
let pdfWorker: Worker;
export { pdfWorker };

// Manejador de eventos (opcional)
/*pdfWorker.on('completed', async (job, result) => {
  if (process.env.WEBHOOK_URL) {
    await fetch(process.env.WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'pdf_generated',
        jobId: job.id,
        downloadUrl: `http://localhost:3000/download/${job.id}.pdf`, // Ejemplo
      }),
    });
  }
});*/
pdfWorker = new Worker(
  'pdf-generation',
  async (job) => {
    const { data } = job;
    const pdfBuffer = await generatePDF(data);
    
    // Subir a S3
    const fileName = `cv-${job.id}.pdf`;
    await s3.upload({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileName,
      Body: pdfBuffer,
      ContentType: 'application/pdf',
    }).promise();

    return fileName; // Devuelve el nombre del archivo
  },
  { connection: redisConnection }
);

export async function getDownloadUrl(fileName: string, expiresIn = 3600): Promise<string> {
  return s3.getSignedUrlPromise('getObject', {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: fileName,
    Expires: expiresIn, // 1 hora de validez
  });
}