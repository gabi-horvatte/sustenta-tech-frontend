import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetch } from '@/hooks/useFetch';
import { useNavigate } from 'react-router';
import { Loader2, Plus, ExternalLink, FileText, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type MaterialTemplate = {
  id: string;
  name: string;
  description: string;
  authors: string;
  url: string;
  thumbnail: string | null;
  material_type: string;
  created_by: string;
  created_at: string;
};

export const MaterialTemplateLibrary = () => {
  const navigate = useNavigate();
  const { data: templates, loading, error, fetch: fetchTemplates } = useFetch<MaterialTemplate[]>('/material-template');
  const { fetch: deleteTemplate, loading: deleting } = useFetch('/material-template');

  useEffect(() => {
    fetchTemplates({ name: 'GET' });
  }, [fetchTemplates]);

  const handleDeleteTemplate = async (templateId: string, templateName: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o modelo "${templateName}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await deleteTemplate({
        name: 'DELETE',
        id: templateId,
      });

      // Refresh the list
      fetchTemplates({ name: 'GET' });
      toast.success(`Modelo "${templateName}" excluído com sucesso!`);
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Erro ao excluir modelo. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Erro ao carregar modelos de material. Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-lime-700/80">Biblioteca de Modelos de Material</h2>
          <p className="text-gray-600 mt-1">
            Navegue e atribua materiais educacionais às suas turmas
          </p>
        </div>
        <Button 
          onClick={() => navigate('/management/material-templates/create')}
          className="bg-lime-600 hover:bg-lime-700 cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Criar Novo Modelo
        </Button>
      </div>

      {!templates || templates.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Nenhum modelo de material encontrado</h3>
          <p className="mb-4">Crie seu primeiro modelo para começar</p>
          <Button 
            onClick={() => navigate('/management/material-templates/create')}
            variant="outline"
            className="cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Modelo de Material
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="mt-1">{template.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {template.material_type === 'video' ? 'Vídeo' :
                       template.material_type === 'document' ? 'Documento' :
                       template.material_type === 'presentation' ? 'Apresentação' :
                       template.material_type === 'interactive' ? 'Interativo' :
                       'Outro'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Autores:</span> {template.authors}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    Criado: {new Date(template.created_at).toLocaleDateString()}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(template.url, '_blank')}
                      className="flex-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/management/material-templates/edit/${template.id}`)}
                      className="flex-1 cursor-pointer"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/management/material-templates/assign?templateId=${template.id}`)}
                      className="flex-1 bg-lime-600 hover:bg-lime-700 cursor-pointer"
                    >
                      Atribuir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id, template.name)}
                      disabled={deleting}
                      className="text-red-600 border-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
