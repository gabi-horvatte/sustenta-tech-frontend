import { z } from 'zod';

export const createActivityFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  classroom_id: z.string().min(1, 'Turma é obrigatória'),
  url: z.string().min(1, 'Link é obrigatório'),
  expires_at: z.date().or(z.iso.datetime()).or(z.iso.date()),
});

export type CreateActivityFormSchema = z.infer<typeof createActivityFormSchema>;
