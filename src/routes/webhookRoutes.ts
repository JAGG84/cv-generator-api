import { Router } from 'express';
import { registerWebhook } from '../controllers/webhookController';

const router = Router();

// Versión corregida con manejo de errores
router.post('/webhooks', async (req, res) => {
  try {
    await registerWebhook(req, res);
  } catch (error) {
    console.error('Unhandled error in webhook registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;