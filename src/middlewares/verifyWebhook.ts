import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export const verifyWebhook = (req: Request, res: Response, next: NextFunction) => {
  const signature = req.headers['x-signature'] as string;
  const secret = process.env.WEBHOOK_SECRET!;

  if (!signature) {
    return res.status(401).json({ error: 'Missing signature' });
  }

  const hmac = crypto.createHmac('sha256', secret);
  const digest = `sha256=${hmac.update(JSON.stringify(req.body)).digest('hex')}`;

  if (signature !== digest) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  next();
};