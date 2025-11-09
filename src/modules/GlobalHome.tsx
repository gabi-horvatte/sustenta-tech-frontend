import { useContext } from 'react'
import { IAMContext } from './IAM/context/context'
import { StudentHome } from './Students/Home';
import { Home } from './Management/Home';

export const GlobalHome = () => {
  const { user } = useContext(IAMContext);
  
  if (user?.role === 'TEACHER') {
    return <Home />
  } else {
    return <StudentHome />
  }
}