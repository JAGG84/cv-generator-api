import { z } from 'zod';

export const GenerateCVSchema = z.object({
  name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  experience: z.array(
    z.object({
      title: z.string(),
      company: z.string(),
      period: z.string()
    })
  ).optional()
});

export const WebhookSchema = z.object({
  url: z.string().url("URL inválida"),
  events: z.array(z.string()).optional()
});

export type GenerateCVInput = z.infer<typeof GenerateCVSchema>;
export type WebhookInput = z.infer<typeof WebhookSchema>;