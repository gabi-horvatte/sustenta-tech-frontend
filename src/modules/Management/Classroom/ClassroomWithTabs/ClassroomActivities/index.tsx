import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useFetch } from '@/hooks/useFetch';
import { Loader2, BookOpen, Calendar, Clock, CheckCircle, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AssignActivityModal } from '../AssignActivityModal';

type Activity = {
  id: string;
  name: string;
  description: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  classroom_id: string;
  teacher_id: string;
  activity_template_id: string;
};

type ClassroomActivitiesProps = {
  classroomId: string | undefined;
  classroomName: string | null;
};

export const ClassroomActivities = ({ classroomId, classroomName }: ClassroomActivitiesProps) => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const { 
    data: activitiesData, 
    loading: activitiesLoading, 
    fetch: fetchActivities 
  } = useFetch<Activity[]>(`/activity?classroom_id=${classroomId}`);

  useEffect(() => {
    if (classroomId) {
      fetchActivities({ name: 'GET' });
    }
  }, [fetchActivities, classroomId]);

  useEffect(() => {
    if (activitiesData) {
      setActivities(activitiesData);
    }
  }, [activitiesData]);

  const handleActivityClick = (activity: Activity) => {
    navigate(
      `/management/activities/activity/${activity.id}?name=${encodeURIComponent(activity.name)}&description=${encodeURIComponent(activity.description)}&classroom_name=${encodeURIComponent(classroomName || 'Turma')}`
    );
  };

  if (activitiesLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <>
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg">Nenhuma atividade encontrada</p>
            <p className="text-sm">Esta turma ainda não possui atividades atribuídas</p>
          </div>
          <Button 
            onClick={() => setAssignModalOpen(true)}
            className="bg-lime-600 hover:bg-lime-700 text-white cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Atribuir Primeira Atividade
          </Button>
        </div>
        <AssignActivityModal
          open={assignModalOpen}
          setOpen={setAssignModalOpen}
          classroomId={classroomId || null}
          classroomName={classroomName}
          onSuccess={() => fetchActivities({ name: 'GET' })}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-lime-600" />
            <h2 className="text-xl font-semibold text-lime-700/80">
              {activities.length} {activities.length === 1 ? 'Atividade' : 'Atividades'}
            </h2>
          </div>
          <Button 
            onClick={() => setAssignModalOpen(true)}
            className="bg-lime-600 hover:bg-lime-700 text-white cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Atribuir Atividade
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((activity) => {
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
                    
                    <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                      isExpired 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {isExpired ? 'Expirada' : 'Ativa'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <AssignActivityModal
        open={assignModalOpen}
        setOpen={setAssignModalOpen}
        classroomId={classroomId || null}
        classroomName={classroomName}
        onSuccess={() => fetchActivities({ name: 'GET' })}
      />
    </>
  );
};
