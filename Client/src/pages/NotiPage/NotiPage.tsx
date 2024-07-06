import React, { useEffect } from 'react';
import Notification from './Notification';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

type Notification = {
  doc_id?: string;
  from: string;
  to: string;
  message: string;
  type: NotificationType;
};

enum NotificationType {
  TeamInvitation,
}

const NotiPage = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const acceptInvite = (id: any) => {
    axios
      .post(
        `${apiUrl}/notifications/accept`,
        {
          notificationId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.user.token}`,
          },
        },
      )
      .then(() => {
        setNotifications(
          notifications.filter(notification => notification.doc_id !== id),
        );
      });
  };

  const deleteNotification = (id: any) => {
    axios
      .delete(`${apiUrl}/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      })
      .then(() => {
        setNotifications(
          notifications.filter(notification => notification.doc_id !== id),
        );
      });
  };

  useEffect(() => {
    axios
      .get(`${apiUrl}/notifications`, {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      })
      .then(res => {
        setNotifications(res.data);
      });
  }, []);

  return (
    <div
      style={{
        margin: '3rem 0 0 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '2rem',
        padding: '3rem 30rem',
      }}
    >
      <p
        style={{
          fontSize: '4rem',
          textTransform: 'uppercase',
          fontWeight: '350',
          color: 'white',
        }}
      >
        Notifications
      </p>

      {notifications.map(notification => (
        <Notification
          key={notification.doc_id}
          title="Team Invitation"
          content={`${notification.from} invited you to join ${notification.message}`}
          onAccept={() => {
            acceptInvite(notification.doc_id!);
          }}
          onReject={() => {
            deleteNotification(notification.doc_id!);
          }}
        />
      ))}
      {notifications.length === 0 && (
        <p
          style={{
            fontSize: '3rem',
            color: 'white',
            alignSelf: 'center',
            marginTop: '5rem',
          }}
        >
          No notifications
        </p>
      )}
    </div>
  );
};

export default NotiPage;
