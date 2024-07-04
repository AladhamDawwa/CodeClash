import React from 'react';
import Notification from './Notification';

const NotiPage = () => {
  return (
    <div
      style={{
        margin: '3rem 0 0 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '2rem',
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
      <Notification
        title="noti #1"
        content="Someone invited you to join their team!"
        onAccept={() => {
          console.log('Accepted');
        }}
        onReject={() => {
          console.log('Rejected');
        }}
      />
      <Notification
        title="noti #2"
        content="Another notification content"
        onAccept={() => {
          console.log('Accepted');
        }}
        onReject={() => {
          console.log('Rejected');
        }}
      />
    </div>
  );
};

export default NotiPage;
