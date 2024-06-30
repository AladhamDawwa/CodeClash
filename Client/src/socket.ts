import { io } from 'socket.io-client';

const socket = io('https://codeclash-backend-t4cnvcfzcq-ew.a.run.app', {
  autoConnect: false,
});

export default socket;
