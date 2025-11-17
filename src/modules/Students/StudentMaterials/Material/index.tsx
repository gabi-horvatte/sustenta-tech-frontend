import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useFetch } from '@/hooks/useFetch';
import { CheckCircle, Clock, Link, Loader2 } from 'lucide-react';
import { useEffect, useState, useContext } from 'react';
import { toast } from 'sonner';
import { IAMContext } from '@/modules/IAM/context/context';

export const Material = ({
  materialAssignment
}: {
  materialAssignment: {
    id: string;
    type: string;
    thumbnail: string | null;
    title: string;
    description: string;
    authors: string;
    completed_at: string | null;
    expires_at: string;
    url: string;
  }
}) => {
  const { user } = useContext(IAMContext);
  const [isCompleted, setIsCompleted] = useState(materialAssignment.completed_at);
  const { fetch: markAsCompleted, loading: markAsCompletedLoading, data: markAsCompletedData } = useFetch<{
    completed_at: string;
  }>(`/material-assignment/${materialAssignment.id}/complete`);
  
  const handleMarkAsCompleted = async () => {
    try {
      if (!user?.id) {
        toast.error('User not found. Please log in again.');
        return;
      }

      await markAsCompleted({
        name: 'PATCH',
        body: { student_id: user.id }
      });
      toast.success('Material marcado como concluído');
    } catch (error) {
      toast.error('Erro ao marcar material como concluído');
      console.error('Erro ao marcar material como concluído', error);
    }
  }

  useEffect(() => {
    if (markAsCompletedData) {
      setIsCompleted(markAsCompletedData.completed_at);
    }
  }, [markAsCompletedData]);

  const isExpired = new Date(materialAssignment.expires_at) < new Date();

  return (
    <Card 
      key={materialAssignment.id} 
      className={`${
        isExpired && !isCompleted 
          ? 'bg-red-300/32' 
          : isCompleted 
            ? 'bg-lime-300/32' 
            : ''
      }`}
    >
      <CardHeader>
        <div className="flex flex-row gap-2 items-center justify-center">
          <CardTitle className="text-center">
            {materialAssignment.title}
          </CardTitle>
          {isCompleted ? (
            <CheckCircle className="w-4 h-4 text-lime-700/80" />
          ) : isExpired ? (
            <Clock className="w-4 h-4 text-red-700/80" />
          ) : (
            <Clock className="w-4 h-4 text-yellow-700/80" />
          )}
        </div>
        <CardDescription>{materialAssignment.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {materialAssignment.thumbnail && (
          <img 
            src={materialAssignment.thumbnail} 
            alt={materialAssignment.title}
            className="w-full h-32 object-cover rounded mb-3"
          />
        )}
        <div className="space-y-2 mb-3">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Autores:</span> {materialAssignment.authors}
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              {materialAssignment.type === 'video' ? 'Vídeo' :
               materialAssignment.type === 'document' ? 'Documento' :
               materialAssignment.type === 'presentation' ? 'Apresentação' :
               materialAssignment.type === 'interactive' ? 'Interativo' :
               'Outro'}
            </span>
            <span className="text-xs">
              Expira: {new Date(materialAssignment.expires_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="cursor-pointer w-full"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(`https://${materialAssignment.url.replace('https://', '').replace('http://', '')}`, '_blank', 'noopener,noreferrer');
          }}
        >
          <Link className="w-4 h-4 mr-2" />
          Abrir material
        </Button>
        
        {!isCompleted && !isExpired ? (
          <Button
            variant="outline"
            className="cursor-pointer bg-lime-300/32 hover:bg-lime-300/50 w-full"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleMarkAsCompleted();
            }}
          >
            {markAsCompletedLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            Marcar como concluído
          </Button>
        ) : isExpired ? (
          <p className="text-red-700/80 text-center text-sm">Expirado</p>
        ) : (
          <p className="text-lime-700/80 text-center text-sm">Concluído</p>
        )}
      </CardFooter>
    </Card>
  )
}
