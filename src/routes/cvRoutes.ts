import { Router } from 'express';
import { generateCV } from '../controllers/cvController';

const router = Router();

/**
 * @openapi
 * /api/generate-cv:
 *   post:
 *     tags: [CV]
 *     description: Genera un CV en PDF
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenerateCVInput'
 *     responses:
 *       202:
 *         description: PDF en cola de generación
 *         content:
 *           application/json:
 *             example:
 *               message: "PDF generation queued successfully"
 *               jobId: "12345"
 *               downloadUrl: "http://localhost:3000/download/cv-12345.pdf"
 */

// Versión corregida
router.post('/generate-cv', (req, res) => {
  generateCV(req, res).catch(error => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
  });
});

export default router;