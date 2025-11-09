import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetch } from '@/hooks/useFetch';
import { CheckCircle, Clock, Link, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const Material = ({
  materialAssignment
}: {
  materialAssignment: {
    id: string;
    type: string;
    thumbnail: string;
    title: string;
    description: string;
    completed_at: string | null;
    url: string;
  }
}) => {
  const [isCompleted, setIsCompleted] = useState(materialAssignment.completed_at);
  const { fetch: markAsCompleted, loading: markAsCompletedLoading, data: markAsCompletedData } = useFetch<{
    completed_at: string;
  }>(`/material/${materialAssignment.id}/complete`);
  
  const handleMarkAsCompleted = async () => {
    try {
      await markAsCompleted({
        name: 'PATCH',
        body: {}
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

  return (
    <Card 
              key={materialAssignment.title + materialAssignment.description}
              className="pt-0"
            >
            <CardHeader 
            style={{ backgroundImage: `url(${materialAssignment.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            className="relative bg-cover bg-center w-full h-40 p-0 m-0 rounded-t-xl overflow-hidden"
            >
              {isCompleted ? (
                <>
                <div className="absolute top-0 right-0 bg-black/70 h-full w-full flex items-center justify-center">
                </div>
                <div className="absolute top-0 right-0 bg-lime-300/32 h-full w-full flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center">
                    <CheckCircle className="w-30 h-30 text-white" />
                    <p className="text-lg text-white">Concluído</p>
                  </div>
                </div>
                </>
              ) : (
                <>
                <div className="absolute top-0 right-0 bg-black/70 h-full w-full flex items-center justify-center">
                </div>
                <div className="absolute top-0 right-0 bg-red-300/25 h-full w-full flex items-center justify-center">                
                  <div className="flex flex-col items-center justify-center">
                    <Clock className="w-30 h-30 text-white" />
                    <p className="text-lg text-white">Aguardando</p>
                  </div>
                </div>
                </>
              )}
            </CardHeader>
            <CardContent>
              <CardTitle>{materialAssignment.title}</CardTitle>
              <CardDescription>{materialAssignment.description}</CardDescription>
            </CardContent>
            {!isCompleted ? (
            <CardFooter className="flex flex-row gap-2 items-center justify-center">
              <Button variant="outline" className="cursor-pointer" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(materialAssignment.url, '_blank');
              }}>
                <Link className="w-4 h-4" />
                Abrir link
              </Button>
              <Button variant="outline" className="cursor-pointer" disabled={markAsCompletedLoading} onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleMarkAsCompleted();
              }}>
                {markAsCompletedLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (<>              
                <CheckCircle className="w-4 h-4" />
                  Marcar como concluído
                </>)}
              </Button>
            </CardFooter>
            ) : <></>}
          </Card>
  )
}