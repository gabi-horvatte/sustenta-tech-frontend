import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { addStudentFormSchema, type AddStudentFormSchema } from './const';
import { Loader2 } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { toast } from 'sonner';


type AddStudentModalProps = {
  classroomId: string | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
}

export const AddStudentModal = ({ classroomId, open, setOpen, onSuccess }: AddStudentModalProps) => {
  const { fetch, error: hasAddStudentError, loading: isAddStudentLoading } = useFetch('/student');

  const form = useForm<AddStudentFormSchema>({
    resolver: zodResolver(addStudentFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      last_name: '',
      birth_date: '',
      code: '',
      phone: '',
      email: '',
      password: '',
      classroom_id: classroomId ?? '',
    },
  });

  const isDisabled = useMemo(() => {
    const hasErrors = Object.keys(form.formState.errors).length > 0;
    return isAddStudentLoading || form.formState.isSubmitting || hasErrors || !form.formState.isValid;
  }, [isAddStudentLoading, form.formState.isSubmitting, form.formState.isValid, form.formState.errors]);

  
  const onSubmit = async (data: AddStudentFormSchema) => {
    try {
      console.log('data',data);
      await fetch({
        name: 'POST',
        body: data,
      });
      setOpen(false);
      toast.success('Aluno cadastrado com sucesso');
      form.reset();
      // Trigger refetch of classrooms list
      onSuccess?.();
    } catch (error) {
      toast.error('Erro ao cadastrar aluno');
      console.log(error);
    }
  };

  useEffect(() => {
    if (open && classroomId) {
      form.setValue('classroom_id', classroomId);
    }
  }, [open, classroomId, form]);

  // useEffect(() => {
  //   if (open) {
  //     form.trigger().then(() => {
  //       console.log('Validation triggered, isValid:', form.formState.isValid);
  //     });
  //   } else {
  //     form.reset();
  //   }
  // }, [open, form]);

  useEffect(() => {
    if (hasAddStudentError) {
      console.log(hasAddStudentError);
    }
  }, [hasAddStudentError, form]);

  return (
    <Modal
        title="Cadastrar aluno"
        open={open}
        onClose={() => setOpen(false)}
        className="max-h-[90vh] overflow-hidden flex flex-col"
        centerTitle={true}
      >
        <div className="flex-1 overflow-y-auto">
          <form id="add-student-form" onSubmit={form.handleSubmit(onSubmit)} onFocus={() => form.clearErrors()} className="flex flex-col gap-4 pr-2">
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
          </form>
        </div>
        <Button
          type="submit"
          form="add-student-form"
          className="bg-lime-800 text-white hover:bg-lime-800/90 w-full cursor-pointer mt-4"
          disabled={isDisabled}>
          {isAddStudentLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cadastrar'}
        </Button>
      </Modal>
  )
}