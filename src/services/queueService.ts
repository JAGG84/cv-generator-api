import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { generatePDF } from './pdfService';
import dotenv from 'dotenv';

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
export const pdfWorker = new Worker(
  'pdf-generation',
  async (job) => {
    const { data } = job;
    const pdfBuffer = await generatePDF(data);
    return pdfBuffer;
  },
  { connection: redisConnection }
);

// Manejador de eventos (opcional)
pdfWorker.on('completed', async (job, result) => {
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
});