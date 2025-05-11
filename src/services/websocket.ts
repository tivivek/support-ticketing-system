import { Client, type IFrame, type messageCallbackType } from '@stomp/stompjs';
import { store } from '../store';
import { addMessage } from '../store/slices/messagesSlice';
import { updateTicket } from '../store/slices/ticketsSlice';
import type { Message, Ticket } from '../types';

class WebSocketService {
  private client: Client | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;

  connect() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.client = new Client({
      brokerURL: import.meta.env.REACT_APP_WEBSOCKET_URL,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: function (str) {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = this.onConnect.bind(this);
    this.client.onStompError = this.onStompError.bind(this);
    this.client.onWebSocketClose = this.onWebSocketClose.bind(this);

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
  }

  private onConnect(frame: IFrame) {
    console.log('Connected to WebSocket');
    this.reconnectAttempts = 0;

    const state = store.getState();
    const userId = state.auth.user?.id;

    if (!userId || !this.client) return;

    this.client.subscribe('/user/queue/tickets', this.handleTicketUpdate);

    this.client.subscribe('/user/queue/messages', this.handleNewMessage);

    this.client.subscribe('/user/queue/notifications', this.handleNotification);
  }

  private handleTicketUpdate: messageCallbackType = (message) => {
    const ticket: Ticket = JSON.parse(message.body);
    store.dispatch(updateTicket(ticket));
  };

  private handleNewMessage: messageCallbackType = (message) => {
    const newMessage: Message = JSON.parse(message.body);
    store.dispatch(addMessage(newMessage));
  };

  private handleNotification: messageCallbackType = (message) => {
    const notification = JSON.parse(message.body);
    console.log('Notification received:', notification);
  };

  private onStompError(frame: IFrame) {
    console.error('STOMP error', frame);
  }

  private onWebSocketClose() {
    console.log('WebSocket connection closed');
    this.handleReconnect();
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect: ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
      );

      setTimeout(() => {
        if (this.client) {
          this.client.activate();
        }
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnect attempts reached.');
      // Here you can dispatch an action to show a reconnect button in the UI
    }
  }
}

export const websocketService = new WebSocketService();
export default websocketService;
