import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFetch } from '@/hooks/useFetch';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { Loader2 } from 'lucide-react';

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

export const EditMaterialTemplate = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [authors, setAuthors] = useState('');
  const [url, setUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [materialType, setMaterialType] = useState('video');

  const { data: template, loading: loadingTemplate, error: templateError, fetch: fetchTemplate } = useFetch<MaterialTemplate>(`/material-template/${id}`);
  const { fetch: updateTemplate, loading: updating } = useFetch(`/material-template/${id}`);

  useEffect(() => {
    if (id) {
      fetchTemplate({ name: 'GET' });
    }
  }, [id, fetchTemplate]);

  useEffect(() => {
    if (template) {
      setName(template.name);
      setDescription(template.description);
      setAuthors(template.authors);
      setUrl(template.url);
      setThumbnail(template.thumbnail || '');
      setMaterialType(template.material_type);
    }
  }, [template]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Nome do material é obrigatório');
      return;
    }

    if (!description.trim()) {
      toast.error('Descrição do material é obrigatória');
      return;
    }

    if (!authors.trim()) {
      toast.error('Autores são obrigatórios');
      return;
    }

    if (!url.trim()) {
      toast.error('Link do material é obrigatório');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast.error('Por favor, insira um link válido');
      return;
    }

    // Validate thumbnail URL if provided
    if (thumbnail.trim()) {
      try {
        new URL(thumbnail);
      } catch {
        toast.error('Por favor, insira um link válido para a miniatura');
        return;
      }
    }

    try {
      await updateTemplate({
        name: 'PUT',
        body: {
          name: name.trim(),
          description: description.trim(),
          authors: authors.trim(),
          url: url.trim(),
          thumbnail: thumbnail.trim() || undefined,
          material_type: materialType,
        },
      });

      toast.success('Modelo de material atualizado com sucesso!');
      navigate('/management/materials');
    } catch (error) {
      console.error('Error updating material template:', error);
      toast.error('Falha ao atualizar modelo de material. Tente novamente.');
    }
  };

  if (loadingTemplate) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (templateError) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Erro ao carregar modelo de material. Tente novamente mais tarde.</p>
        <Button
          variant="outline"
          onClick={() => navigate('/management/materials')}
          className="mt-4 cursor-pointer"
        >
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-lime-700/80">Editar Modelo de Material</h1>
        <p className="text-gray-600 mt-2">
          Atualize as informações do material educacional
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Material</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Material</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o nome do material..."
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Digite a descrição do material..."
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="authors">Autores</Label>
              <Input
                id="authors"
                value={authors}
                onChange={(e) => setAuthors(e.target.value)}
                placeholder="Digite os autores do material..."
                className="mt-1"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Nomes dos autores ou criadores do material
              </p>
            </div>

            <div>
              <Label htmlFor="materialType">Tipo de Material</Label>
              <Select value={materialType} onValueChange={setMaterialType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="document">Documento</SelectItem>
                  <SelectItem value="presentation">Apresentação</SelectItem>
                  <SelectItem value="interactive">Conteúdo Interativo</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="url">Link do Material</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://exemplo.com/material"
                className="mt-1"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Link para o material educacional (YouTube, Google Drive, etc.)
              </p>
            </div>

            <div>
              <Label htmlFor="thumbnail">Link da Miniatura (Opcional)</Label>
              <Input
                id="thumbnail"
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://exemplo.com/miniatura.jpg"
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Imagem opcional para exibir como visualização
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/management/materials')}
            className="cursor-pointer"
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={updating} className="cursor-pointer">
            {updating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Atualizando...
              </>
            ) : (
              'Atualizar Modelo de Material'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};



