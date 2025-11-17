import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetch } from '@/hooks/useFetch';
import { formatDateString } from '@/utils';
import { CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

export const StudentActivities = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { 
    data: activitiesData,
    // error: activitiesError,
    loading: activitiesLoading,
    fetch: fetchActivities
  } = useFetch<{
    activity_id: string;
    student_id: string;
    description: string;
    completed_at: string | null;
    activity_name: string;
    expires_at: string;
    activity_template_id: string;
    total_questions: number;
    correct_answers: number;
    score_percentage: number;
  }[]>(`/activity_student_with_scores?student_id=${studentId}`);

  useEffect(() => {
    fetchActivities({
      name: 'GET',
    });
  }, [fetchActivities]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold text-yellow-900/80 text-center">Atividades</h2>
      {activitiesData?.length ? (
        <div className="grid grid-cols-3 gap-4">
          {/** a card with two buttons: one to open an external link to go to the activity, another to mark the activity as concluded if it's not concluded yet. it should have a green background if it's concluded and red background if it's not concluded. it should have a check mark if it's concluded and a clock icon if it's not concldued yet */}
          {activitiesData?.map((activity) => (
            <Card 
              key={activity.activity_id} 
              className={`cursor-pointer hover:shadow-lg transition-shadow ${activity.completed_at ? 'bg-lime-300/32' : 'border-3'}`}
              onClick={() => navigate(`/management/activities/activity/${activity.activity_id}?name=${encodeURIComponent(activity.activity_name)}&description=${encodeURIComponent(activity.description)}`)}
            >
              <CardHeader>
                <div className="flex flex-row gap-2 items-center justify-center">
                <CardTitle className="text-center">
                  {activity.activity_name}
                </CardTitle>
                {activity.completed_at ? <CheckCircle className="w-4 h-4 text-lime-700/80" /> : <Clock className="w-4 h-4 text-red-700/80" />}
                </div>
                <CardDescription>
                  <p>Data de expiração: {formatDateString(activity.expires_at)}</p>
                  <p>Data de conclusão: {activity.completed_at ? formatDateString(activity.completed_at) : 'Não concluído'}</p>
                  {activity.total_questions > 0 && (
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm font-medium">Pontuação:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.score_percentage >= 80 
                          ? 'bg-green-100 text-green-800' 
                          : activity.score_percentage >= 60 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {activity.correct_answers}/{activity.total_questions} ({activity.score_percentage}%)
                      </span>
                    </div>
                  )}
                  <p>
                    Descrição: {activity.description}
                  </p>
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) :
      activitiesLoading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <p className="text-center text-gray-500">Nenhuma atividade encontrada</p>
        </div>
      )
    }
    </div>
  )
}