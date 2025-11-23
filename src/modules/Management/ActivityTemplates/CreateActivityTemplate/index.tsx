import { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionBuilder, type Question } from '@/components/QuestionBuilder';
import { useFetch } from '@/hooks/useFetch';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import { IAMContext } from '@/modules/IAM/context/context';

export const CreateActivityTemplate = () => {
  const navigate = useNavigate();
  const { user } = useContext(IAMContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const { fetch: createTemplate, loading: creating } = useFetch('/activity-template');

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
        toast.error(`Questão ${question.question_order} deve ter uma resposta correta selecionada`);
        return;
      }

      for (const option of question.options) {
        if (!option.option_text.trim()) {
          toast.error(`Todas as opções da questão ${question.question_order} devem ter texto`);
          return;
        }
      }
    }

    try {
      if (!user?.id) {
        toast.error('User not found. Please log in again.');
        return;
      }

      await createTemplate({
        name: 'POST',
        body: {
          name: name.trim(),
          description: description.trim(),
          created_by: user.id,
          questions,
        },
      });

      toast.success('Modelo de atividade criado com sucesso!');
      navigate('/management/activity-templates');
    } catch (error) {
      console.error('Error creating activity template:', error);
      toast.error('Falha ao criar modelo de atividade. Tente novamente.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-lime-700/80">Criar Modelo de Atividade</h1>
        <p className="text-gray-600 mt-2">
          Crie uma atividade de quiz reutilizável que pode ser atribuída a qualquer turma
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
            onClick={() => navigate('/management/activity-templates')}
            className="cursor-pointer"
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={creating} className="cursor-pointer">
            {creating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar Modelo de Atividade'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
