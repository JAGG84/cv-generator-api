import { Router } from 'express';
import { generateCV } from '../controllers/cvController';

const router = Router();

// Versión corregida
router.post('/generate-cv', (req, res) => {
  generateCV(req, res).catch(error => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
  });
});

export default router;