import { AddTeacherButton } from './AddTeacherButton';
import { TeacherImageRow } from './TeacherImageRow';
import { TopicsRow } from './TopicsRow';


export const Home = () => {
  return (
    <div className="max-w-[40vw] mx-auto flex flex-col gap-8 pt-8 pb-4">
      <div className="flex flex-col gap-8">
        <h1 className="text-5xl font-bold text-center text-lime-700/80">Painel do professor</h1>
        <TeacherImageRow />
      </div>
      <div className="flex flex-col gap-4">
        <TopicsRow />
        <AddTeacherButton />
      </div>
    </div>
  );
};