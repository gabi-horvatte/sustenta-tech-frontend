import { z } from 'zod';

export const addTeacherFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  last_name: z.string().min(1, 'Sobrenome é obrigatório'),
  manager: z.boolean(),
  birth_date: z.string(),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.email('Email inválido'),
  password: z.string('Senha é obrigatória'),
});

export type AddTeacherFormSchema = z.infer<typeof addTeacherFormSchema>;