import { io } from 'socket.io-client';

// Create a singleton for the socket connection
let socket;

export const initSocket = () => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('Connected to Socket.io server');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });
  }
  
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};