import { Card, CardContent } from '@/components/ui/card'
import classroomIcon from '@/assets/images/classroom-icon.png';
import { useNavigate } from 'react-router';
import { Notifications } from './Notifications';

export const TopicsRow = () => {
  const navigate = useNavigate();
  
  return (
      <section id="management-home-cards-section" className="grid grid-cols-3 gap-12 full-width justify-between">
        <div className="flex flex-col gap-4">
        <Card className="py-[2vh] items-center gap-2 bg-white px-[2.5vw] cursor-pointer hover:bg-lime-700/95 transition-all duration-150" onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate('/students/activities');
          console.log('clicked');
          }}>
          <div>
            <img src={classroomIcon} alt="Turmas" className="w-15 h-15" />
          </div>
          <CardContent className="text-lg font-bold text-lime-700/80">Atividades</CardContent>
        </Card>
        <Card 
        className="py-[2vh] items-center gap-2 bg-white px-[2.5vw] cursor-pointer hover:bg-lime-700/95 transition-all duration-150"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate('/students/materials');
          console.log('clicked');
        }}
        >
          <div>
            <img src={classroomIcon} alt="Atividades" className="w-15 h-15" />
          </div>
          <CardContent className="text-lg font-bold text-lime-700/80">Materiais</CardContent>
        </Card>
        </div>
        <Notifications />
      </section>
  )
}