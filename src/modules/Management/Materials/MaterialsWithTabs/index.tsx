import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MaterialTemplateLibrary } from './MaterialTemplateLibrary';
import { AssignedMaterials } from './AssignedMaterials';
import { MaterialReports } from './MaterialReports';

export const MaterialsWithTabs = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-lime-700/80">Gerenciamento de Materiais</h1>
        <p className="text-gray-600 mt-2">
          Crie modelos de materiais e gerencie materiais atribuídos
        </p>
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="assigned">Materiais Atribuídos</TabsTrigger>
          <TabsTrigger value="templates">Modelos de Material</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="mt-6">
          <MaterialTemplateLibrary />
        </TabsContent>
        <TabsContent value="assigned" className="mt-6">
          <AssignedMaterials />
        </TabsContent>
        <TabsContent value="reports" className="mt-6">
          <MaterialReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};
