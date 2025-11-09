import { Card } from '@/components/ui/card'
import teacherImage from '@/assets/images/teacher-in-classroom.jpg';

export const TeacherImageRow = () => {
  return (
    <Card className="p-0 overflow-hidden max-h-[50vh]">
      <img src={teacherImage} alt="Professor em aula" className="w-full h-full object-cover object-center" />
    </Card>
  )
}
