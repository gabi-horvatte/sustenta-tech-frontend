import { AccountHeader } from './AccountHeader';
import { AccountInfo } from './AccountInfo';
import childrenImage from '@/assets/images/children-background.png?format=webp';


export const Account = () => {
  return (
    <div className="h-full w-full relative">
    <div 
      className="h-full w-full object-cover object-center"
      style={{ 
        backgroundImage: `url(${childrenImage})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.5,
        position: 'absolute',
        zIndex: -10
      }}></div>
    <div className="max-w-[50vw] mx-auto flex flex-col gap-8 pt-8 pb-4 h-full">
        <AccountHeader />
        <AccountInfo />
    </div>
    </div>
  )
}