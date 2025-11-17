import { useEffect, useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFetch } from '@/hooks/useFetch';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { Loader2, Plus, ExternalLink } from 'lucide-react';
import { IAMContext } from '@/modules/IAM/context/context';

type Classroom = {
  id: string;
  name: string;
  description: string;
};

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

export const AssignMaterial = () => {
  const navigate = useNavigate();
  const { user } = useContext(IAMContext);
  const [searchParams] = useSearchParams();
  const templateIdFromUrl = searchParams.get('templateId');
  const [selectedTemplate, setSelectedTemplate] = useState(templateIdFromUrl || '');
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const { data: templates, loading: templatesLoading, fetch: fetchTemplates } = useFetch<MaterialTemplate[]>('/material-template');
  const { data: classrooms, loading: classroomsLoading, fetch: fetchClassrooms } = useFetch<Classroom[]>('/classroom');
  const { fetch: assignMaterial, loading: assigning } = useFetch('/material-assignment');

  useEffect(() => {
    fetchTemplates({ name: 'GET' });
    fetchClassrooms({ name: 'GET' });
  }, [fetchTemplates, fetchClassrooms]);

  const selectedTemplateData = templates?.find(t => t.id === selectedTemplate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTemplate || selectedTemplate === 'loading' || selectedTemplate === 'no-templates') {
      toast.error('Por favor, selecione um modelo de material');
      return;
    }

    if (!selectedClassroom || selectedClassroom === 'loading') {
      toast.error('Por favor, selecione uma turma');
      return;
    }

    if (!expiresAt) {
      toast.error('Data de expiração é obrigatória');
      return;
    }

    const expirationDate = new Date(expiresAt);
    if (expirationDate <= new Date()) {
      toast.error('Data de expiração deve ser no futuro');
      return;
    }

    try {
      if (!user?.id) {
        toast.error('Usuário não encontrado. Faça login novamente.');
        return;
      }

      await assignMaterial({
        name: 'POST',
        body: {
          material_template_id: selectedTemplate,
          classroom_id: selectedClassroom,
          assigned_by: user.id,
          expires_at: expirationDate.toISOString(),
        },
      });

      toast.success('Material atribuído com sucesso!');
      navigate('/management/materials');
    } catch (error) {
      console.error('Error assigning material:', error);
      toast.error('Falha ao atribuir material. Tente novamente.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-lime-700/80">Atribuir Material</h1>
        <p className="text-gray-600 mt-2">
          Atribua materiais educacionais às suas turmas
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Material</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="template">Modelo de Material</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione um modelo de material" />
                </SelectTrigger>
                <SelectContent>
                  {templatesLoading ? (
                    <SelectItem value="loading" disabled>Carregando modelos...</SelectItem>
                  ) : templates?.length === 0 ? (
                    <SelectItem value="no-templates" disabled>Nenhum modelo disponível</SelectItem>
                  ) : (
                    templates?.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} ({template.material_type})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              
              {templates?.length === 0 && !templatesLoading && (
                <div className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/management/material-templates/create')}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Criar Modelo de Material
                  </Button>
                </div>
              )}
            </div>

            {selectedTemplateData && (
              <Card className="bg-gray-50">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">{selectedTemplateData.name}</h4>
                    <p className="text-sm text-gray-600">{selectedTemplateData.description}</p>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {selectedTemplateData.material_type}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(selectedTemplateData.url, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Visualizar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Atribuição</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="classroom">Turma</Label>
              <Select value={selectedClassroom} onValueChange={setSelectedClassroom}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent>
                  {classroomsLoading ? (
                    <SelectItem value="loading" disabled>Carregando turmas...</SelectItem>
                  ) : classrooms?.map((classroom) => (
                    <SelectItem key={classroom.id} value={classroom.id}>
                      {classroom.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="expiresAt">Data e Hora de Expiração</Label>
              <Input
                id="expiresAt"
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="mt-1"
                required
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Alunos podem acessar este material até esta data
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/management/materials')}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={assigning}>
            {assigning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Atribuindo...
              </>
            ) : (
              'Atribuir Material'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
