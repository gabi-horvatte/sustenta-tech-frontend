import { formatBirthDate } from '@/utils';
import { useLocation } from 'react-router';
import { useFetch } from '@/hooks/useFetch';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export const StudentHeader = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const name = searchParams.get('name');
  const birthDateParam = searchParams.get('birth_date');
  const birthDate = birthDateParam ? formatBirthDate(birthDateParam) : '-';
  const code = searchParams.get('code') ?? '-';
  const classroomId = searchParams.get('classroom_id') ?? '';

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
    
  useEffect(() => {
    fetchClassroom({
      name: 'GET',
    });
  }, [fetchClassroom]);

  return (
    <div className="grid grid-cols-1 grid-rows-2">
      <div className="flex flex-start">
      <h4 className="text-4xl font-bold text-lime-700/80">{name}</h4>
      </div>
      <div className="grid grid-cols-3">
        <div className="grid grid-cols-1 grid-rows-2 gap-0">
          <h5 className="text-xl font-bold text-yellow-900/80">Data de nascimento</h5>
          <p className="text-md text-gray-500">{birthDate}</p>
        </div>
        <div className="grid grid-cols-1 grid-rows-2 gap-0">
          <h5 className="text-xl font-bold text-yellow-900/80">Código</h5>
          <p className="text-md text-gray-500">{code}</p>
        </div>
        <div className="grid grid-cols-1 grid-rows-2 gap-0">
          <h5 className="text-xl font-bold text-yellow-900/80">Classe</h5>
          <p className="text-md text-gray-500">{classroomLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : classroomData?.name ?? '-'}</p>
        </div>
      </div>
    </div>
  )
}