import { formatDateString } from '@/utils';
import { IAMContext } from '../../context/context';
import { useContext } from 'react';

export const AccountInfo = () => {
  const { user } = useContext(IAMContext);

  return (
    <div className="">
      <div className="flex flex-col gap-8">
        <h2 className="text-3xl font-black text-yellow-900/80 text-center">Dados da conta</h2>
        <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 grid-rows-2 gap-0">
          <h5 className="text-xl font-bold text-yellow-900/80">Nome completo</h5>
          <p className="text-md text-gray-500">{user?.name} {user?.last_name}</p>
        </div>
        <div className="grid grid-cols-1 grid-rows-2 gap-0">
          <h5 className="text-xl font-bold text-yellow-900/80">Data de nascimento</h5>
          <p className="text-md text-gray-500">{formatDateString(user?.birth_date ?? '')}</p>
        </div>
        <div className="grid grid-cols-1 grid-rows-2 gap-0">
          <h5 className="text-xl font-bold text-yellow-900/80">Email</h5>
          <p className="text-md text-gray-500">{user?.email}</p>
        </div>
        <div className="grid grid-cols-1 grid-rows-2 gap-0">
          <h5 className="text-xl font-bold text-yellow-900/80">Telefone</h5>
          <p className="text-md text-gray-500">{user?.phone}</p>
        </div>
        {user?.role === 'STUDENT' && (
          <div className="grid grid-cols-1 grid-rows-2 gap-0">
            <h5 className="text-xl font-bold text-yellow-900/80">Código</h5>
            <p className="text-md text-gray-500">{user?.code ?? '-'}</p>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}