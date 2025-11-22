import { formatDateString } from '@/utils';
import { useLocation, useParams, useNavigate } from 'react-router';
import { useFetch } from '@/hooks/useFetch';
import { useEffect, useState } from 'react';
import { Loader2, Edit, Check, X, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type Classroom = {
  id: string;
  name: string;
  description: string;
};

export const StudentHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();
  const searchParams = new URLSearchParams(location.search);

  const firstName = searchParams.get('first_name');
  const lastName = searchParams.get('last_name');
  const birthDateParam = searchParams.get('birth_date');
  const birthDate = birthDateParam ? formatDateString(birthDateParam) : '-';
  const code = searchParams.get('code') ?? '-';
  const classroomId = searchParams.get('classroom_id') ?? '';
  const email = searchParams.get('email') ?? '';
  const phone = searchParams.get('phone') ?? '';

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: firstName || '',
    last_name: lastName,
    email: email,
    phone: phone,
    birth_date: birthDateParam ? birthDateParam.split('T')[0] : '',
    code: code,
    classroom_id: classroomId,
  });

  console.log(editData);

  const {
    data: classroomData,
    loading: classroomLoading,
    fetch: fetchClassroom
  } = useFetch<{
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  }>(`/classroom/${classroomId}`);

  const {
    data: classrooms,
    loading: classroomsLoading,
    fetch: fetchClassrooms
  } = useFetch<Classroom[]>('/classroom');

  const { fetch: updateStudent, loading: updating } = useFetch(`/student/${studentId}`);
  const { fetch: deleteStudent, loading: deleting } = useFetch('/student');

  useEffect(() => {
    if (classroomId) {
      fetchClassroom({
        name: 'GET',
      });
    }
  }, [fetchClassroom, classroomId]);

  useEffect(() => {
    if (isEditing) {
      fetchClassrooms({
        name: 'GET',
      });
    }
  }, [fetchClassrooms, isEditing]);

  const handleEdit = () => {
    setEditData({
      name: firstName || '',
      last_name: lastName,
      email: email,
      phone: phone,
      birth_date: birthDateParam ? birthDateParam.split('T')[0] : '',
      code: code,
      classroom_id: classroomId,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editData.name.trim() || !editData.email.trim() || !editData.code.trim() || !editData.classroom_id) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (!editData.birth_date) {
      toast.error('Data de nascimento é obrigatória');
      return;
    }

    try {
      await updateStudent({
        name: 'PUT',
        body: {
          name: editData.name.trim(),
          last_name: editData.last_name?.trim() ?? '',
          email: editData.email.trim(),
          phone: editData.phone.trim(),
          birth_date: editData.birth_date ? new Date(editData.birth_date).toISOString().split('T')[0] : undefined,
          code: editData.code.trim(),
          classroom_id: editData.classroom_id,
        },
      });


      toast.success('Estudante atualizado com sucesso!');
      setIsEditing(false);

      // Navigate to updated URL to refresh the component with new data
      const newSearchParams = new URLSearchParams();
      newSearchParams.set('first_name', editData.name.trim());
      newSearchParams.set('last_name', editData.last_name?.trim() ?? '');
      newSearchParams.set('birth_date', editData.birth_date);
      newSearchParams.set('code', editData.code.trim());
      newSearchParams.set('classroom_id', editData.classroom_id);
      newSearchParams.set('email', editData.email.trim());
      newSearchParams.set('phone', editData.phone.trim());

      navigate(`/management/classroom/student/${studentId}?${newSearchParams.toString()}`, { replace: true });
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Falha ao atualizar estudante. Tente novamente.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este estudante? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await deleteStudent({
        name: 'DELETE',
        id: studentId!,
      });

      toast.success('Estudante excluído com sucesso!');
      navigate('/management/classroom');
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Falha ao excluir estudante. Tente novamente.');
    }
  };

  return (
    <div className="grid grid-cols-1 grid-rows-2">
      <div className="flex items-center justify-between">
        <h4 className="text-4xl font-bold text-lime-700/80">
          {isEditing ? (
            <div className="flex gap-2">
              <Input
                value={editData.name}
                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome"
                className="text-4xl font-bold text-lime-700/80 border-lime-700/80"
              />
              <Input
                value={editData.last_name ?? ''}
                onChange={(e) => setEditData(prev => ({ ...prev, last_name: e.target.value }))}
                placeholder="Sobrenome"
                className="text-4xl font-bold text-lime-700/80 border-lime-700/80"
              />
            </div>
          ) : (
            `${firstName} ${lastName}`.trim()
          )}
        </h4>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                disabled={updating}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              </Button>
              <Button
                onClick={handleCancel}
                disabled={updating}
                variant="outline"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleEdit}
                variant="outline"
                size="sm"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="grid grid-cols-1 grid-rows-2 gap-0">
          <h5 className="text-xl font-bold text-yellow-900/80">Email</h5>
          {isEditing ? (
            <Input
              value={editData.email}
              onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Email"
              type="email"
              className="mt-1"
            />
          ) : (
            <p className="text-md text-gray-500">{email}</p>
          )}
        </div>
        <div className="grid grid-cols-1 grid-rows-2 gap-0">
          <h5 className="text-xl font-bold text-yellow-900/80">Data de nascimento</h5>
          {isEditing ? (
            <Input
              value={editData.birth_date}
              onChange={(e) => setEditData(prev => ({ ...prev, birth_date: e.target.value }))}
              placeholder="Data de nascimento"
              type="date"
              className="mt-1"
            />
          ) : (
            <p className="text-md text-gray-500">{birthDate}</p>
          )}
        </div>
        <div className="grid grid-cols-1 grid-rows-2 gap-0">
          <h5 className="text-xl font-bold text-yellow-900/80">Código</h5>
          {isEditing ? (
            <Input
              value={editData.code}
              onChange={(e) => setEditData(prev => ({ ...prev, code: e.target.value }))}
              placeholder="Código"
              className="mt-1"
            />
          ) : (
            <p className="text-md text-gray-500">{code}</p>
          )}
        </div>

        <div className="grid grid-cols-1 grid-rows-2 gap-0">
          <h5 className="text-xl font-bold text-yellow-900/80">Classe</h5>
          {isEditing ? (
            // <></>
            <Select
              value={editData.classroom_id}
              onValueChange={(value) => setEditData(prev => ({ ...prev, classroom_id: value }))}
            >
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
          ) : (
            <p className="text-md text-gray-500">
              {classroomLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : classroomData?.name ?? '-'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};