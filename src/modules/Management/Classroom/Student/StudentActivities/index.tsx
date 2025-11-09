import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetch } from '@/hooks/useFetch';
import { CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useParams } from 'react-router';

export const StudentActivities = () => {
  const { studentId } = useParams();
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
  }[]>(`/activity_student?student_id=${studentId}`);

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
            <Card key={activity.activity_id} className={activity.completed_at ? 'bg-lime-300/32' : ''}>
              <CardHeader>
                <div className="flex flex-row gap-2 items-center justify-center">
                <CardTitle className="text-center">
                  {activity.activity_name}
                </CardTitle>
                {activity.completed_at ? <CheckCircle className="w-4 h-4 text-lime-700/80" /> : <Clock className="w-4 h-4 text-red-700/80" />}
                </div>
                <CardDescription>{activity.description}</CardDescription>
                
                  {/* <Button 
                    variant="outline"
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open('https://www.google.com', '_blank');
                    }}
                  >
                    <Link className="w-4 h-4" />
                    Abrir link
                    </Button>
                    <Button 
                      variant="outline"
                      className="cursor-pointer bg-lime-300/32 hover:bg-lime-300/50"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      console.log('marcar como concluído');
                    }}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Marcar como concluído
                    </Button> */}
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