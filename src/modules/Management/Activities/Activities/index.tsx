import classroomImage from '@/assets/images/classroom-children.jpeg';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetch } from '@/hooks/useFetch';
import { useEffect, useState } from 'react';
import { CreateActivityButton } from './CreateActivityButton';
import { useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';

export const Activities = () => {
  const navigate = useNavigate();
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
  }[]>('/activity');

  const { data: classroomsData, error: classroomsError, fetch: fetchClassrooms } = useFetch<{
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  }[]>('/classroom');

  const [mappedActivitiesData, setMappedActivitiesData] = useState<{
    created_at: string;
    description: string;
    classroom_id: string;
    id: string;
    name: string;
    updated_at: string;
    classroom_name: string;
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

  return (
    <div className="max-w-[40vw] mx-auto flex flex-col gap-8 pt-8 pb-0">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-bold text-center text-lime-700/80">Painel administrativo</h1>
        <h5 className="text-xl font-bold text-center text-yellow-900/80">Atividades</h5>
      </div>
      <Card className="p-0 overflow-hidden max-h-[50vh]">
        <img src={classroomImage} alt="Atividades" className="w-full h-full object-cover object-center" />
      </Card>
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
                <CardDescription className="text-white text-center">{activity.description}</CardDescription>
              </CardHeader>
              <CardFooter className="p-0 m-0">
                {/* <Button 
                className="bg-red-700/80 text-white border-none rounded-none hover:bg-red-800/100 cursor-pointer"
                onClick={() => handleRemoveActivity(activity.id)}
              >Excluir</Button> */}
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
        {classroomsError ? (
          <div className="flex justify-center items-center">
            <p className="text-center text-gray-500">Erro ao carregar turmas. Tente novamente mais tarde.</p>
          </div>
        ) : (
          <CreateActivityButton classroomsData={classroomsData ?? []} refetchActivities={() => fetchActivities({ name: 'GET' })} />
        )}
    </div>
  )
}
