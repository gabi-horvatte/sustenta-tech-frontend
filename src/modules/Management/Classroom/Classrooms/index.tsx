import classroomImage from '@/assets/images/classroom-children.jpeg';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetch } from '@/hooks/useFetch';
import { useContext, useEffect, useState } from 'react';
import { AddStudentButton } from './AddStudentButton';
import { CreateClassroomButton } from './CreateClassroomButton';
import { useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import { CreateClassroomModal } from './CreateClassroomModal';
import { AddStudentModal } from './AddStudentModal';
import { IAMContext } from '@/modules/IAM/context/context';

export const Classrooms = () => {
  const navigate = useNavigate();
  const { user } = useContext(IAMContext);
  const {
    data: classroomsData,
    error: classroomsError,
    loading: classroomsLoading,
    fetch: fetchClassrooms
  } = useFetch<{
    created_at: string;
    description: string;
    id: string;
    name: string;
    updated_at: string;
  }[]>('/classroom');

  const [open, setOpen] = useState(false);
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [classroomId, setClassroomId] = useState<string | null>(null);

  console.log(classroomsData, 'classroomsData');

  // const handleRemoveClassroom = async (id: string) => {
  //   try {
  //     await fetchClassrooms({
  //       name: 'DELETE',
  //       id,
  //     });
  //     toast.success('Turma removida com sucesso');
  //     fetchClassrooms({
  //       name: 'GET',
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     toast.error('Erro ao remover turma');
  //   }
  // }

  const handleClassroomClick = (classroomId: string) => {
    navigate(`/management/classroom/${classroomId}`);
  }

  useEffect(() => {
    fetchClassrooms({
      name: 'GET',
    });
  }, [fetchClassrooms]);

  return (
    <>
      <div className="max-w-[40vw] mx-auto flex flex-col gap-8 pt-8 pb-0">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-bold text-center text-lime-700/80">{user?.role === 'TEACHER' && user.manager ? 'Painel administrativo' : 'Painel do professor'}</h1>
          <h5 className="text-xl font-bold text-center text-yellow-900/80">Turmas</h5>
        </div>
        <Card className="p-0 overflow-hidden max-h-[50vh]">
          <img src={classroomImage} alt="Turmas" className="w-full h-full object-cover object-center" />
        </Card>
        {(classroomsData?.length ?? 0) > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {classroomsData?.map((classroom) => (
              <Card
                key={classroom.id}
                className="bg-lime-700/50 flex flex-col p-0 m-0 transition-all duration-300 hover:bg-lime-700/60 cursor-pointer rounded-b-md"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Clicked', classroom.id, classroom.name);
                  if (open) return;
                  handleClassroomClick(classroom.id);
                }}
              >
                <CardHeader className="flex flex-col gap-1 items-center">
                  <CardTitle className="text-lg font-bold text-white text-center">{classroom.name}</CardTitle>
                  <CardDescription className="text-white text-center">{classroom.description}</CardDescription>
                </CardHeader>
                <CardFooter className="p-0 m-0 rounded-b-md">
                  <AddStudentButton setOpen={setAddStudentOpen} setClassroomId={setClassroomId} classroomId={classroom.id} />
                  {/* <Button 
                className="bg-red-700/80 text-white border-none rounded-none hover:bg-red-800/100 cursor-pointer"
                onClick={() => handleRemoveClassroom(classroom.id)}
              >Excluir</Button> */}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) :
          classroomsLoading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) :
            classroomsError ? (
              <div className="flex justify-center items-center">
                <p className="text-center text-gray-500">Erro ao carregar turmas. Tente novamente mais tarde.</p>
              </div>
            ) : (
              <div>
                <p className="text-center text-gray-500">Você ainda não possui nenhuma turma.</p>
                <CreateClassroomButton setOpen={setOpen} />
              </div>
            )}
      </div>
      <CreateClassroomModal 
        open={open} 
        setOpen={setOpen} 
        onSuccess={() => fetchClassrooms({ name: 'GET' })} 
      />
      <AddStudentModal 
        classroomId={classroomId} 
        open={addStudentOpen} 
        setOpen={setAddStudentOpen} 
        onSuccess={() => fetchClassrooms({ name: 'GET' })} 
      />
    </>
  )
}