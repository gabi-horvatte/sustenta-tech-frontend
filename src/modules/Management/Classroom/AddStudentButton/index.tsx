import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { addStudentFormSchema, type AddStudentFormSchema } from './const';
import { Loader2 } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { toast } from 'sonner';

type AddStudentButtonProps = {
  classroomId: string;
}

export const AddStudentButton = ({ classroomId }: AddStudentButtonProps) => {
  const [open, setOpen] = useState(false);

  const { fetch, error: hasAddStudentError, loading: isAddStudentLoading } = useFetch('/student');

  const handleAddStudent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation(); 
    setOpen(true);
  }

  const form = useForm<AddStudentFormSchema>({
    resolver: zodResolver(addStudentFormSchema),
    defaultValues: {
      email: '',
      password: '',
      classroom_id: classroomId,
    },
  });
  
  const onSubmit = async (data: AddStudentFormSchema) => {
    try {
      await fetch({
        name: 'POST',
        body: data,
      });
      setOpen(false);
      toast.success('Aluno cadastrado com sucesso');
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (hasAddStudentError) {
      console.log(hasAddStudentError);
    }
  }, [hasAddStudentError, form]);

  return (
    <>
        <Button 
          className="bg-lime-700/80 text-white border-none rounded-none hover:bg-lime-800/100 cursor-pointer w-full"      
          onClick={handleAddStudent}
        >
          + Alunos
        </Button>
      <Modal 
        title="Cadastrar aluno" 
        open={open} 
        onClose={() => setOpen(false)}
        className=""
        centerTitle={true}
      // w-full max-w-md grid row-span-full py-10
      >
        <form id="add-student-form" onSubmit={form.handleSubmit(onSubmit)} onFocus={() => form.clearErrors()} className="flex flex-col gap-4">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor="add-student-first-name-input">
                    Nome
                  </FieldLabel>
                  <Input
                    {...field}
                    id="add-student-first-name-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite o nome do aluno"
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
                  <FieldLabel htmlFor="add-student-last-name-input">
                    Sobrenome
                  </FieldLabel>
                  <Input
                    {...field}
                    id="add-student-last-name-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite o sobrenome do aluno"
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
                  <FieldLabel htmlFor="add-student-birth-date-input">
                    Data de nascimento
                  </FieldLabel>
                  <Input
                    {...field}
                    id="add-student-birth-date-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite a data de nascimento do aluno"
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
              name="code"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor="add-student-code-input">
                    Código do aluno
                  </FieldLabel>
                  <Input
                    {...field}
                    id="add-student-code-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite o código do aluno"
                    autoComplete="off"
                    type="text"
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
                  <FieldLabel htmlFor="add-student-phone-input">
                    Telefone
                  </FieldLabel>
                  <Input
                    {...field}
                    id="add-student-phone-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite o telefone do aluno"
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
                  <FieldLabel htmlFor="add-student-email-input">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="add-student-email-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite o email do aluno"
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
                  <FieldLabel htmlFor="add-student-password-input">
                    Senha
                  </FieldLabel>
                  <Input
                    {...field}
                    id="add-student-password-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite a senha do aluno"
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
            form="add-student-form" 
            className="bg-lime-800 text-white hover:bg-lime-800/90 w-full cursor-pointer" 
            disabled={isAddStudentLoading || form.formState.isSubmitting || !form.formState.isValid}>
            {isAddStudentLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cadastrar'}
          </Button>
        </form>
      </Modal>
    </>
  )
}