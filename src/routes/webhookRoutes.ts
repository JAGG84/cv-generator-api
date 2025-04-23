import { Router } from 'express';
import { registerWebhook, getWebhookAttempts } from '../controllers/webhookController';

const router = Router();

router.post('/webhooks', registerWebhook);
router.get('/webhooks/:id/attempts', getWebhookAttempts);

export default router;