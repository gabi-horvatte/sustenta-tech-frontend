import classroomImage from '@/assets/images/classroom-children.jpeg?format=webp';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFetch } from '@/hooks/useFetch';
import { useContext, useEffect, useState } from 'react';
import { CreateActivityButton } from './CreateActivityButton';
import { useNavigate } from 'react-router';
import { Loader2, Trash2 } from 'lucide-react';
import { IAMContext } from '@/modules/IAM/context/context';

export const Activities = () => {
  const navigate = useNavigate();
  const { user } = useContext(IAMContext);
  const {
    data: activitiesData,
    error: activitiesError,
    loading: activitiesLoading,
    fetch: fetchActivities
  } = useFetch<{
    created_at: string;
    description: string;
    classroom_id: string;
    id: string;
    name: string;
    updated_at: string;
    teacher_name: string;
  }[]>('/activity');

  const { data: classroomsData, error: classroomsError, fetch: fetchClassrooms } = useFetch<{
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  }[]>('/classroom');

  const { fetch: deleteActivity, loading: deletingActivity } = useFetch('/activity');

  const [mappedActivitiesData, setMappedActivitiesData] = useState<{
    created_at: string;
    description: string;
    classroom_id: string;
    id: string;
    name: string;
    updated_at: string;
    classroom_name: string;
    teacher_name: string;
  }[]>([]);

  useEffect(() => {
    setMappedActivitiesData(activitiesData?.map((activity) => ({
      id: activity.id,
      name: activity.name,
      description: activity.description,
      classroom_id: activity.classroom_id,
      classroom_name: classroomsData?.find((classroom) => classroom.id === activity.classroom_id)?.name ?? '',
      created_at: activity.created_at,
      updated_at: activity.updated_at,
      teacher_name: activity.teacher_name,
    })) ?? []);
  }, [activitiesData, classroomsData]);

  useEffect(() => {
    fetchActivities({
      name: 'GET',
    });
  }, [fetchActivities]);

  useEffect(() => {
    fetchClassrooms({
      name: 'GET',
    });
  }, [fetchClassrooms]);

  const handleDeleteActivity = async (activityId: string, activityName: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir a atividade "${activityName}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await deleteActivity({
        name: 'DELETE',
        id: activityId,
      });

      // Refresh the activities list
      fetchActivities({ name: 'GET' });
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Erro ao excluir atividade. Tente novamente.');
    }
  };

  return (
    <div className="max-w-[40vw] mx-auto flex flex-col gap-4 pt-8 pb-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-bold text-center text-lime-700/80">{user?.role === 'TEACHER' && user.manager ? 'Painel administrativo' : 'Painel do professor'}</h1>
          <h5 className="text-xl font-bold text-center text-yellow-900/80">Atividades</h5>
        </div>
        <Card className="p-0 overflow-hidden max-h-[50vh]">
          <img
            src={classroomImage}
            alt="Atividades"
            className="w-full h-full object-cover object-center"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            width={1920}
            height={1080}
          />
        </Card>
        {classroomsError ? (
          <div className="flex justify-center items-center">
            <p className="text-center text-gray-500">Erro ao carregar turmas. Tente novamente mais tarde.</p>
          </div>
        ) : (
          <CreateActivityButton classroomsData={classroomsData ?? []} refetchActivities={() => fetchActivities({ name: 'GET' })} />
        )}

      </div>
      {(activitiesData?.length ?? 0) > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {mappedActivitiesData?.map((activity) => (
            <Card
              key={activity.id}
              className="bg-lime-700/50 flex flex-col p-0 m-0 cursor-pointer hover:bg-lime-700/60 transition-all duration-150"
              onClick={() => navigate(`/management/activities/activity/${activity.id}?name=${activity.name}&description=${activity.description}&classroom_name=${activity.classroom_name}`)}

            >
              <CardHeader className="flex flex-col gap-1 items-center">
                <CardTitle className="text-lg font-bold text-white text-center">
                  <h5 className="text-lg font-bold text-white text-center">{activity.name}</h5>
                  <p
                    className="text-sm text-white text-center"
                  >Turma: {activity.classroom_name}
                  </p>
                </CardTitle>
                <CardDescription className="text-white text-center">
                  <p>Professor: {activity.teacher_name}</p>
                  <p>{activity.description}</p>
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-2 m-0 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteActivity(activity.id, activity.name);
                  }}
                  disabled={deletingActivity}
                  className="text-red-600 border-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Excluir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) :
        activitiesLoading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) :
          activitiesError ? (
            <div className="flex justify-center items-center">
              <p className="text-center text-gray-500">Erro ao carregar atividades. Tente novamente mais tarde.</p>
            </div>
          ) : (
            <div>
              <p className="text-center text-gray-500">Você ainda não possui nenhuma atividade.</p>
            </div>
          )}
    </div>
  )
}
