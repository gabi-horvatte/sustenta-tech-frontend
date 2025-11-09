import { TeacherImageRow } from './TeacherImageRow';
import { TopicsRow } from './TopicsRow';

import childrenImage from '@/assets/images/children-background.png';

export const StudentHome = () => {
  return (
    <div id="student-home" className="h-full flex flex-col">
    <div style={{ backgroundImage: `url(${childrenImage})` }} className="bg-white">
      <div className="max-w-[50vw] mx-auto flex flex-col gap-8 pt-8 pb-8">
        <div className="flex flex-col gap-8">
          <h1 className="text-5xl font-bold text-center text-lime-700/80">Painel do aluno</h1>
          <TeacherImageRow />
        </div>
    </div>
    </div>
    <div className="pt-6 pb-8 h-full bg-lime-700/50">
      <div className="mx-auto max-w-[50vw] flex flex-col gap-4 h-full">
        <TopicsRow />
      </div>
      </div>
    </div>
  );
};