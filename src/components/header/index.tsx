import { useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { BellIcon, UserRoundIcon, CheckIcon, Loader2 } from 'lucide-react';
import { useContext, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { IAMContext } from '@/modules/IAM/context/context';
import { NotificationContext } from '@/modules/Notifications/context/context';
import { Separator } from '../ui/separator';
import { formatDateString } from '@/utils';

export const Header = () => {
  const navigate = useNavigate();
  const [userProfileDialogOpen, setUserProfileDialogOpen] = useState(false);
  const [notificationsDialogOpen, setNotificationsDialogOpen] = useState(false);
  const [hoveredNotificationId, setHoveredNotificationId] = useState<string | null>(null);

  const { user, logout } = useContext(IAMContext);
  const { 
    notifications: notificationsData, 
    notificationsLength,
    markNotificationsAsReadLoading,
    fetchNotifications,
    markNotificationAsRead,
  } = useContext(NotificationContext);

  return (
    <>
      {(notificationsDialogOpen || userProfileDialogOpen) && (
        <div className="fixed inset-0 bg-black/50 z-10 transition-all duration-150" onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          fetchNotifications();
          setNotificationsDialogOpen(false);
          setUserProfileDialogOpen(false);
        }}></div>
      )}
      <div className="flex flex-row w-full bg-lime-700/80 py-3 px-10 flex justify-between">
        <h1 className="text-2xl font-bold text-left text-white cursor-pointer" onClick={() => {
          if (user?.role === 'TEACHER') {
            navigate('/management/home');
          } else {
            navigate('/student/home');
          }
        }}>SustentaTech</h1>
        <div className="flex flex-row gap-4">
          <div
            className="flex flex-row gap-4 items-center rounded-md cursor-pointer relative"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setUserProfileDialogOpen((prev) => !prev);
            }}
          >
            <p className="text-white text-sm">
              Bem vindo, {
                user?.name
                  ? user.name
                  : user?.role === 'TEACHER'
                    ? 'professor'
                    : user?.role === 'STUDENT'
                      ? 'aluno'
                      : '...'
              }!
            </p>
            <div className="bg-blue-500 rounded-full p-1 w-8 h-8 flex items-center justify-center">
              <UserRoundIcon className="w-4 h-4 text-white" />
            </div>
            <AnimatePresence>
              {userProfileDialogOpen && (
                <motion.div
                  className="w-[15vw] absolute top-8 right-6 z-10 border-none"
                  initial={{ opacity: 0, scale: 0.96, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }}
                  exit={{ opacity: 0, scale: 0.98, y: 4, transition: { duration: 0.14 } }}
                >
                  <Card className="bg-lime-800/100 rounded-sm p-2 text-white border-none flex flex-col gap-0">
                    <CardHeader className="flex flex-col gap-1 items-start py-2 px-0">
                      <div className="px-3">
                        <CardTitle className="text-xl font-bold">{user?.name} {user?.last_name}</CardTitle>
                        <h6 className="text-sm text-white/80 italic">Instituição de ensino</h6>
                      </div>
                      <Separator />
                    </CardHeader>
                    <CardContent className="px-0 pl-2 flex flex-col gap-1">
                      <p className="text-sm underline underline-offset-2 cursor-pointer" onClick={() => navigate('/account')}>
                        Conta
                      </p>
                      <p className="text-sm underline underline-offset-2 cursor-pointer" onClick={logout}>
                        Desconectar
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="relative">
            {notificationsLength > 0 && (
              <div className="absolute top-[-0.3rem] right-[-0.3rem] w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <p className="text-xs text-white">{notificationsLength}</p>
              </div>
            )}
          <Button variant="outline" size="icon" className={`cursor-pointer w-8 h-8 transition-all duration-150 ${notificationsLength > 0 ? 'bg-yellow-900/70 hover:bg-yellow-900/90' : 'bg-white hover:bg-white'}`} onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setNotificationsDialogOpen((prev) => !prev);
            }}
          >
            <BellIcon className={`size-4 ${notificationsLength > 0 ? 'text-white' : 'text-lime-700/80'} transition-all duration-150`} />
          </Button>
          </div>
          <AnimatePresence>
            {notificationsDialogOpen && (
              <>
                <motion.div
                  className="w-[15vw] absolute top-8 right-20 z-10 border-none"
                  initial={{ opacity: 0, scale: 0.96, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }}
                  exit={{ opacity: 0, scale: 0.98, y: 4, transition: { duration: 0.14 } }}
                >
                  <Card className="bg-lime-800/100 rounded-sm p-0 text-white border-none flex flex-col gap-0 pt-4">
                    <CardHeader className="flex flex-col gap-2 items-center">
                      <CardTitle>Notificações</CardTitle>
                      <Separator className="bg-white/60" />
                    </CardHeader>
                    <CardContent>
                      {notificationsData?.length ? (
                        <div className="flex flex-col gap-0">
                          {notificationsData?.map((notification, i) => (
                            <div 
                              key={notification.id}
                              className="hover:bg-yellow-900/80 rounded-md cursor-pointer flex flex-col gap-4 pt-4 px-2 transition-all duration-150"
                              onMouseEnter={() => setHoveredNotificationId(notification.id)}
                              onMouseLeave={() => setHoveredNotificationId(null)}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate(notification.url);
                                setNotificationsDialogOpen(false);
                                setUserProfileDialogOpen(false);
                              }}
                            >
                            <div className="flex flex-row justify-between items-center">
                              <div className="max-w-[60%]">
                              <p className="text-sm">{notification.message}</p>
                              </div>
                              {hoveredNotificationId === notification.id ? (
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  className="text-white hover:bg-white/20 h-6 w-6 cursor-pointer items-center justify-center flex mr-3"
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    await markNotificationAsRead(notification.id);
                                  }}
                                >
                                  {markNotificationsAsReadLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <CheckIcon className="w-4 h-4" />
                                  )}
                                </Button>
                              ) : (
                                <p className="text-sm text-white/60 items-center flex">{formatDateString(notification.created_at || '')}</p>
                              )}
                            </div>
                              {i < notificationsData?.length - 1 && <Separator />}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-white/60 p-4">Nenhuma notificação encontrada</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}