import { Modal } from '@/components/modal';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { createClassroomFormSchema, type CreateClassroomFormSchema } from './dto';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { toast } from 'sonner';

export const CreateClassroomButton = () => {
  const [open, setOpen] = useState(false);
  const { fetch, loading: isCreateClassroomLoading } = useFetch('/classroom');
  const form = useForm<CreateClassroomFormSchema>({
    resolver: zodResolver(createClassroomFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleCreateClassroomButtonClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  }

  const onSubmit = async () => {
    try {
      await fetch({
        name: 'POST',
        body: form.getValues(),
      });
      setOpen(false);
      toast.success('Turma criada com sucesso');
      form.reset();
    } catch (error) {
      console.log(error);
      toast.error('Erro ao criar turma. Tente novamente mais tarde.');
    }
  }

  return (
    <>
    <h4 
      className="text-center font-bold text-blue-700/80 cursor-pointer hover:text-blue-700/90 underline"
      onClick={handleCreateClassroomButtonClick}
    >
      Crie uma nova turma agora!
    </h4>
    <Modal 
      title="Criar turma"
      open={open}
      onClose={() => setOpen(false)}
    >
      <form id="create-classroom-form" onSubmit={form.handleSubmit(onSubmit)} onFocus={() => form.clearErrors()} className="flex flex-col gap-4">
      <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor="create-classroom-name-input">
                    Nome
                  </FieldLabel>
                  <Input
                    {...field}
                    id="create-classroom-name-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite o nome da turma"
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
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor="create-classroom-description-input">
                    Descrição
                  </FieldLabel>
                  <Input
                    {...field}
                    id="create-classroom-description-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite a descrição da turma"
                    autoComplete="off"
                    type="text"
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
            form="create-classroom-form" 
            className="bg-lime-800 text-white hover:bg-lime-800/90 w-full cursor-pointer" 
            disabled={isCreateClassroomLoading || form.formState.isSubmitting || !form.formState.isValid}>
            {isCreateClassroomLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar'}
          </Button>
      </form>
    </Modal>
    </>
  )
}