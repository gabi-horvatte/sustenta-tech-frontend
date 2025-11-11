import React from 'react';

export type Notification = {
  id: string;
  account_id: string;
  message: string;
  url: string;
  created_at?: string;
};

type NotificationContextType = {
  notifications: Notification[] | undefined;
  notificationsLoading: boolean;
  notificationsLength: number;
  markNotificationsAsReadLoading: boolean;
  fetchNotifications: () => void;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
};

export const NotificationContext = React.createContext<NotificationContextType>({
  notifications: undefined,
  notificationsLoading: false,
  notificationsLength: 0,
  markNotificationsAsReadLoading: false,
  fetchNotifications: () => {},
  markNotificationAsRead: async () => {},
});

