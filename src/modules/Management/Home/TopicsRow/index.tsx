import { Card, CardContent } from '@/components/ui/card'
import ClassroomIcon from '@/assets/images/classroom.svg?react';
import { useNavigate } from 'react-router';
import ActivityIcon from '@/assets/images/assignment.svg?react';
import MaterialsIcon from '@/assets/images/materials.svg?react';

export const TopicsRow = () => {
  const navigate = useNavigate();
  return (
      <section id="management-home-cards-section" className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 w-full">
        <Card className="py-[2vh] items-center gap-2 bg-lime-700/80 px-[2.5vw] cursor-pointer hover:bg-lime-700/95 transition-all duration-150" onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate('/management/classroom');
          console.log('clicked');
          }}>
          <div>
            <ClassroomIcon className="w-15 h-15 fill-white" />
          </div>
          <CardContent className="text-white">Turmas</CardContent>
        </Card>
        <Card 
        className="py-[2vh] items-center gap-2 bg-lime-700/80 px-[2.5vw] cursor-pointer hover:bg-lime-700/95 transition-all duration-150"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate('/management/activities');
        }}
        >
          <div>
            <ActivityIcon className="w-15 h-15 fill-white" />
          </div>
          <CardContent className="text-white">Atividades</CardContent>
        </Card>
        <Card className="py-[2vh] items-center gap-2 bg-lime-700/80 px-[2.5vw] hover:bg-lime-700/95 cursor-pointer transition-all duration-150" onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate('/management/materials');
        }}>
          <div>
            <MaterialsIcon className="w-15 h-15 fill-white" />
          </div>
          <CardContent className="text-white">Materiais</CardContent>
        </Card>
      </section>
  )
}