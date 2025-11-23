import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionBuilder, type Question } from '@/components/QuestionBuilder';
import { useFetch } from '@/hooks/useFetch';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { Loader2 } from 'lucide-react';

type ActivityTemplate = {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  questions: {
    id: string;
    question_text: string;
    question_order: number;
    options: {
      id: string;
      option_text: string;
      option_order: number;
      is_correct: boolean;
    }[];
  }[];
};

export const EditActivityTemplate = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const { data: template, loading: loadingTemplate, fetch: fetchTemplate } = useFetch<ActivityTemplate>(`/activity-template/${id}`);
  const { fetch: updateTemplate, loading: updating } = useFetch(`/activity-template/${id}`);

  useEffect(() => {
    if (id) {
      fetchTemplate({ name: 'GET' });
    }
  }, [id, fetchTemplate]);

  useEffect(() => {
    if (template) {
      setName(template.name);
      setDescription(template.description);

      // Convert backend questions to frontend Question format
      const frontendQuestions: Question[] = template.questions.map(q => ({
        question_text: q.question_text,
        question_order: q.question_order,
        options: q.options.map(o => ({
          option_text: o.option_text,
          option_order: o.option_order,
          is_correct: o.is_correct,
        }))
      }));

      setQuestions(frontendQuestions);
    }
  }, [template]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Nome da atividade é obrigatório');
      return;
    }

    if (!description.trim()) {
      toast.error('Descrição da atividade é obrigatória');
      return;
    }

    if (questions.length === 0) {
      toast.error('Pelo menos uma questão é obrigatória');
      return;
    }

    // Validate questions
    for (const question of questions) {
      if (!question.question_text.trim()) {
        toast.error(`Texto da questão ${question.question_order} é obrigatório`);
        return;
      }

      if (question.options.length < 2) {
        toast.error(`Questão ${question.question_order} deve ter pelo menos 2 opções`);
        return;
      }

      const hasCorrectAnswer = question.options.some(option => option.is_correct);
      if (!hasCorrectAnswer) {
        toast.error(`Questão ${question.question_order} deve ter pelo menos uma resposta correta`);
        return;
      }

      const hasIncorrectAnswer = question.options.some(option => !option.is_correct);
      if (!hasIncorrectAnswer) {
        toast.error(`Questão ${question.question_order} deve ter pelo menos uma resposta incorreta`);
        return;
      }
    }

    try {
      // Convert frontend questions to backend format
      const backendQuestions = questions.map((q, index) => ({
        ...q,
        id: template?.questions[index]?.id, // Preserve existing IDs if available
        question_order: index + 1,
        options: q.options.map((o, optionIndex) => ({
          ...o,
          id: template?.questions[index]?.options[optionIndex]?.id, // Preserve existing IDs if available
          option_order: optionIndex + 1,
        }))
      }));

      await updateTemplate({
        name: 'PUT',
        body: {
          id: id,
          name: name.trim(),
          description: description.trim(),
          questions: backendQuestions,
        },
      });

      toast.success('Modelo de atividade atualizado com sucesso!');
      navigate('/management/activities');
    } catch (error) {
      console.error('Error updating activity template:', error);
      toast.error('Falha ao atualizar modelo de atividade. Tente novamente.');
    }
  };

  if (loadingTemplate) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-red-600">Template not found</p>
          <Button onClick={() => navigate('/management/activities')} className="mt-4 cursor-pointer">
            Voltar aos Modelos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-lime-700/80">Editar Modelo de Atividade</h1>
        <p className="text-gray-600 mt-2">
          Atualize as informações e questões da atividade de quiz
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Atividade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome da Atividade</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o nome da atividade..."
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Digite a descrição da atividade..."
                className="mt-1"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Questões</CardTitle>
          </CardHeader>
          <CardContent>
            <QuestionBuilder questions={questions} onChange={setQuestions} />
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/management/activities')}
            className="cursor-pointer"
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={updating} className="cursor-pointer">
            {updating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Atualizando...
              </>
            ) : (
              'Atualizar modelo de atividade'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
