import { useEffect, useState, useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetch } from '@/hooks/useFetch';
import { useNavigate } from 'react-router';
import { Loader2, Users, Calendar, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { IAMContext } from '@/modules/IAM/context/context';

type Activity = {
  id: string;
  name: string;
  description: string;
  expires_at: string;
  created_at: string;
  classroom_id: string;
  activity_template_id: string;
};

type Classroom = {
  id: string;
  name: string;
  description: string;
};

type ActivityWithClassroom = Activity & {
  classroom_name: string;
};

export const AssignedActivities = () => {
  const navigate = useNavigate();
  const { user } = useContext(IAMContext);
  const [activitiesByClassroom, setActivitiesByClassroom] = useState<Record<string, ActivityWithClassroom[]>>({});

  const { data: activitiesData, loading: activitiesLoading, fetch: fetchActivities } = useFetch<Activity[]>('/activity');
  const { data: classroomsData, fetch: fetchClassrooms } = useFetch<Classroom[]>('/classroom');
  const { fetch: deleteActivity, loading: deletingActivity } = useFetch('/activity');

  useEffect(() => {
    if (user?.id) {
      fetchActivities({ name: 'GET' });
      fetchClassrooms({ name: 'GET' });
    }
  }, [fetchActivities, fetchClassrooms, user?.id]);

  const handleDeleteActivity = async (activityId: string, activityName: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click

    if (!window.confirm(`Tem certeza que deseja excluir a atividade "${activityName}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await deleteActivity({
        name: 'DELETE',
        id: activityId,
      });

      // Refresh the activities
      fetchActivities({ name: 'GET' });
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Erro ao excluir atividade. Tente novamente.');
    }
  };

  useEffect(() => {
    if (activitiesData && classroomsData) {
      // Group activities by classroom (API already filters by teacher)
      const grouped = activitiesData.reduce((acc, activity) => {
        const classroom = classroomsData.find(c => c.id === activity.classroom_id);
        const classroomName = classroom?.name || 'Unknown Classroom';
        
        if (!acc[activity.classroom_id]) {
          acc[activity.classroom_id] = [];
        }
        
        acc[activity.classroom_id].push({
          ...activity,
          classroom_name: classroomName,
        });
        
        return acc;
      }, {} as Record<string, ActivityWithClassroom[]>);

      setActivitiesByClassroom(grouped);
    }
  }, [activitiesData, classroomsData]);

  const handleActivityClick = (activity: ActivityWithClassroom) => {
    navigate(`/management/activities/activity/${activity.id}?name=${encodeURIComponent(activity.name)}&description=${encodeURIComponent(activity.description)}&classroom_name=${encodeURIComponent(activity.classroom_name)}`);
  };

  if (activitiesLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const classroomIds = Object.keys(activitiesByClassroom);

  if (classroomIds.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-lg">Nenhuma atividade atribuída ainda</p>
          <p className="text-sm">Crie e atribua modelos de atividade para vê-los aqui</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {classroomIds.map(classroomId => {
        const activities = activitiesByClassroom[classroomId];
        const classroomName = activities[0]?.classroom_name || 'Unknown Classroom';
        
        return (
          <div key={classroomId} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-lime-600" />
              <h2 className="text-2xl font-bold text-lime-700/80">{classroomName}</h2>
              <span className="text-sm text-gray-500">({activities.length} atividades)</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activities.map(activity => {
                const isExpired = new Date(activity.expires_at) < new Date();
                
                return (
                  <Card 
                    key={activity.id}
                    className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${
                      isExpired ? 'border-red-200 bg-red-50' : 'hover:border-lime-300'
                    }`}
                    onClick={() => handleActivityClick(activity)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-2">{activity.name}</CardTitle>
                        {isExpired ? (
                          <Clock className="w-4 h-4 text-red-500 flex-shrink-0 ml-2" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {activity.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Expira: {new Date(activity.expires_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3" />
                          <span>
                            Criado: {new Date(activity.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                            isExpired
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {isExpired ? 'Expirada' : 'Ativa'}
                          </div>
                          <button
                            onClick={(e) => handleDeleteActivity(activity.id, activity.name, e)}
                            disabled={deletingActivity}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                            title="Excluir atividade"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
