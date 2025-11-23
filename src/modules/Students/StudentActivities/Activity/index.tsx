import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTimeString } from '@/utils';
import { CheckCircle, Clock, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router';

export const Activity = ({
  activity,
}: {
  activity: {
    activity_id: string;
    student_id: string;
    description: string;
    completed_at: string | null;
    activity_name: string;
    expires_at: string;
    activity_template_id: string;
  };
}) => {
  const navigate = useNavigate();
  const isCompleted = !!activity.completed_at;


  return (
  <Card key={activity.activity_id} className={new Date(activity.expires_at) < new Date() && !isCompleted ? 'bg-red-300/32' : isCompleted ? 'bg-lime-300/32' : ''}>
    <CardHeader>
      <div className="flex flex-row gap-2 items-center justify-center">
        <CardTitle className="text-center">
          {activity.activity_name}
        </CardTitle>
        {activity.completed_at ? <CheckCircle className="w-4 h-4 text-lime-700/80" /> : new Date(activity.expires_at) > new Date() ? <Clock className="w-4 h-4 text-yellow-700/80" /> : <Clock className="w-4 h-4 text-red-700/80" />}
      </div>
      <CardDescription>
        <p>Descrição: {activity.description}</p>
        <p>Expiração: {formatDateTimeString(activity.expires_at)}</p>
      </CardDescription>
      
      {/* Quiz-based activity */}
      <Button
        variant="outline"
        className="cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (isCompleted) {
            // Go to review mode if completed
            navigate(`/student/quiz/${activity.activity_id}/review`);
          } else {
            // Go to quiz if not completed
            navigate(`/student/quiz/${activity.activity_id}`);
          }
        }}
        disabled={new Date(activity.expires_at) < new Date() && !isCompleted}
      >
        <BookOpen className="w-4 h-4 mr-2" />
        {isCompleted ? 'Ver Respostas' : 'Iniciar Quiz'}
      </Button>
      {/* Status display */}
      {new Date(activity.expires_at) < new Date() ? (
        <p className="text-red-700/80 text-center">Expirado</p>
      ) : isCompleted ? (
        <p className="text-lime-700/80 text-center">Concluído</p>
      ) : null}
    </CardHeader>
  </Card>
  )
}