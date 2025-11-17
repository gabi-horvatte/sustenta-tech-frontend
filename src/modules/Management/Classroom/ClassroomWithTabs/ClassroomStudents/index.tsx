import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useFetch } from '@/hooks/useFetch';
import { Loader2, Users } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateString } from '@/utils';

type Student = {
  id: string;
  name: string;
  last_name: string;
  birth_date: string;
  code: string;
  phone: string;
  email: string;
  classroom_id: string;
};

type ClassroomStudentsProps = {
  classroomId: string | undefined;
};

export const ClassroomStudents = ({ classroomId }: ClassroomStudentsProps) => {
  const navigate = useNavigate();

  const { 
    data: studentsData, 
    error: studentsError, 
    loading: studentsLoading, 
    fetch: fetchStudents 
  } = useFetch<Student[]>(`/student?classroom_id=${classroomId}`);

  useEffect(() => {
    if (classroomId) {
      fetchStudents({ name: 'GET' });
    }
  }, [fetchStudents, classroomId]);

  if (studentsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (studentsError) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-center text-gray-500">
          Erro ao carregar alunos. Tente novamente mais tarde.
        </p>
      </div>
    );
  }

  if (!studentsData || studentsData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-lg">Nenhum aluno encontrado</p>
          <p className="text-sm">Esta turma ainda não possui alunos cadastrados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Users className="w-5 h-5 text-lime-600" />
        <h2 className="text-xl font-semibold text-lime-700/80">
          {studentsData.length} {studentsData.length === 1 ? 'Aluno' : 'Alunos'}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {studentsData.map((student) => (
          <Card 
            key={student.id} 
            className="bg-lime-700/75 hover:bg-lime-700/85 transition-colors cursor-pointer" 
            onClick={() => navigate(
              `/management/classroom/student/${student.id}?name=${student.name} ${student.last_name}&birth_date=${student.birth_date}&code=${student.code}&classroom_id=${classroomId}`
            )}
          >
            <CardHeader className="py-4 px-4">
              <CardTitle className="text-lg font-bold text-white">
                {student.name} {student.last_name}
              </CardTitle>
              <CardDescription className="text-white/90 text-sm">
                {formatDateString(student.birth_date)} • {student.code}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
