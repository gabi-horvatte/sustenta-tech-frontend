import { useState, useEffect } from 'react';
import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFetch } from '@/hooks/useFetch';
import { Loader2, FileText, Calendar, ExternalLink } from 'lucide-react';
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

type AssignMaterialModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  classroomId: string | null;
  classroomName: string | null;
  onSuccess?: () => void;
};

export const AssignMaterialModal = ({
  open,
  setOpen,
  classroomId,
  classroomName,
  onSuccess,
}: AssignMaterialModalProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<MaterialTemplate | null>(null);
  const [expiresAt, setExpiresAt] = useState('');

  const { data: templates, loading: templatesLoading, fetch: fetchTemplates } = useFetch<MaterialTemplate[]>('/material-template');
  const { fetch: createAssignment, loading: createLoading } = useFetch('/material-assignment');

  useEffect(() => {
    if (open) {
      fetchTemplates({ name: 'GET' });
    }
  }, [open, fetchTemplates]);

  const handleSubmit = async () => {
    if (!selectedTemplate || !classroomId || !expiresAt) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      await createAssignment({
        name: 'POST',
        body: {
          material_template_id: selectedTemplate.id,
          classroom_id: classroomId,
          expires_at: new Date(expiresAt).toISOString(),
        },
      });

      toast.success('Material atribuído com sucesso!');
      setOpen(false);
      resetForm();
      onSuccess?.();
    } catch (error) {
      toast.error('Erro ao atribuir material. Tente novamente.');
      console.error('Error creating material assignment:', error);
    }
  };

  const resetForm = () => {
    setSelectedTemplate(null);
    setExpiresAt('');
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const getMaterialTypeLabel = (type: string) => {
    switch (type) {
      case 'video': return 'Vídeo';
      case 'document': return 'Documento';
      case 'presentation': return 'Apresentação';
      case 'interactive': return 'Interativo';
      default: return 'Outro';
    }
  };

  const getMaterialTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'document': return 'bg-blue-100 text-blue-800';
      case 'presentation': return 'bg-orange-100 text-orange-800';
      case 'interactive': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Modal
      title={`Atribuir Material - ${classroomName || 'Turma'}`}
      open={open}
      onClose={handleClose}
      className="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Template Selection */}
        <div>
          <Label className="text-base font-semibold">Selecionar Modelo de Material</Label>
          <p className="text-sm text-gray-600 mb-4">Escolha um modelo de material para atribuir à turma</p>
          
          {templatesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
              {templates?.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'border-lime-500 bg-lime-50'
                      : 'hover:border-lime-300'
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          {template.name}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Por: {template.authors}
                        </CardDescription>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getMaterialTypeColor(template.material_type)}`}>
                        {getMaterialTypeLabel(template.material_type)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {template.description}
                    </p>
                    {template.url && (
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate">Link disponível</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Material Details */}
        {selectedTemplate && (
          <div className="space-y-4 border-t pt-6">
            <Label className="text-base font-semibold">Detalhes da Atribuição</Label>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Material Selecionado:</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Nome:</span> {selectedTemplate.name}</p>
                <p><span className="font-medium">Autores:</span> {selectedTemplate.authors}</p>
                <p><span className="font-medium">Tipo:</span> {getMaterialTypeLabel(selectedTemplate.material_type)}</p>
                <p><span className="font-medium">Descrição:</span> {selectedTemplate.description}</p>
              </div>
            </div>

            <div>
              <Label htmlFor="expires-at">Data de Expiração *</Label>
              <Input
                id="expires-at"
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="mt-1"
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Data limite para os alunos acessarem este material
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 border-t pt-6">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedTemplate || !expiresAt || createLoading}
            className="bg-lime-600 hover:bg-lime-700"
          >
            {createLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Atribuindo...
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                Atribuir Material
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
