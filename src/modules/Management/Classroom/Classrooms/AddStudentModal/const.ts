import { z } from 'zod';

export const addStudentFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  last_name: z.string().min(1, 'Sobrenome é obrigatório'),
  birth_date: z.string(),
  code: z.string().min(1, 'Código é obrigatório'),
  classroom_id: z.string().min(1, 'Classe é obrigatória'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export type AddStudentFormSchema = z.infer<typeof addStudentFormSchema>;