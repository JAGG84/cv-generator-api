import { Request, Response } from 'express';
import { Webhook } from '../models/Webhook';
import crypto from 'crypto';

export const registerWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { url, events } = req.body;

    if (!url) {
      res.status(400).json({ error: 'URL is required' });
      return;
    }

    const secret = crypto.randomBytes(16).toString('hex');
    const webhook = await Webhook.create({ url, secret, events });

    res.status(201).json({
      id: webhook._id,
      url: webhook.url,
      events: webhook.events,
      secret: webhook.secret // Solo para desarrollo, no exponer en producción
    });

  } catch (error) {
    console.error('Error registering webhook:', error);
    res.status(500).json({ error: 'Failed to register webhook' });
  }
};