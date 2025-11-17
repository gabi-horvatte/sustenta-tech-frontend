import { useFetch } from '@/hooks/useFetch';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Loader2, FileText, Clock, Users } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

type MaterialAssignment = {
  id: string;
  name: string;
  description: string;
  authors: string;
  url: string;
  material_type: string;
  expires_at: string;
  created_at: string;
};

export const ClassroomMaterials = ({ classroomId }: { classroomId: string }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classroomName = searchParams.get('name') || 'Turma';
  
  const { data: materialsData, error: materialsError, loading: materialsLoading, fetch: fetchMaterials } = useFetch<MaterialAssignment[]>(`/material-assignment?classroom_id=${classroomId}`);

  useEffect(() => {
    fetchMaterials({ name: 'GET' });
  }, [fetchMaterials, classroomId]);

  if (materialsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (materialsError) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Erro ao carregar materiais. Tente novamente mais tarde.</p>
      </div>
    );
  }

  if (!materialsData || materialsData.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p className="text-lg">Nenhum material encontrado para esta turma.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {materialsData.map((material) => {
        const isExpired = new Date(material.expires_at) < new Date();
        return (
          <Card
            key={material.id}
            className={`cursor-pointer hover:shadow-lg transition-shadow ${
              isExpired ? 'border-red-300' : 'border-lime-300'
            }`}
            onClick={() => {
              const assignmentUrl = `/management/materials/assignment/${material.id}?name=${encodeURIComponent(material.name)}&classroom=${encodeURIComponent(classroomName)}`;
              navigate(assignmentUrl);
            }}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{material.name}</CardTitle>
                  <CardDescription>{material.description}</CardDescription>
                </div>
                <Users className="w-4 h-4 text-gray-400 ml-2" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Autores:</span> {material.authors}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {material.material_type === 'video' ? 'Vídeo' :
                     material.material_type === 'document' ? 'Documento' :
                     material.material_type === 'presentation' ? 'Apresentação' :
                     material.material_type === 'interactive' ? 'Interativo' :
                     'Outro'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>Expira: {new Date(material.expires_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>Criado: {new Date(material.created_at).toLocaleDateString()}</span>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                  isExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {isExpired ? 'Expirado' : 'Ativo'}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
