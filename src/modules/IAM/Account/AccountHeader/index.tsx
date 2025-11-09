import { useContext } from 'react';
import { IAMContext } from '../../context/context';
import { Separator } from '@/components/ui/separator';

export const AccountHeader = () => {
  const { user } = useContext(IAMContext);

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-4xl font-bold text-lime-700/80">{user?.name} {user?.last_name}</h4>
      <Separator />
    </div>
  )
}