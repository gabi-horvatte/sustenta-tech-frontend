import { useEffect, useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetch } from '@/hooks/useFetch';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { Loader2, ArrowLeft, CheckCircle, XCircle, User } from 'lucide-react';
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
  is_correct: boolean;
};

type QuizReviewData = {
  activity: Activity;
  template: ActivityTemplate;
  student_name: string;
  student_id: string;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  completed_at: string;
  answers: StudentAnswer[];
};

export const QuizReview = () => {
  const { activityId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useContext(IAMContext);
  
  const studentId = searchParams.get('studentId');
  const viewMode = searchParams.get('viewMode');
  const isReviewMode = viewMode === 'review';
  
  // If no studentId provided and user is a student, use their own ID
  const targetStudentId = studentId || (user?.role === 'STUDENT' ? user.id : null);
  
  const { data: reviewData, loading, error, fetch: fetchReviewData } = useFetch<QuizReviewData>(
    `/activity/${activityId}/review${targetStudentId ? `?studentId=${targetStudentId}` : ''}`
  );

  useEffect(() => {
    if (activityId && targetStudentId) {
      fetchReviewData({ name: 'GET' });
    }
  }, [activityId, targetStudentId, fetchReviewData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !reviewData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12 text-red-600">
          <p>Erro ao carregar revisão do quiz. Tente novamente mais tarde.</p>
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const isTeacherView = user?.role === 'TEACHER' && studentId;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-lime-700/80">{reviewData.activity.name}</h1>
          <p className="text-gray-600 mt-2">{reviewData.activity.description}</p>
          
          {isTeacherView && (
            <div className="flex items-center justify-center mt-2 text-gray-700">
              <User className="w-4 h-4 mr-2" />
              <span>Revisão de: {reviewData.student_name}</span>
            </div>
          )}
        </div>

        {/* Score Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">Resultado do Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-lime-600">{reviewData.correct_answers}</p>
                <p className="text-sm text-gray-600">Respostas Corretas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-600">{reviewData.total_questions}</p>
                <p className="text-sm text-gray-600">Total de Questões</p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${
                  reviewData.score_percentage >= 80 ? 'text-green-600' :
                  reviewData.score_percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {reviewData.score_percentage}%
                </p>
                <p className="text-sm text-gray-600">Pontuação Final</p>
              </div>
            </div>
            <div className="text-center mt-4 text-sm text-gray-500">
              Concluído em: {new Date(reviewData.completed_at).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Questions Review */}
      <div className="space-y-6">
        {reviewData.template.questions
          .sort((a, b) => a.question_order - b.question_order)
          .map((question, index) => {
            const studentAnswer = reviewData.answers.find(a => a.question_id === question.id);
            const selectedOption = question.options.find(o => o.id === studentAnswer?.selected_option_id);
            const correctOption = question.options.find(o => o.is_correct);
            const isCorrect = studentAnswer?.is_correct || false;

            return (
              <Card key={question.id} className={`border-2 ${
                isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">
                      Questão {index + 1}: {question.question_text}
                    </CardTitle>
                    <div className="flex items-center">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {question.options
                      .sort((a, b) => a.option_order - b.option_order)
                      .map((option) => {
                        const isSelected = option.id === studentAnswer?.selected_option_id;
                        const isCorrectOption = option.is_correct;
                        
                        let optionStyle = 'border-gray-200 bg-white';
                        let textStyle = 'text-gray-700';
                        let iconElement = null;

                        if (isSelected && isCorrectOption) {
                          // Selected and correct
                          optionStyle = 'border-green-500 bg-green-100';
                          textStyle = 'text-green-800 font-medium';
                          iconElement = <CheckCircle className="w-4 h-4 text-green-600" />;
                        } else if (isSelected && !isCorrectOption) {
                          // Selected but wrong
                          optionStyle = 'border-red-500 bg-red-100';
                          textStyle = 'text-red-800 font-medium';
                          iconElement = <XCircle className="w-4 h-4 text-red-600" />;
                        } else if (!isSelected && isCorrectOption) {
                          // Not selected but correct answer
                          optionStyle = 'border-green-300 bg-green-50';
                          textStyle = 'text-green-700';
                          iconElement = <CheckCircle className="w-4 h-4 text-green-500" />;
                        }

                        return (
                          <div
                            key={option.id}
                            className={`p-3 border-2 rounded-lg flex items-center justify-between ${optionStyle}`}
                          >
                            <span className={textStyle}>
                              {option.option_text}
                            </span>
                            <div className="flex items-center space-x-2">
                              {isSelected && (
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                  Sua resposta
                                </span>
                              )}
                              {isCorrectOption && !isSelected && (
                                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                  Resposta correta
                                </span>
                              )}
                              {iconElement}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  
                  {/* Question Result Summary */}
                  <div className="mt-4 p-3 rounded-lg bg-gray-50">
                    <div className="text-sm">
                      <p><strong>Sua resposta:</strong> {selectedOption?.option_text || 'Não respondida'}</p>
                      <p><strong>Resposta correta:</strong> {correctOption?.option_text}</p>
                      <p className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        <strong>Resultado:</strong> {isCorrect ? 'Correto' : 'Incorreto'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>
    </div>
  );
};
