import { useEffect, useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFetch } from '@/hooks/useFetch';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { IAMContext } from '@/modules/IAM/context/context';

type Classroom = {
  id: string;
  name: string;
  description: string;
};

type ActivityTemplate = {
  id: string;
  name: string;
  description: string;
  questions: {
    id: string;
    question_text: string;
    options: {
      id: string;
      option_text: string;
      is_correct: boolean;
    }[];
  }[];
};

export const AssignActivity = () => {
  const navigate = useNavigate();
  const { user } = useContext(IAMContext);
  const { templateId } = useParams();
  const [searchParams] = useSearchParams();
  const templateName = searchParams.get('name') || '';

  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [activityName, setActivityName] = useState(templateName);
  const [activityDescription, setActivityDescription] = useState('');
  const [expiresAt, setExpiresAt] = useState<Date>();

  const { data: classrooms, loading: classroomsLoading, fetch: fetchClassrooms } = useFetch<Classroom[]>('/classroom');
  const { data: template, loading: templateLoading, fetch: fetchTemplate } = useFetch<ActivityTemplate>(`/activity-template/${templateId}`);
  const { fetch: createActivity, loading: creating } = useFetch('/activity');

  useEffect(() => {
    fetchClassrooms({ name: 'GET' });
    if (templateId) {
      fetchTemplate({ name: 'GET' });
    }
  }, [fetchClassrooms, fetchTemplate, templateId]);

  useEffect(() => {
    if (template) {
      setActivityDescription(template.description);
    }
  }, [template]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClassroom) {
      toast.error('Por favor, selecione uma turma');
      return;
    }

    if (!activityName.trim()) {
      toast.error('Nome da atividade é obrigatório');
      return;
    }

    if (!activityDescription.trim()) {
      toast.error('Descrição da atividade é obrigatória');
      return;
    }

    if (!expiresAt) {
      toast.error('Data de expiração é obrigatória');
      return;
    }

    if (expiresAt <= new Date()) {
      toast.error('Data de expiração deve ser no futuro');
      return;
    }

    try {
      if (!user?.id) {
        toast.error('Usuário não encontrado. Faça login novamente.');
        return;
      }

      await createActivity({
        name: 'POST',
        body: {
          name: activityName.trim(),
          description: activityDescription.trim(),
          classroom_id: selectedClassroom,
          teacher_id: user.id,
          expires_at: expiresAt.toISOString(),
          activity_template_id: templateId,
        },
      });

      toast.success('Atividade atribuída com sucesso!');
      navigate('/management/activities');
    } catch (error) {
      console.error('Error assigning activity:', error);
      toast.error('Falha ao atribuir atividade. Tente novamente.');
    }
  };

  if (templateLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-red-600">Modelo não encontrado</p>
          <Button onClick={() => navigate('/management/activities')} className="cursor-pointer mt-4">
            Voltar aos Modelos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/management/activities')}
          className="mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar aos Modelos
        </Button>
        <h1 className="text-3xl font-bold text-lime-700/80">Atribuir Atividade</h1>
        <p className="text-gray-600 mt-2">
          Atribuir "{template.name}" a uma turma
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Visualização do Modelo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-semibold">{template.name}</h3>
              <p className="text-gray-600">{template.description}</p>
              <p className="text-sm text-gray-500">
                {template.questions.length} {template.questions.length === 1 ? 'questão' : 'questões'}
              </p>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Atribuição</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="classroom">Turma</Label>
                <Select value={selectedClassroom} onValueChange={setSelectedClassroom}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione uma turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {classroomsLoading ? (
                      <SelectItem value="" disabled>Carregando turmas...</SelectItem>
                    ) : classrooms?.map((classroom) => (
                      <SelectItem key={classroom.id} value={classroom.id}>
                        {classroom.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="activityName">Nome da Atividade</Label>
                <Input
                  id="activityName"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  placeholder="Digite o nome da atividade..."
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="activityDescription">Descrição</Label>
                <Input
                  id="activityDescription"
                  value={activityDescription}
                  onChange={(e) => setActivityDescription(e.target.value)}
                  placeholder="Digite a descrição da atividade..."
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="expiresAt">Data e Hora de Expiração</Label>
                <DateTimePicker
                  date={expiresAt}
                  onDateChange={setExpiresAt}
                  min={new Date()}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/management/activity-templates')}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={creating} className="cursor-pointer">
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Atribuindo...
                </>
              ) : (
                'Atribuir Atividade'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
