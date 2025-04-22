import { Request, Response, NextFunction } from 'express';
import { pdfQueue } from '../services/queueService';

export const generateCV = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, phone, experience } = req.body;

    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required' });
      return;
    }

    // Encolar el trabajo
    await pdfQueue.add('generate-cv', {
      name,
      email,
      phone,
      experience,
    });

    res.status(202).json({
      message: 'PDF generation queued successfully',
      jobId: `cv-${Date.now()}`,
    });

  } catch (error) {
    console.error('Error queuing PDF generation:', error);
    res.status(500).json({ error: 'Failed to queue PDF generation' });
  }
};
