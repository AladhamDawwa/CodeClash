import { io } from 'socket.io-client';

const socket = io('https://codeclash-backend.packetmasr.shop', {
  autoConnect: false,
});

export default socket;
