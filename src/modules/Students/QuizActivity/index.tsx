import { useEffect, useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetch } from '@/hooks/useFetch';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Loader2, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { IAMContext } from '@/modules/IAM/context/context';

type QuestionOption = {
  id: string;
  option_text: string;
  option_order: number;
  is_correct: boolean;
};

type Question = {
  id: string;
  question_text: string;
  question_order: number;
  options: QuestionOption[];
};

type ActivityTemplate = {
  id: string;
  name: string;
  description: string;
  questions: Question[];
};

type Activity = {
  id: string;
  name: string;
  description: string;
  expires_at: string;
  activity_template_id: string;
};

type StudentAnswer = {
  question_id: string;
  selected_option_id: string;
};

type QuizResult = {
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  answers: {
    question_id: string;
    selected_option_id: string;
    is_correct: boolean;
  }[];
};

export const QuizActivity = () => {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(IAMContext);
  
  const [activity, setActivity] = useState<Activity | null>(null);
  const [template, setTemplate] = useState<ActivityTemplate | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const { data: activityData, loading: activityLoading, fetch: fetchActivity } = useFetch<Activity>(`/activity/${activityId}`);
  const [templateFetchUrl, setTemplateFetchUrl] = useState<string>('');
  const { data: templateData, loading: templateLoading, fetch: fetchTemplate } = useFetch<ActivityTemplate>(templateFetchUrl);
  const { data: submitData, fetch: submitAnswers, loading: submitting } = useFetch<QuizResult>(`/activity/${activityId}/submit-answers`);

  useEffect(() => {
    if (activityId) {
      fetchActivity({ name: 'GET' });
    }
  }, [activityId, fetchActivity]);

  useEffect(() => {
    if (activityData) {
      setActivity(activityData);
    }
  }, [activityData]);

  // Separate effect to fetch template when activity is loaded
  useEffect(() => {
    if (activity?.activity_template_id) {
      setTemplateFetchUrl(`/activity-template/${activity.activity_template_id}`);
    }
  }, [activity?.activity_template_id]);

  useEffect(() => {
    if (templateFetchUrl) {
      fetchTemplate({ name: 'GET' });
    }
  }, [templateFetchUrl, fetchTemplate]);

  useEffect(() => {
    if (templateData) {
      setTemplate(templateData);
    }
  }, [templateData]);

  useEffect(() => {
    if (submitData) {
      setResult(submitData);
      setIsSubmitted(true);
      toast.success('Quiz enviado com sucesso!');
    }
  }, [submitData]);

  const currentQuestion = template?.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === (template?.questions.length || 0) - 1;

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (!selectedOption) {
      toast.error('Por favor, selecione uma resposta');
      return;
    }

    // Save the answer
    const newAnswer: StudentAnswer = {
      question_id: currentQuestion!.id,
      selected_option_id: selectedOption,
    };

    const updatedAnswers = [...answers];
    const existingAnswerIndex = updatedAnswers.findIndex(a => a.question_id === currentQuestion!.id);
    
    if (existingAnswerIndex >= 0) {
      updatedAnswers[existingAnswerIndex] = newAnswer;
    } else {
      updatedAnswers.push(newAnswer);
    }
    
    setAnswers(updatedAnswers);
    setSelectedOption('');

    if (isLastQuestion) {
      // Submit all answers
      handleSubmitQuiz(updatedAnswers);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Load previous answer if exists
      const previousAnswer = answers.find(a => a.question_id === template!.questions[currentQuestionIndex - 1].id);
      setSelectedOption(previousAnswer?.selected_option_id || '');
    }
  };

  const handleSubmitQuiz = async (finalAnswers: StudentAnswer[]) => {
    try {
      if (!user?.id) {
        toast.error('Usuário não encontrado. Faça login novamente.');
        return;
      }

      await submitAnswers({
        name: 'POST',
        body: {
          student_id: user.id,
          answers: finalAnswers,
        },
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Falha ao enviar quiz. Tente novamente.');
    }
  };

  if (activityLoading || templateLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!activity || !template) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-red-600">Atividade não encontrada ou nenhuma questão disponível</p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-gray-100 rounded text-left text-sm">
              <p><strong>Debug Info:</strong></p>
              <p>Activity ID: {activityId}</p>
              <p>Activity loaded: {activity ? 'Yes' : 'No'}</p>
              <p>Template loaded: {template ? 'Yes' : 'No'}</p>
              {activity && <p>Template ID: {activity.activity_template_id}</p>}
            </div>
          )}
          <Button onClick={() => navigate('/student/activities')} className="mt-4">
            Voltar às Atividades
          </Button>
        </div>
      </div>
    );
  }

  // Check if activity has expired
  const isExpired = new Date(activity.expires_at) < new Date();
  if (isExpired && !isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center py-12">
          <Clock className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 text-lg">Esta atividade expirou</p>
          <p className="text-gray-600">Expirou em: {new Date(activity.expires_at).toLocaleString()}</p>
          <Button onClick={() => navigate('/student/activities')} className="mt-4">
            Voltar às Atividades
          </Button>
        </div>
      </div>
    );
  }

  if (isSubmitted && result) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <CardTitle className="text-2xl text-green-800">Quiz Concluído!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl font-bold text-green-600">
              {result.score_percentage}%
            </div>
            <p className="text-lg">
              Você acertou {result.correct_answers} de {result.total_questions} questões
            </p>
            
            <div className="mt-6 space-y-2">
              <h3 className="font-semibold text-lg">Resumo dos Resultados:</h3>
              {result.answers.map((answer, index) => {
                const question = template.questions.find(q => q.id === answer.question_id);
                const selectedOption = question?.options.find(o => o.id === answer.selected_option_id);
                
                return (
                  <div key={answer.question_id} className="text-left p-3 bg-white rounded border">
                    <p className="font-medium">Questão {index + 1}: {question?.question_text}</p>
                    <p className={`text-sm ${answer.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                      Sua resposta: {selectedOption?.option_text} 
                      {answer.is_correct ? ' ✓' : ' ✗'}
                    </p>
                  </div>
                );
              })}
            </div>

            <Button onClick={() => navigate('/student/activities')} className="mt-6">
              Voltar às Atividades
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/student/activities')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar às Atividades
        </Button>
        <h1 className="text-3xl font-bold text-lime-700/80">{activity.name}</h1>
        <p className="text-gray-600 mt-2">{activity.description}</p>
        <p className="text-sm text-gray-500">
          Expira: {new Date(activity.expires_at).toLocaleString()}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              Questão {currentQuestionIndex + 1} de {template.questions.length}
            </CardTitle>
            <div className="text-sm text-gray-500">
              Progresso: {Math.round((answers.length / template.questions.length) * 100)}%
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-lime-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(answers.length / template.questions.length) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">{currentQuestion?.question_text}</h3>
            
            <div className="space-y-3">
              {currentQuestion?.options
                .sort((a, b) => a.option_order - b.option_order)
                .map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedOption === option.id
                        ? 'border-lime-500 bg-lime-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="question-option"
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={() => handleOptionSelect(option.id)}
                      className="w-4 h-4 text-lime-600"
                    />
                    <span className="ml-3 text-sm">{option.option_text}</span>
                  </label>
                ))}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Anterior
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!selectedOption || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : isLastQuestion ? (
                'Enviar Quiz'
              ) : (
                'Próxima Questão'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
