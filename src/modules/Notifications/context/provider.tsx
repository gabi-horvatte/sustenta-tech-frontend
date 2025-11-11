import { useCallback, useContext, useEffect, useState } from 'react';
import { NotificationContext, type Notification } from './context';
import { useFetch } from '@/hooks/useFetch';
import { toast } from 'sonner';
import { IAMContext } from '@/modules/IAM/context/context';

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notificationsLength, setNotificationsLength] = useState(0);
  const [notificationsInterval, setNotificationsInterval] = useState<NodeJS.Timeout | null>(null);
  const { authToken } = useContext(IAMContext);

  const { data: notificationsData, loading: notificationsLoading, fetch: fetchNotifications } = useFetch<Notification[]>(`/notification`);

  const { fetch: markNotificationsAsRead, loading: markNotificationsAsReadLoading } = useFetch(`/notification/mark-as-read`);

  const fetchNotificationsCallback = useCallback(() => {
    fetchNotifications({
      name: 'GET',
    });
  }, [fetchNotifications]);

  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      await markNotificationsAsRead({
        name: 'POST',
        body: {
          ids: [notificationId]
        }
      });
      toast.success('Notificação marcada como lida');
      fetchNotificationsCallback();
    } catch (error) {
      console.error('Erro ao marcar notificação como completa', error);
      toast.error('Erro ao marcar notificação como lida');
    }
  }, [markNotificationsAsRead, fetchNotificationsCallback]);

  // Initial fetch
  useEffect(() => {
    if (!authToken) return;
    fetchNotificationsCallback();
  }, [fetchNotificationsCallback, authToken]);

  // Interval polling every 10 seconds
  useEffect(() => {
    if (!authToken) return;
    const interval = setInterval(() => {
      fetchNotificationsCallback();
    }, 10000);
    setNotificationsInterval(interval);

    return () => clearInterval(interval);
  }, [fetchNotificationsCallback, authToken]);

  // Update notifications length
  useEffect(() => {
    setNotificationsLength((prev) => {
      if(notificationsData?.length === undefined || notificationsData?.length === null) return prev;
      return notificationsData?.length ?? 0;
    });
  }, [notificationsData?.length]);

  useEffect(() => {
    if (!authToken && notificationsInterval) {
      clearInterval(notificationsInterval);
      setNotificationsInterval(null);
    }
  }, [authToken, notificationsInterval]);

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications: notificationsData ?? undefined,
        notificationsLoading,
        notificationsLength,
        markNotificationsAsReadLoading,
        fetchNotifications: fetchNotificationsCallback,
        markNotificationAsRead,
      }}>
      {children}
    </NotificationContext.Provider>
  );
};

