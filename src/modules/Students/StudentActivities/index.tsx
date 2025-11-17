import { useFetch } from '@/hooks/useFetch';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { Activity } from './Activity';

export const StudentActivities = () => {
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
    url: string;
  }[]>(`/activity_student`);

  useEffect(() => {
    fetchActivities({
      name: 'GET',
    });
  }, [fetchActivities]);

  return (
    <div className="max-w-[50vw] mx-auto flex flex-col gap-8 pt-8 pb-0">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-bold text-center text-lime-700/80">Painel do aluno</h1>
        <h5 className="text-xl font-bold text-center text-yellow-900/80">Atividades</h5>
      </div>
      {activitiesData?.length ? (
        <div className="grid grid-cols-3 gap-4">
          {/** a card with two buttons: one to open an external link to go to the activity, another to mark the activity as concluded if it's not concluded yet. it should have a green background if it's concluded and red background if it's not concluded. it should have a check mark if it's concluded and a clock icon if it's not concldued yet */}
          {activitiesData?.map((activity) => (
            <Activity key={activity.activity_id} activity={activity} />
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