import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useFetch } from '@/hooks/useFetch';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';

export const Notifications = () => {
  const navigate = useNavigate();
  
  const { data: notificationsData, loading: notificationsLoading, fetch: fetchNotifications } = useFetch<{
    id: string;
    account_id: string;
    message: string;
    url: string;
  }[]>(`/notification`);

  useEffect(() => {
    fetchNotifications({
      name: 'GET',
    });
  }, [fetchNotifications]);

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
              <div className="flex flex-col gap-0">
                <p 
                  className="text-sm font-bold hover:bg-yellow-900/80 rounded-md cursor-pointer p-4" 
                  key={notification.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(notification.url);
                  }}>{notification.message}                  
                </p>
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