import { Request, Response } from 'express';
import { GenerateCVSchema, GenerateCVInput } from '../schemas';
import { pdfQueue, getDownloadUrl } from '../services/queueService';
import { ZodError } from 'zod'; 

export const generateCV = async (req: Request, res: Response) => {
    try {
      const validatedData: GenerateCVInput = GenerateCVSchema.parse(req.body);
      
      const job = await pdfQueue.add('generate-cv', validatedData);
      const downloadUrl = await getDownloadUrl(`cv-${job.id}.pdf`);
  
      res.status(202).json({
        message: 'PDF generation queued successfully',
        jobId: job.id,
        downloadUrl
      });
  
    } catch (error) {
      if (error instanceof ZodError) {  // Cambiado de z.ZodError a ZodError
        return res.status(400).json({
          errors: error.errors.map((e: { path: (string | number)[]; message: string }) => ({
            path: e.path.join('.'),
            message: e.message
          }))
        });
      }
      console.error('Error in CV generation:', error);
      res.status(500).json({ error: 'Failed to queue PDF generation' });
    }
};