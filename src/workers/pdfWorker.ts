import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { generatePDF } from '../services/pdfService'; // si ya tienes esto

const connection = new IORedis({
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  'generate-cv',
  async (job) => {
    const { name, email, phone, experience } = job.data;
    console.log(`🛠 Generando PDF para ${name}`);
    const pdfBuffer = await generatePDF({ name, email, phone, experience });
    // guardar archivo o subir a S3 si quieres
  },
  { connection }
);

worker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completado`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} falló:`, err);
});
