import { useEffect, useContext } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetch } from '@/hooks/useFetch';
import { ArrowLeft, CheckCircle, Clock, User, ExternalLink } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { IAMContext } from '@/modules/IAM/context/context';

type MaterialAssignmentDetail = {
  id: string;
  name: string;
  description: string;
  authors: string;
  url: string;
  material_type: string;
  expires_at: string;
  created_at: string;
  classroom_name: string;
  students: {
    id: string;
    name: string;
    last_name: string;
    completed_at: string | null;
  }[];
};

export const MaterialAssignmentDetail = () => {
  const { assignmentId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useContext(IAMContext);
  
  const materialName = searchParams.get('name');
  const classroomName = searchParams.get('classroom');

  const { data: assignmentDetail, loading, error, fetch: fetchAssignmentDetail } = useFetch<MaterialAssignmentDetail>(`/material-assignment/${assignmentId}/detail`);

  useEffect(() => {
    if (assignmentId) {
      fetchAssignmentDetail({ name: 'GET' });
    }
  }, [fetchAssignmentDetail, assignmentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !assignmentDetail) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12 text-red-600">
          <p>Erro ao carregar detalhes do material. Tente novamente mais tarde.</p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/management/materials')}
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Materiais
          </Button>
        </div>
      </div>
    );
  }

  const isExpired = new Date(assignmentDetail.expires_at) < new Date();
  const completedStudents = assignmentDetail.students.filter(s => s.completed_at);
  const pendingStudents = assignmentDetail.students.filter(s => !s.completed_at);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/management/materials')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar aos Materiais
        </Button>
        
        <h1 className="text-3xl font-bold text-lime-700/80">
          {materialName || assignmentDetail.name}
        </h1>
        <p className="text-gray-600 mt-2">
          Turma: {classroomName || assignmentDetail.classroom_name}
        </p>
      </div>

      {/* Material Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Informações do Material</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(assignmentDetail.url, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir Material
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Descrição:</p>
              <p className="font-medium">{assignmentDetail.description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Autores:</p>
              <p className="font-medium">{assignmentDetail.authors}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Tipo:</p>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {assignmentDetail.material_type === 'video' ? 'Vídeo' :
                 assignmentDetail.material_type === 'document' ? 'Documento' :
                 assignmentDetail.material_type === 'presentation' ? 'Apresentação' :
                 assignmentDetail.material_type === 'interactive' ? 'Interativo' :
                 'Outro'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status:</p>
              <span className={`px-2 py-1 rounded text-sm ${
                isExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {isExpired ? 'Expirado' : 'Ativo'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Expira em:</p>
              <p className="font-medium">{new Date(assignmentDetail.expires_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Criado em:</p>
              <p className="font-medium">{new Date(assignmentDetail.created_at).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <User className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{assignmentDetail.students.length}</p>
                <p className="text-sm text-gray-600">Total de Alunos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{completedStudents.length}</p>
                <p className="text-sm text-gray-600">Concluídos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{pendingStudents.length}</p>
                <p className="text-sm text-gray-600">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso dos Alunos</CardTitle>
        </CardHeader>
        <CardContent>
          {assignmentDetail.students.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum aluno encontrado para esta turma.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Aluno</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Concluído em</th>
                  </tr>
                </thead>
                <tbody>
                  {assignmentDetail.students.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">
                          {student.name} {student.last_name}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {student.completed_at ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Concluído
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="w-3 h-3 mr-1" />
                            Pendente
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {student.completed_at 
                          ? new Date(student.completed_at).toLocaleString()
                          : '-'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
