import { Schema, model } from 'mongoose';

const webhookSchema = new Schema({
  url: { type: String, required: true },
  secret: { type: String, required: true },
  events: { type: [String], default: ['pdf_generated'] },
});

export const Webhook = model('Webhook', webhookSchema);