import { useFetch } from '@/hooks/useFetch';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { Material } from './Material';
import { materialsContent } from '@/materials';

export const StudentMaterials = () => {
  const {
    data: materialsData,
    // error: materialsError,
    loading: materialsLoading,
    fetch: fetchMaterials
  } = useFetch<{
    id: string;
    student_id: string;
    created_at: string;
    updated_at: string;
  }[]>(`/material`);

  useEffect(() => {
    fetchMaterials({
      name: 'GET',
    });
  }, [fetchMaterials]);

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
          </div>) : (
            <div className="grid grid-cols-3 gap-4">
              {/** a card with two buttons: one to open an external link to go to the activity, another to mark the activity as concluded if it's not concluded yet. it should have a green background if it's concluded and red background if it's not concluded. it should have a check mark if it's concluded and a clock icon if it's not concldued yet */}
              {materialsContent.map((material) => {
                const materialAssignment = materialsData?.find((materialAssignment) => materialAssignment.id === material.id);
                return (
                  <Material key={material.id} materialAssignment={{
                    id: material.id,
                    type: material.type,
                    thumbnail: material.thumbnail,
                    title: material.title,
                    description: material.description,
                    url: material.url,
                    completed_at: materialAssignment?.created_at ?? null,
                  }} />
                )
              })}
            </div>
          )
      }
    </div>
  )
}