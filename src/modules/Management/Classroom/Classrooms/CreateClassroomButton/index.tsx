import React from 'react';

type CreateClassroomButtonProps = {
  setOpen: (open: boolean) => void;
}

export const CreateClassroomButton = ({ setOpen }: CreateClassroomButtonProps) => {
  const handleCreateClassroomButtonClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  }  

  return (
    <h4 
      className="text-center font-bold text-blue-700/80 cursor-pointer hover:text-blue-700/90 underline"
      onClick={handleCreateClassroomButtonClick}
    >
      Crie uma nova turma agora!
    </h4> 
  )
}