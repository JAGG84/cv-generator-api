import { Schema, model } from 'mongoose';

const WebhookAttemptSchema = new Schema({
  webhookId: { type: Schema.Types.ObjectId, ref: 'Webhook', required: true },
  jobId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  response: { type: String },
  attemptCount: { type: Number, default: 0 },
  lastAttemptAt: { type: Date }
}, { timestamps: true });

export const WebhookAttempt = model('WebhookAttempt', WebhookAttemptSchema);