import { StudentHeader } from './StudentHeader';
import { StudentMaterialAssignments } from './StudentMaterialAssignments';
import { StudentActivities } from './StudentActivities';
import { Separator } from '@/components/ui/separator';


export const Student = () => {
  return (
    <div className="max-w-[80vw] mx-auto flex flex-col gap-8 pt-8 pb-4 h-full">
      <div className="flex flex-col gap-6">
        <StudentHeader />
        <Separator />
      </div>
      <div className="flex flex-col gap-6">
        <StudentMaterialAssignments />
        <Separator />
      </div>
      <StudentActivities />
    </div>
  )
}