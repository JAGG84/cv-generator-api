// src/controllers/cvController.ts
import { Request, Response } from 'express';
import { generatePDF } from '../services/pdfService';

export const generateCV = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, phone, experience } = req.body;

    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required' });
      return;
    }

    const pdf = await generatePDF({ name, email, phone, experience });

    res.contentType('application/pdf');
    res.send(pdf); // ✅ única respuesta

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};
