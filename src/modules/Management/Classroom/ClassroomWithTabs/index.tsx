import { useLocation, useParams } from 'react-router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClassroomStudents } from './ClassroomStudents';
import { ClassroomActivities } from './ClassroomActivities';
import { ClassroomMaterials } from './ClassroomMaterials';
import { ClassroomReports } from './ClassroomReports';

export const ClassroomWithTabs = () => {
  const { classroomId } = useParams();
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get('name');

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-lime-700/80">{name ?? 'Turma'}</h1>
        <p className="text-gray-600 mt-2">
          Gerencie alunos, atividades e materiais desta turma
        </p>
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="students">Alunos</TabsTrigger>
          <TabsTrigger value="activities">Atividades</TabsTrigger>
          <TabsTrigger value="materials">Materiais</TabsTrigger>
        </TabsList>
        
        <TabsContent value="students" className="mt-6">
          <ClassroomStudents classroomId={classroomId} />
        </TabsContent>
        
        <TabsContent value="activities" className="mt-6">
          <ClassroomActivities classroomId={classroomId} classroomName={name} />
        </TabsContent>
        
        <TabsContent value="materials" className="mt-6">
          {classroomId && <ClassroomMaterials classroomId={classroomId} />}
        </TabsContent>
        <TabsContent value="reports" className="mt-6">
          {classroomId && <ClassroomReports classroomId={classroomId} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};
