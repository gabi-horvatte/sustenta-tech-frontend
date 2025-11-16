import { Card } from '@/components/ui/card'
import teacherImage from '@/assets/images/teacher-in-classroom.jpg?format=webp';

export const TeacherImageRow = () => {
  return (
    <Card className="p-0 overflow-hidden max-h-[50vh]">
      <img 
        src={teacherImage} 
        alt="Professor em aula" 
        className="w-full h-full object-cover object-center" 
        fetchPriority="high"
        loading="eager"
        decoding="async"
        width={1920}
        height={1080}
      />
    </Card>
  )
}
