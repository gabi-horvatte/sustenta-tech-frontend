import { Card, CardContent } from '@/components/ui/card'
import classroomIcon from '@/assets/images/classroom-icon.png';
import { useNavigate } from 'react-router';

export const TopicsRow = () => {
  const navigate = useNavigate();
  return (
      <section id="management-home-cards-section" className="flex flex-row full-width justify-between">
        <Card className="py-[2vh] items-center gap-2 bg-lime-700/80 px-[2.5vw] cursor-pointer hover:bg-lime-700/95 transition-all duration-150" onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate('/management/classroom');
          console.log('clicked');
          }}>
          <div>
            <img src={classroomIcon} alt="Turmas" className="w-15 h-15" />
          </div>
          <CardContent className="text-white">Turmas</CardContent>
        </Card>
        <Card 
        className="py-[2vh] items-center gap-2 bg-lime-700/80 px-[2.5vw] cursor-pointer hover:bg-lime-700/95 transition-all duration-150"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate('/management/activities');
          console.log('clicked');
        }}
        >
          <div>
            <img src={classroomIcon} alt="Atividades" className="w-15 h-15" />
          </div>
          <CardContent className="text-white">Atividades</CardContent>
        </Card>
        <Card className="py-[2vh] items-center gap-2 bg-lime-700/80 px-[2.5vw] hover:bg-lime-700/95 cursor-pointer transition-all duration-150" onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate('/management/materials');
        }}>
          <div>
            <img src={classroomIcon} alt="Materiais" className="w-15 h-15" />
          </div>
          <CardContent className="text-white">Materiais</CardContent>
        </Card>
      </section>
  )
}