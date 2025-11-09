import { Button } from '@/components/ui/button'

type AddStudentButtonProps = {
  setOpen: (open: boolean) => void;
  setClassroomId: (classroomId: string) => void;
  classroomId: string;
}

export const AddStudentButton = ({ setOpen, setClassroomId, classroomId }: AddStudentButtonProps) => {

  const handleAddStudent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
    setClassroomId(classroomId);
  }

  return (
    <Button
      className="
          bg-lime-700/80 
          text-white border-none rounded-none hover:bg-lime-800/100 cursor-pointer w-full rounded-b-md"
      onClick={(e) => {
        handleAddStudent(e);
      }}
    >
      + Alunos
    </Button>

  )
}