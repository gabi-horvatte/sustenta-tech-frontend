import { useFetch } from '@/hooks/useFetch';
import { formatDateTimeString } from '@/utils';
import { useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft } from 'lucide-react';

export const Activity = () => {
  const { activityId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const name = searchParams.get('name');
  const description = searchParams.get('description');
  // const classroomName = searchParams.get('classroom_name');
  // const createdAt = searchParams.get('created_at');
  // const updatedAt = searchParams.get('updated_at');
  // const expiresAt = searchParams.get('expires_at');

  const { data: activityData, loading: activityLoading, fetch: fetchActivity } = useFetch<{
    activity_id: string;
    activity_name: string;
    students: {
      student_id: string;
      student_name: string;
      completed_at: string | null;
      total_questions: number;
      correct_answers: number;
      score_percentage: number;
    }[];
  }>(`/activity/${activityId}/progress`);

  const { data: activityDetails, loading: activityDetailsLoading, fetch: fetchActivityDetails } = useFetch<{
    id: string;
    name: string;
    description: string;
    activity_template_id: string;
    classroom_id: string;
    teacher_id: string;
    expires_at: string;
  }>(`/activity/${activityId}`);

  useEffect(() => {
    fetchActivity({
      name: 'GET',
    });
    fetchActivityDetails({
      name: 'GET',
    });
  }, [fetchActivity, fetchActivityDetails]);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pt-8 pb-0 px-4">
      <div className="flex flex-col gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/management/activities')}
          className="self-start"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar às Atividades
        </Button>
        
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-bold text-center text-lime-700/80">{name}</h1>
          <h5 className="text-xl font-bold text-center text-yellow-900/80">{description}</h5>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={() => {
              if (activityDetails?.activity_template_id) {
                navigate(`/management/activity-templates/${activityDetails.activity_template_id}`);
              } else {
                console.error('Activity template ID not found');
              }
            }}
            className="bg-lime-600 hover:bg-lime-700"
            disabled={activityDetailsLoading || !activityDetails?.activity_template_id}
          >
            <FileText className="w-4 h-4 mr-2" />
            Ver Questões da Atividade
          </Button>
        </div>
      </div>
      {activityLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-700"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {activityData?.students && activityData.students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-lime-200">
                    <th className="text-left text-lime-700/80 py-3 px-2">Aluno</th>
                    <th className="text-center text-lime-700/80 py-3 px-2">Pontuação</th>
                    <th className="text-center text-lime-700/80 py-3 px-2">Respostas Corretas</th>
                    <th className="text-right text-lime-700/80 py-3 px-2">Concluído em</th>
                  </tr>
                </thead>
                <tbody>
                  {activityData.students.map((student) => (
                    <tr 
                      key={student.student_id} 
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        console.log('Row clicked:', {
                          studentId: student.student_id,
                          completedAt: student.completed_at,
                          activityId
                        });
                        
                        if (student.completed_at) {
                          // Navigate to quiz review if completed (using management route)
                          const reviewUrl = `/management/student/quiz/${activityId}/review?studentId=${student.student_id}&viewMode=review`;
                          console.log('Navigating to review:', reviewUrl);
                          navigate(reviewUrl);
                        } else {
                          // Navigate to student profile if not completed
                          const profileUrl = `/management/classroom/student/${student.student_id}`;
                          console.log('Navigating to profile:', profileUrl);
                          navigate(profileUrl);
                        }
                      }}
                    >
                      <td className="text-left text-yellow-900/80 py-3 px-2 font-medium">
                        <span 
                          className="underline font-bold hover:text-lime-700 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            navigate(`/management/classroom/student/${student.student_id}`);
                          }}
                        >
                          {student.student_name}
                        </span>
                      </td>
                      <td className="text-center py-3 px-2">
                        {student.completed_at ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            student.score_percentage >= 80 
                              ? 'bg-green-100 text-green-800' 
                              : student.score_percentage >= 60 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {student.score_percentage}%
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="text-center text-yellow-900/80 py-3 px-2">
                        {student.completed_at ? (
                          `${student.correct_answers}/${student.total_questions}`
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="text-right text-yellow-900/80 py-3 px-2 text-sm">
                        {student.completed_at ? formatDateTimeString(student.completed_at) : (
                          <span className="text-gray-400">Não concluído</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum aluno encontrado para esta atividade.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}