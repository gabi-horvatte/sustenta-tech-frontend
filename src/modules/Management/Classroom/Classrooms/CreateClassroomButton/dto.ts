import { z } from 'zod';

export const createClassroomFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
});

export type CreateClassroomFormSchema = z.infer<typeof createClassroomFormSchema>;