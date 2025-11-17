import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetch } from '@/hooks/useFetch';
import { useNavigate } from 'react-router';
import { Loader2, Plus, Eye, Users } from 'lucide-react';
import { toast } from 'sonner';

type ActivityTemplate = {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  question_count: number;
};

export const ActivityTemplateLibrary = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<ActivityTemplate[]>([]);

  const {
    data: templatesData,
    loading: templatesLoading,
    fetch: fetchTemplates,
  } = useFetch<ActivityTemplate[]>('/activity-template');

  useEffect(() => {
    fetchTemplates({ name: 'GET' });
  }, [fetchTemplates]);

  useEffect(() => {
    if (templatesData) {
      setTemplates(templatesData);
    }
  }, [templatesData]);

  const handleViewTemplate = (templateId: string) => {
    navigate(`/management/activity-templates/${templateId}`);
  };

  const handleAssignTemplate = (templateId: string, templateName: string) => {
    navigate(`/management/activity-templates/${templateId}/assign?name=${encodeURIComponent(templateName)}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-lime-700/80">Biblioteca de Modelos de Atividade</h1>
          <p className="text-gray-600 mt-2">
            Navegue e atribua atividades de quiz às suas turmas
          </p>
        </div>
        <Button onClick={() => navigate('/management/activity-templates/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Criar Novo Modelo
        </Button>
      </div>

      {templatesLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">{template.question_count}</span>
                    <span className="ml-1">
                      {template.question_count === 1 ? 'questão' : 'questões'}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Criado: {new Date(template.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewTemplate(template.id)}
                      className="flex-1"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAssignTemplate(template.id, template.name)}
                      className="flex-1 bg-lime-600 hover:bg-lime-700"
                    >
                      <Users className="w-3 h-3 mr-1" />
                      Atribuir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg">Nenhum modelo de atividade encontrado</p>
            <p className="text-sm">Crie seu primeiro modelo para começar</p>
          </div>
          <Button onClick={() => navigate('/management/activity-templates/create')}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Modelo de Atividade
          </Button>
        </div>
      )}
    </div>
  );
};
