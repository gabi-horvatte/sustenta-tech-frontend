import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetch } from '@/hooks/useFetch';
import { CheckCircle, Link, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export const StudentActivities = () => {
  const activitiesData = [
    {
      id: '1',
      name: 'Atividade 1',
      description: 'Descrição da atividade 1',
      created_at: '2021-01-01',
      updated_at: '2021-01-01',
      completed_at: null,
    },
  ];

  const { 
    // data: activitiesData,
    // error: activitiesError,
    loading: activitiesLoading,
    fetch: fetchActivities
  } = useFetch<{
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    completed_at: string | null;
  }[]>(`/activity`);

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
            <Card key={activity.id} className={activity.completed_at ? 'bg-lime-300/32' : 'bg-red-300/25'}>
              <CardHeader>
                <CardTitle className="text-center">{activity.name}</CardTitle>
                <CardDescription>{activity.description}</CardDescription>
                <div className="flex flex-row gap-2"></div>
                  <Button variant="outline">
                    <Link className="w-4 h-4" />
                    </Button>
                    <Button variant="outline">
                      <CheckCircle className="w-4 h-4" />
                    </Button>
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