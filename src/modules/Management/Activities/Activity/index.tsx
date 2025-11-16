import { useFetch } from '@/hooks/useFetch';
import { formatDateTimeString } from '@/utils';
import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router';

export const Activity = () => {
  const { activityId } = useParams();
  const [searchParams] = useSearchParams();

  const name = searchParams.get('name');
  const description = searchParams.get('description');
  // const classroomName = searchParams.get('classroom_name');
  // const createdAt = searchParams.get('created_at');
  // const updatedAt = searchParams.get('updated_at');
  // const expiresAt = searchParams.get('expires_at');

  const { data: activityData,
    // , error: activityError, loading: activityLoading,
     fetch: fetchActivity } = useFetch<{
    activity_id: string;
    student_id: string;
    completed_at: string | null;
    student_name: string;
  }[]>(`/activity_student/${activityId}`);

  useEffect(() => {
    fetchActivity({
      name: 'GET',
    });
  }, [fetchActivity]);

  return (
    <div className="max-w-[40vw] mx-auto flex flex-col gap-8 pt-8 pb-0">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-bold text-center text-lime-700/80">{name}</h1>
        <h5 className="text-xl font-bold text-center text-yellow-900/80">{description}</h5>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left text-lime-700/80">Alunos:</th>
            <th className="text-right text-lime-700/80">Concluído em:</th>
          </tr>
        </thead>
        <tbody className="w-full">
          {activityData?.map((activityStudent) => (
            <tr key={activityStudent.student_id} className="w-full">
              <td className="text-left text-yellow-900/80">{activityStudent.student_name}</td>
              <td className="text-right text-yellow-900/80">
                {activityStudent.completed_at ? formatDateTimeString(activityStudent.completed_at) : 'Não concluído'}
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}