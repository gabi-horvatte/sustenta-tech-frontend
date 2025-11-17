import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActivityTemplateLibrary } from '@/modules/Management/ActivityTemplates/ActivityTemplateLibrary';
import { AssignedActivities } from './AssignedActivities';
import { ActivityReports } from './ActivityReports';

export const ActivitiesWithTabs = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-lime-700/80">Gerenciamento de Atividades</h1>
        <p className="text-gray-600 mt-2">
          Crie modelos de quiz e gerencie atividades atribuídas
        </p>
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="assigned">Atividades Atribuídas</TabsTrigger>
          <TabsTrigger value="templates">Modelos de Atividade</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="mt-6">
          <ActivityTemplateLibrary />
        </TabsContent>
        
        <TabsContent value="assigned" className="mt-6">
          <AssignedActivities />
        </TabsContent>
        <TabsContent value="reports" className="mt-6">
          <ActivityReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};
