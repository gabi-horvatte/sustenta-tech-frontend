import { useState, useEffect } from 'react';
import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { Textarea } from '@/components/ui/textarea';
import { useFetch } from '@/hooks/useFetch';
import { Loader2, BookOpen, Calendar } from 'lucide-react';
import { toast } from 'sonner';

type ActivityTemplate = {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  question_count: number;
};

type AssignActivityModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  classroomId: string | null;
  classroomName: string | null;
  onSuccess?: () => void;
};

export const AssignActivityModal = ({
  open,
  setOpen,
  classroomId,
  classroomName,
  onSuccess,
}: AssignActivityModalProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ActivityTemplate | null>(null);
  const [activityName, setActivityName] = useState('');
  const [activityDescription, setActivityDescription] = useState('');
  const [expiresAt, setExpiresAt] = useState<Date>();

  const { data: templates, loading: templatesLoading, fetch: fetchTemplates } = useFetch<ActivityTemplate[]>('/activity-template');
  const { fetch: createActivity, loading: createLoading } = useFetch('/activity');

  useEffect(() => {
    if (open) {
      fetchTemplates({ name: 'GET' });
    }
  }, [open, fetchTemplates]);

  useEffect(() => {
    if (selectedTemplate) {
      setActivityName(selectedTemplate.name);
      setActivityDescription(selectedTemplate.description);
    }
  }, [selectedTemplate]);

  const handleSubmit = async () => {
    if (!selectedTemplate || !classroomId || !activityName || !activityDescription || !expiresAt) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      await createActivity({
        name: 'POST',
        body: {
          name: activityName,
          description: activityDescription,
          classroom_id: classroomId,
          activity_template_id: selectedTemplate.id,
          expires_at: expiresAt.toISOString(),
        },
      });

      toast.success('Atividade atribuída com sucesso!');
      setOpen(false);
      resetForm();
      onSuccess?.();
    } catch (error) {
      toast.error('Erro ao atribuir atividade. Tente novamente.');
      console.error('Error creating activity:', error);
    }
  };

  const resetForm = () => {
    setSelectedTemplate(null);
    setActivityName('');
    setActivityDescription('');
    setExpiresAt(undefined);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  return (
    <Modal
      title={`Atribuir Atividade - ${classroomName || 'Turma'}`}
      open={open}
      onClose={handleClose}
      className="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Template Selection */}
        <div>
          <Label className="text-base font-semibold">Selecionar Modelo de Atividade</Label>
          <p className="text-sm text-gray-600 mb-4">Escolha um modelo de atividade para atribuir à turma</p>
          
          {templatesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
              {templates?.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'border-lime-500 bg-lime-50'
                      : 'hover:border-lime-300'
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {template.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {template.question_count} questões
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {template.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Activity Details */}
        {selectedTemplate && (
          <div className="space-y-4 border-t pt-6">
            <Label className="text-base font-semibold">Detalhes da Atividade</Label>
            
            <div>
              <Label htmlFor="activity-name">Nome da Atividade *</Label>
              <Input
                id="activity-name"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                placeholder="Nome da atividade"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="activity-description">Descrição *</Label>
              <Textarea
                id="activity-description"
                value={activityDescription}
                onChange={(e) => setActivityDescription(e.target.value)}
                placeholder="Descrição da atividade"
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="expires-at">Data de Expiração *</Label>
              <DateTimePicker
                date={expiresAt}
                onDateChange={setExpiresAt}
                min={new Date()}
                className="mt-1"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 border-t pt-6">
          <Button variant="outline" onClick={handleClose} className="cursor-pointer">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedTemplate || !activityName || !activityDescription || !expiresAt || createLoading}
            className="bg-lime-600 hover:bg-lime-700 cursor-pointer"
          >
            {createLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Atribuindo...
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                Atribuir Atividade
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

