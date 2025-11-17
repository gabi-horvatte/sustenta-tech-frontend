import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetch } from '@/hooks/useFetch';
import { useNavigate, useParams } from 'react-router';
import { Loader2, ArrowLeft, Users } from 'lucide-react';

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

export const ViewActivityTemplate = () => {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const [template, setTemplate] = useState<ActivityTemplate | null>(null);

  const { data: templateData, loading: templateLoading, fetch: fetchTemplate } = useFetch<ActivityTemplate>(`/activity-template/${templateId}`);

  useEffect(() => {
    if (templateId) {
      fetchTemplate({ name: 'GET' });
    }
  }, [templateId, fetchTemplate]);

  useEffect(() => {
    if (templateData) {
      setTemplate(templateData);
    }
  }, [templateData]);

  if (templateLoading) {
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
          <Button onClick={() => navigate('/management/activity-templates')} className="mt-4">
            Back to Templates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/management/activity-templates')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Templates
        </Button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-lime-700/80">{template.name}</h1>
            <p className="text-gray-600 mt-2">{template.description}</p>
            <p className="text-sm text-gray-500 mt-1">
              Created: {new Date(template.created_at).toLocaleDateString()}
            </p>
          </div>
          <Button
            onClick={() => navigate(`/management/activity-templates/${template.id}/assign?name=${encodeURIComponent(template.name)}`)}
            className="bg-lime-600 hover:bg-lime-700"
          >
            <Users className="w-4 h-4 mr-2" />
            Assign to Classroom
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Questions ({template.questions.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {template.questions
              .sort((a, b) => a.question_order - b.question_order)
              .map((question) => (
                <Card key={question.id} className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Question {question.question_order}: {question.question_text}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Answer Options:</p>
                      {question.options
                        .sort((a, b) => a.option_order - b.option_order)
                        .map((option) => (
                          <div
                            key={option.id}
                            className={`flex items-center p-2 rounded border ${
                              option.is_correct
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full border-2 mr-3 ${
                                option.is_correct
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-gray-300'
                              }`}
                            />
                            <span className={option.is_correct ? 'font-medium text-green-800' : ''}>
                              {option.option_text}
                            </span>
                            {option.is_correct && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                Correct Answer
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
