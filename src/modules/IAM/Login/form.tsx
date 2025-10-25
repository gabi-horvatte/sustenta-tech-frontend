import * as z from 'zod';

export const loginFormSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string('Senha é obrigatória'),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;