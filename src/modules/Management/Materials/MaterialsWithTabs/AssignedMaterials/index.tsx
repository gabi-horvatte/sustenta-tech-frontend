import { useEffect, useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetch } from '@/hooks/useFetch';
import { useNavigate } from 'react-router';
import { Loader2, FileText, Clock } from 'lucide-react';
import { IAMContext } from '@/modules/IAM/context/context';

type MaterialAssignment = {
  id: string;
  name: string;
  description: string;
  authors: string;
  url: string;
  material_type: string;
  expires_at: string;
  created_at: string;
  classroom_id: string;
  classroom_name: string;
};

type Classroom = {
  id: string;
  name: string;
  description: string;
};

export const AssignedMaterials = () => {
  const navigate = useNavigate();
  const { user } = useContext(IAMContext);
  const { data: assignments, loading: assignmentsLoading, error: assignmentsError, fetch: fetchAssignments } = useFetch<MaterialAssignment[]>('/material-assignment');
  const { data: classrooms, loading: classroomsLoading, error: classroomsError, fetch: fetchClassrooms } = useFetch<Classroom[]>('/classroom');

  useEffect(() => {
    if (user?.id) {
      fetchAssignments({ 
        name: 'GET',
        url: `/material-assignment?assigned_by=${user.id}`
      });
      fetchClassrooms({ name: 'GET' });
    }
  }, [fetchAssignments, fetchClassrooms, user?.id]);

  if (assignmentsLoading || classroomsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (assignmentsError || classroomsError) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Erro ao carregar materiais atribuídos. Tente novamente mais tarde.</p>
      </div>
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold mb-2">Nenhum material atribuído ainda</h3>
        <p>Crie e atribua modelos de material para vê-los aqui</p>
      </div>
    );
  }

  // Group assignments by classroom
  const classroomMap = new Map(classrooms?.map(c => [c.id, c.name]) || []);
  const groupedAssignments = assignments.reduce((groups, assignment) => {
    const classroomName = classroomMap.get(assignment.classroom_id) || 'Turma Desconhecida';
    if (!groups[classroomName]) {
      groups[classroomName] = [];
    }
    groups[classroomName].push(assignment);
    return groups;
  }, {} as Record<string, MaterialAssignment[]>);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-lime-700/80">Materiais Atribuídos</h2>
        <p className="text-gray-600 mt-1">
          {assignments.length} {assignments.length === 1 ? 'material' : 'materiais'} atribuídos
        </p>
      </div>

      {Object.entries(groupedAssignments).map(([classroomName, classroomAssignments]) => (
        <div key={classroomName} className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
            {classroomName}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classroomAssignments.map((assignment) => {
              const isExpired = new Date(assignment.expires_at) < new Date();
              return (
                <Card
                  key={assignment.id}
                  className={`cursor-pointer hover:shadow-lg transition-shadow ${
                    isExpired ? 'border-red-300' : 'border-lime-300'
                  }`}
                  onClick={() => navigate(`/management/materials/assignment/${assignment.id}?name=${encodeURIComponent(assignment.name)}&classroom=${encodeURIComponent(classroomName)}`)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{assignment.name}</CardTitle>
                        <CardDescription>{assignment.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Autores:</span> {assignment.authors}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {assignment.material_type === 'video' ? 'Vídeo' :
                           assignment.material_type === 'document' ? 'Documento' :
                           assignment.material_type === 'presentation' ? 'Apresentação' :
                           assignment.material_type === 'interactive' ? 'Interativo' :
                           'Outro'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3" />
                        <span>Expira: {new Date(assignment.expires_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3" />
                        <span>Criado: {new Date(assignment.created_at).toLocaleDateString()}</span>
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
        </div>
      ))}
    </div>
  );
};
