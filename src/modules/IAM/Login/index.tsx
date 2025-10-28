import { IAMContext } from '../context/context';
import { useContext, useEffect } from 'react';
import { loginFormSchema, type LoginFormSchema } from './form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Controller } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const Login = () => {
  const { login, isLoginLoading, hasLoginError } = useContext(IAMContext);
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (data: LoginFormSchema) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao fazer login. Tente novamente mais tarde.');
    }
  };

  useEffect(() => {
    if (hasLoginError) {
      form.setError('email', { message: 'Email ou senha inválidos' });
    }
  }, [hasLoginError, form]);

  return (
    <div className="h-full flex items-center justify-center">
      <Card className="w-full sm:max-w-md mx-auto my-auto h-fit">
      <CardHeader>
        <CardTitle className="text-4xl font-bold text-center text-lime-800">Entre na sua conta</CardTitle>
        <CardDescription className="text-md text-center text-yellow-900">
          com o email e senha cadastrados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} onFocus={() => form.clearErrors()}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-email-input">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="login-email-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite seu email"
                    autoComplete="off"
                    type="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-password-input">
                    Senha
                  </FieldLabel>
                  <Input
                    {...field}
                    id="login-password-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite sua senha"
                    autoComplete="off"
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="submit" form="login-form" className="bg-lime-800 text-white hover:bg-lime-800/90 w-full cursor-pointer" disabled={isLoginLoading || form.formState.isSubmitting || !form.formState.isValid}>
            {isLoginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar'}
          </Button>
        </Field>
      </CardFooter>
    </Card>
    </div>
  )
}