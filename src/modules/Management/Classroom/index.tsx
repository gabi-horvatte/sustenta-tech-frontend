import classroomImage from '@/assets/images/classroom-children.jpeg';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetch } from '@/hooks/useFetch';
import { useEffect } from 'react';
import { AddStudentButton } from './AddStudentButton';
// import { toast } from 'sonner';

export const Classrooms = () => {
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

  useEffect(() => {
    fetchClassrooms({
      name: 'GET',
    });
  }, [fetchClassrooms]);

  return (
    <div className="max-w-[40vw] mx-auto flex flex-col gap-8 pt-8 pb-0">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-bold text-center text-lime-700/80">Painel administrativo</h1>
        <h5 className="text-xl font-bold text-center text-yellow-900/80">Turmas</h5>
      </div>
      <Card className="p-0 overflow-hidden max-h-[50vh]">
        <img src={classroomImage} alt="Turmas" className="w-full h-full object-cover object-center" />
      </Card>
      <div className="grid grid-cols-3 gap-2">
        {classroomsData?.map((classroom) => (
          <Card key={classroom.id} className="bg-lime-700/50 flex flex-col p-0 m-0">
            <CardHeader className="flex flex-col gap-1 items-center">
              <CardTitle className="text-lg font-bold text-white text-center">{classroom.name}</CardTitle>
              <CardDescription className="text-white text-center">{classroom.description}</CardDescription>
            </CardHeader>
            <CardFooter className="p-0 m-0">
              <AddStudentButton classroomId={classroom.id} />
              {/* <Button 
                className="bg-red-700/80 text-white border-none rounded-none hover:bg-red-800/100 cursor-pointer"
                onClick={() => handleRemoveClassroom(classroom.id)}
              >Excluir</Button> */}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}