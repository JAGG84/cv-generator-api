import { Request, Response } from 'express';
import { pdfQueue, getDownloadUrl } from '../services/queueService';

export const generateCV = async (req: Request, res: Response) => {
    try {
      const { name, email } = req.body;
  
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }
  
      const job = await pdfQueue.add('generate-cv', req.body);
      const downloadUrl = await getDownloadUrl(`cv-${job.id}.pdf`);
  
      res.status(202).json({
        message: 'PDF generation queued',
        jobId: job.id,
        downloadUrl,  // URL temporal para descargar el PDF
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to queue PDF generation' });
    }
  };