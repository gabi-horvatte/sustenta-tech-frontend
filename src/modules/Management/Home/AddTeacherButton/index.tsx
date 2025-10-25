import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { addTeacherFormSchema, type AddTeacherFormSchema } from './const';
import { Loader2 } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { toast } from 'sonner';

export const AddTeacherButton = () => {
  const [open, setOpen] = useState(false);

  const { fetch, error: hasAddTeacherError, loading: isAddTeacherLoading } = useFetch('/teacher');

  const handleAddTeacher = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation(); 
    setOpen(true);
  }

  const form = useForm<AddTeacherFormSchema>({
    resolver: zodResolver(addTeacherFormSchema),
    defaultValues: {
      email: '',
      password: '',
      manager: false,
    },
  });
  
  const onSubmit = async (data: AddTeacherFormSchema) => {
    try {
      await fetch({
        name: 'POST',
        body: data,
      });
      setOpen(false);
      toast.success('Professor cadastrado com sucesso');
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (hasAddTeacherError) {
      console.log(hasAddTeacherError);
    }
  }, [hasAddTeacherError, form]);

  return (
    <div>
      <div className="flex justify-center">
        <Button className="
          bg-blue-800/80
          text-white
          rounded-full
          cursor-pointer
          hover:bg-blue-800/90
          text-lg
          p-8
          "
          onClick={handleAddTeacher}
          >
          Cadastrar professor
        </Button>
      </div>
      <Modal 
        title="Cadastrar professor" 
        open={open} 
        onClose={() => setOpen(false)}
        className=""
        centerTitle={true}
      // w-full max-w-md grid row-span-full py-10
      >
        <form id="add-teacher-form" onSubmit={form.handleSubmit(onSubmit)} onFocus={() => form.clearErrors()} className="flex flex-col gap-4">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor="add-teacher-first-name-input">
                    Nome
                  </FieldLabel>
                  <Input
                    {...field}
                    id="add-teacher-first-name-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite o nome do professor"
                    autoComplete="off"
                    type="text"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="last_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor="add-teacher-last-name-input">
                    Sobrenome
                  </FieldLabel>
                  <Input
                    {...field}
                    id="add-teacher-last-name-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite o sobrenome do professor"
                    autoComplete="off"
                    type="text"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="birth_date"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor="add-teacher-birth-date-input">
                    Data de nascimento
                  </FieldLabel>
                  <Input
                    {...field}
                    id="add-teacher-birth-date-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite a data de nascimento do professor"
                    autoComplete="off"
                    type="date"
                    value={field.value}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}}
            />
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor="add-teacher-phone-input">
                    Telefone
                  </FieldLabel>
                  <Input
                    {...field}
                    id="add-teacher-phone-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite o telefone do professor"
                    autoComplete="off"
                    type="tel"
                    value={field.value}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor="add-teacher-email-input">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="add-teacher-email-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite o email do professor"
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
                <Field data-invalid={fieldState.invalid} className="gap-1">
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
          <Button 
            type="submit" 
            form="add-teacher-form" 
            className="bg-lime-800 text-white hover:bg-lime-800/90 w-full cursor-pointer" 
            disabled={isAddTeacherLoading || form.formState.isSubmitting || !form.formState.isValid}>
            {isAddTeacherLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cadastrar'}
          </Button>
        </form>
      </Modal>
    </div>
  )
}