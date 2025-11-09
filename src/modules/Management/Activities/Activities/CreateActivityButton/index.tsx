import { Modal } from '@/components/modal';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useContext, useId, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { createActivityFormSchema, type CreateActivityFormSchema } from './dto';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { toast } from 'sonner';
import { IAMContext } from '@/modules/IAM/context/context';

export const CreateActivityButton = ({ classroomsData, refetchActivities }: { classroomsData: { id: string; name: string; description: string; created_at: string; updated_at: string; }[] | undefined, refetchActivities: () => void }) => {
  const [open, setOpen] = useState(false);
  const { user } = useContext(IAMContext);
  const classroomSelectId = useId();
  const { fetch, loading: isCreateActivityLoading } = useFetch('/activity');
  const form = useForm<CreateActivityFormSchema>({
    resolver: zodResolver(createActivityFormSchema),
    defaultValues: {
      name: '',
      description: '',
      classroom_id: classroomsData?.[0]?.id ?? '',
      url: '',
      expires_at: new Date(),
    },
  });
  const isDisabled = useMemo(() => !!(isCreateActivityLoading || form.formState.isSubmitting || !form.formState.isValid || Object.keys(form.formState.errors).length > 0), [isCreateActivityLoading, form.formState.isSubmitting, form.formState.isValid, form.formState.errors]);

  const handleCreateActivityButtonClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  }

  const onSubmit = async () => {
    try {
      await fetch({
        name: 'POST',
        body: {
          ...form.getValues(),
          teacher_id: user?.id ?? '',
        }
      });
      setOpen(false);
      refetchActivities();
      toast.success('Atividade criada com sucesso');
      form.reset();
    } catch (error) {
      console.log(error);
      toast.error('Erro ao criar atividade. Tente novamente mais tarde.');
    }
  }

  return (
    <>
    <h4 
      className="text-center font-bold text-blue-700/80 cursor-pointer hover:text-blue-700/90 underline"
      onClick={handleCreateActivityButtonClick}
    >
      Crie uma nova atividade agora!
    </h4>
    <Modal 
      title="Criar atividade"
      open={open}
      onClose={() => setOpen(false)}
    >
      <form id="create-activity-form" onSubmit={form.handleSubmit(onSubmit)} onFocus={() => form.clearErrors()} className="flex flex-col gap-4">
      <FieldGroup>
            <Controller
              name="classroom_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor={classroomSelectId}>
                    Turma
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id={classroomSelectId} className="w-full" aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Selecione a turma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Turmas</SelectLabel>
                        {classroomsData?.map((classroom) => (
                          <SelectItem key={classroom.id} value={classroom.id}>
                            {classroom.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor="create-activity-name-input">
                    Nome
                  </FieldLabel>
                  <Input
                    {...field}
                    id="create-activity-name-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite o nome da atividade"
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
                  <FieldLabel htmlFor="create-activity-description-input">
                    Descrição
                  </FieldLabel>
                  <Input
                    {...field}
                    id="create-activity-description-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite a descrição da atividade"
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
              name="url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor="create-activity-url-input">
                    Link
                  </FieldLabel>
                  <Input
                    {...field}
                    id="create-activity-url-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite o link da atividade"
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
              name="expires_at"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor="create-activity-expires-at-input">
                    Data de expiração
                  </FieldLabel>
                  <Input
                    {...field}
                    id="create-activity-expires-at-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite a data de expiração da atividade"
                    autoComplete="off"
                    value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                    type="date"
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
            form="create-activity-form" 
            className={`text-white w-full cursor-pointer ${isCreateActivityLoading ? 'bg-lime-700/80' : isDisabled ? 'bg-lime-700/80' : 'bg-lime-800 hover:bg-lime-800/90'}`}
            disabled={isDisabled}>
            {isCreateActivityLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar'}
          </Button>
      </form>
    </Modal>
    </>
  )
}
