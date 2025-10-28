import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useFetch } from '@/hooks/useFetch';
import { materialsContent } from '@/materials'
import { useEffect } from 'react';
import { CheckCircle, Clock, Loader2 } from 'lucide-react';

export const StudentMaterialAssignments = () => {

  const { data: materialsAssignmentsData, loading: materialsLoading, fetch: fetchMaterials } = useFetch<{
    id: string;
    type: string;
    student_id: string;
    created_at: string;
    updated_at: string;
  }[]>(`/material`);

  useEffect(() => {
    fetchMaterials({
      name: 'GET',
    });
  }, [fetchMaterials]);
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold text-yellow-900/80 text-center">Materiais e vídeos</h2>
      {materialsLoading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
      <div className="grid grid-cols-3 nowrap gap-4">
        {materialsContent.map((material) => {
          const materialAssignment = materialsAssignmentsData?.find((assignment) => assignment.type === material.type);
          
          return (
            <Card 
              key={material.title + material.description}
              className="pt-0"
            >
            <CardHeader 
            style={{ backgroundImage: `url(${material.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            className="relative bg-cover bg-center w-full h-40 p-0 m-0 rounded-t-xl overflow-hidden"
            >
              {materialAssignment ? (
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
              <CardTitle>{material.title}</CardTitle>
              <CardDescription>{material.description}</CardDescription>
            </CardContent>
          </Card>
        )})}
      </div>
      )}
    </div>
  )
}