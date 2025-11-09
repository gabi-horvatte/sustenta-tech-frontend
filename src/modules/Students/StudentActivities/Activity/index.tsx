import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetch } from '@/hooks/useFetch';
import { CheckCircle, Clock, Link } from 'lucide-react';
import { toast } from 'sonner';

export const Activity = ({
  activity
}: {
  activity: {
    activity_id: string;
    student_id: string;
    description: string;
    completed_at: string | null;
    activity_name: string;
    expires_at: string;
    url: string;
  }
}) => {
  const { fetch: markAsCompleted } = useFetch<boolean>(`/activity/${activity.activity_id}/complete`);

  const handleMarkAsCompleted = async () => {
    try {
    await markAsCompleted({
      name: 'PATCH',
      body: {}
    });
      toast.success('Atividade marcada como concluída');
    } catch (error) {
      toast.error('Erro ao marcar atividade como concluída');
      console.error('Erro ao marcar atividade como concluída', error);
    }
  }

  return (
  <Card key={activity.activity_id} className={activity.completed_at ? 'bg-lime-300/32' : ''}>
    <CardHeader>
      <div className="flex flex-row gap-2 items-center justify-center">
        <CardTitle className="text-center">
          {activity.activity_name}
        </CardTitle>
        {activity.completed_at ? <CheckCircle className="w-4 h-4 text-lime-700/80" /> : new Date(activity.expires_at) > new Date() ? <Clock className="w-4 h-4 text-yellow-700/80" /> : <Clock className="w-4 h-4 text-red-700/80" />}
      </div>
      <CardDescription>{activity.description}</CardDescription>
      <Button
        variant="outline"
        className="cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.open(activity.url, '_blank');
        }}
      >
        <Link className="w-4 h-4" />
        Abrir link
      </Button>
      {!activity.completed_at && new Date(activity.expires_at) > new Date() ? (
      <Button
        variant="outline"
        className="cursor-pointer bg-lime-300/32 hover:bg-lime-300/50"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleMarkAsCompleted();
          console.log('marcar como concluído');
        }}
      >
        <CheckCircle className="w-4 h-4" />
        Marcar como concluído
      </Button>
      ) : new Date(activity.expires_at) < new Date() ? (
          <p className="text-red-700/80 text-center">Expirado</p>
      ) : (
          <p className="text-lime-700/80 text-center">Concluído</p>
      )}
    </CardHeader>
  </Card>
  )
}