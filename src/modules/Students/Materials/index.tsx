import { useFetch } from '@/hooks/useFetch';
import { Loader2 } from 'lucide-react';
import { useEffect, useContext } from 'react';
import { Material } from './Material';
import { IAMContext } from '@/modules/IAM/context/context';

type StudentMaterial = {
  assignment_id: string;
  material_id: string;
  name: string;
  description: string;
  authors: string;
  url: string;
  thumbnail: string | null;
  material_type: string;
  expires_at: string;
  completed_at: string | null;
};

export const StudentMaterials = () => {
  const { user } = useContext(IAMContext);
  const {
    data: materialsData,
    loading: materialsLoading,
    fetch: fetchMaterials
  } = useFetch<StudentMaterial[]>(`/student-materials`);

  useEffect(() => {
    if (user?.id) {
      fetchMaterials({
        name: 'GET',
        url: `/student-materials?student_id=${user.id}`,
      });
    }
  }, [fetchMaterials, user?.id]);

  return (
    <div className="max-w-[50vw] mx-auto flex flex-col gap-8 pt-8 pb-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-bold text-center text-lime-700/80">Painel do aluno</h1>
        <h5 className="text-xl font-bold text-center text-yellow-900/80">Materiais educativos</h5>
      </div>
      {
        materialsLoading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : materialsData && materialsData.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {materialsData.map((material) => (
              <Material
                key={material.assignment_id}
                materialAssignment={{
                  id: material.assignment_id,
                  type: material.material_type,
                  thumbnail: material.thumbnail ?? '',
                  title: material.name,
                  description: material.description,
                  url: material.url,
                  completed_at: material.completed_at ?? null,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Nenhum material encontrado</p>
          </div>
        )
      }
    </div>
  )
}