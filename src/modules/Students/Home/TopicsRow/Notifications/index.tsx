import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useContext, useState } from 'react';
import { Loader2, CheckIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { NotificationContext } from '@/modules/Notifications/context/context';

export const Notifications = () => {
  const navigate = useNavigate();
  const [hoveredNotificationId, setHoveredNotificationId] = useState<string | null>(null);
  
  const { 
    notifications: notificationsData, 
    notificationsLoading,
    markNotificationsAsReadLoading,
    markNotificationAsRead,
  } = useContext(NotificationContext);

  return (
    <Card className="bg-yellow-900/90 border-none col-span-2 text-white flex flex-col gap-4">
      <CardHeader className="flex flex-col gap-2 items-center">
        <CardTitle>
          <h5 className="text-2xl font-black">Notificações</h5>
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent>
        {notificationsData?.length ? (
          <div className="flex flex-col gap-0">
            {notificationsData?.map((notification, i) => (
              <div 
                key={notification.id}
                className="flex flex-col gap-0"
                onMouseEnter={() => setHoveredNotificationId(notification.id)}
                onMouseLeave={() => setHoveredNotificationId(null)}
              >
                <div className="flex flex-row justify-between items-center hover:bg-yellow-900/80 rounded-md p-4">
                  <p 
                    className="text-sm font-bold cursor-pointer flex-1" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(notification.url);
                    }}
                  >
                    {notification.message}
                  </p>
                  {hoveredNotificationId === notification.id && (
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20 h-6 w-6 cursor-pointer items-center justify-center flex ml-2"
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
                  )}
                </div>
                {i < notificationsData?.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        ) : notificationsLoading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <p className="text-center text-white-500">Nenhuma notificação encontrada</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}