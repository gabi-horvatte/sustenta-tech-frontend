import { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFetch } from '@/hooks/useFetch';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import { IAMContext } from '@/modules/IAM/context/context';

export const CreateMaterialTemplate = () => {
  const navigate = useNavigate();
  const { user } = useContext(IAMContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [authors, setAuthors] = useState('');
  const [url, setUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [materialType, setMaterialType] = useState('video');

  const { fetch: createTemplate, loading: creating } = useFetch('/material-template');

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
      if (!user?.id) {
        toast.error('Usuário não encontrado. Faça login novamente.');
        return;
      }

      await createTemplate({
        name: 'POST',
        body: {
          name: name.trim(),
          description: description.trim(),
          authors: authors.trim(),
          url: url.trim(),
          thumbnail: thumbnail.trim() || undefined,
          material_type: materialType,
          created_by: user.id,
        },
      });

      toast.success('Modelo de material criado com sucesso!');
      navigate('/management/materials');
    } catch (error) {
      console.error('Error creating material template:', error);
      toast.error('Falha ao criar modelo de material. Tente novamente.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-lime-700/80">Criar Modelo de Material</h1>
        <p className="text-gray-600 mt-2">
          Crie um material educacional reutilizável que pode ser atribuído a qualquer turma
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
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={creating}>
            {creating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar Modelo de Material'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

