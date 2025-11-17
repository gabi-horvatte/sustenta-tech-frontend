import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useFetch } from '@/hooks/useFetch';
import { useEffect } from 'react';
import { CheckCircle, Clock, Loader2 } from 'lucide-react';

export const StudentMaterialAssignments = ({
  studentId
}: {
  studentId: string;
}) => {

  const { data: materialsAssignmentsData, loading: materialsLoading, fetch: fetchMaterials } = useFetch<{
    assignment_id: string;
    material_template_id: string;
    name: string;
    description: string;
    authors: string;
    url: string;
    thumbnail: string;
    material_type: string;
    expires_at: string;
    completed_at: string | null;
  }[]>(`/student-materials?student_id=${studentId}`);

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
        materialsAssignmentsData && materialsAssignmentsData.length > 0 ? (
          <div className="grid grid-cols-3 nowrap gap-4">
            {materialsAssignmentsData.map((material) => {
              const isCompleted = !!material.completed_at;
              const isExpired = new Date(material.expires_at) < new Date();
              
              return (
                <Card 
                  key={material.assignment_id}
                  className="pt-0 border-3 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => window.open(material.url, '_blank')}
                >
                <CardHeader 
                style={{ backgroundImage: `url(${material.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
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
                  ) : isExpired ? (
                    <>
                    <div className="absolute top-0 right-0 bg-black/70 h-full w-full flex items-center justify-center">
                    </div>
                    <div className="absolute top-0 right-0 bg-red-300/50 h-full w-full flex items-center justify-center">                
                      <div className="flex flex-col items-center justify-center">
                        <Clock className="w-30 h-30 text-white" />
                        <p className="text-lg text-white">Expirado</p>
                      </div>
                    </div>
                    </>
                  ) : (
                    <>
                    <div className="absolute top-0 right-0 bg-black/70 h-full w-full flex items-center justify-center">
                    </div>
                    <div className="absolute top-0 right-0 bg-yellow-300/25 h-full w-full flex items-center justify-center">                
                      <div className="flex flex-col items-center justify-center">
                        <Clock className="w-30 h-30 text-white" />
                        <p className="text-lg text-white">Pendente</p>
                      </div>
                    </div>
                    </>
                  )}
                </CardHeader>
                <CardContent>
                  <CardTitle>{material.name}</CardTitle>
                  <CardDescription>{material.description}</CardDescription>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Autores:</span> {material.authors}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Expira: {new Date(material.expires_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum material atribuído ainda</p>
          </div>
        )
      )}
    </div>
  )
}