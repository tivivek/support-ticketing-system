import type { Middleware } from 'redux';
import { websocketService } from '../../services/websocket';
import { login, logout } from '../slices/authSlice';

const websocketMiddleware: Middleware = (store) => (next) => (action) => {
  // Handle WebSocket connection based on auth status
  if (login.fulfilled.match(action)) {
    websocketService.connect();
  }

  if (logout.fulfilled.match(action)) {
    websocketService.disconnect();
  }

  return next(action);
};

export default websocketMiddleware;
