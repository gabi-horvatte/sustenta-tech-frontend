import { useLocation, useNavigate, useParams } from 'react-router';
import { TeacherImageRow } from '../../Home/TeacherImageRow';
import { useFetch } from '@/hooks/useFetch';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const Classroom = () => {
  const { classroomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { data: studentsData, error: studentsError, loading: studentsLoading, fetch: fetchStudents } = useFetch<{
    id: string;
    name: string;
    last_name: string;
    birth_date: string;
    code: string;
    phone: string;
    email: string;
    classroom_id: string;
  }[]>(`/student?classroom_id=${classroomId}`);

  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get('name');

  const formatBirthDate = (birthDate: string) => {
    return new Date(birthDate).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  useEffect(() => {
    fetchStudents({
      name: 'GET',
    });
  }, [fetchStudents]);

  return (
    <div className="max-w-[40vw] mx-auto flex flex-col gap-8 pt-8 pb-0">

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-bold text-center text-lime-700/80">{name ?? 'Painel do professor'}</h1>
          <h5 className="text-xl font-bold text-center text-yellow-900/80">Alunos</h5></div>
        <TeacherImageRow />
      </div>
      {studentsData?.length ? (
        <div className="grid grid-cols-3 gap-4">
          {studentsData?.map((student) => (
            <Card key={student.id} className="bg-lime-700/75 flex flex-col p-0 m-0 cursor-pointer" onClick={() => navigate(`/management/classroom/student/${student.id}?name=${student.name} ${student.last_name}&birth_date=${student.birth_date}&code=${student.code}&classroom_id=${classroomId}`)}>
              <CardHeader className="flex flex-col gap-1 items-start py-2 px-3">
                <CardTitle className="text-lg font-bold text-white">{student.name} {student.last_name}</CardTitle>
                <CardDescription className="text-white text-sm">{formatBirthDate(student.birth_date)} - {student.code}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        studentsLoading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) :
          studentsError ? (
            <div className="flex justify-center items-center">
              <p className="text-center text-gray-500">Erro ao carregar alunos. Tente novamente mais tarde.</p>
            </div>
          ) : (
            <div>
              <h2>Nenhum aluno encontrado</h2>
            </div>
          )
      )}
    </div>
  );
};