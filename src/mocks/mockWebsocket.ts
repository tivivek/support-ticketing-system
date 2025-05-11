import { store } from '../store';
import { addMessage } from '../store/slices/messagesSlice';
import { updateTicket } from '../store/slices/ticketsSlice';
import { addNotification } from '../store/slices/notificationsSlice';
import { type Message, type Ticket, TicketStatus } from '../types';
import { mockUsers } from '../mocks/users';

class MockWebSocketService {
  private connected = false;
  private mockIntervalId: number | null = null;

  connect() {
    if (this.connected) return;

    console.log('Mock WebSocket: Connected');
    this.connected = true;

    this.mockIntervalId = window.setInterval(() => {
      this.simulateRandomEvent();
    }, 45000);
  }

  disconnect() {
    if (!this.connected) return;

    console.log('Mock WebSocket: Disconnected');
    this.connected = false;

    if (this.mockIntervalId !== null) {
      clearInterval(this.mockIntervalId);
      this.mockIntervalId = null;
    }
  }

  private simulateRandomEvent() {
    const state = store.getState();
    const tickets = state.tickets.tickets;

    if (!tickets || tickets.length === 0) return;

    const randomTicket = tickets[Math.floor(Math.random() * tickets.length)];

    const rand = Math.random();
    if (rand < 0.4) {
      this.simulateNewMessage(randomTicket.id);
    } else if (rand < 0.7) {
      this.simulateTicketUpdate(randomTicket.id);
    } else {
      this.simulateNotification();
    }
  }

  private simulateNewMessage(ticketId: string) {
    const mockResponses = [
      'Thanks for your patience. Our team is working on this issue.',
      "I've checked with the technical team and they're investigating this further.",
      'Could you provide more information about this issue?',
      "I've updated your ticket with the latest information from our development team.",
      'We should have this resolved soon. Thank you for your understanding.',
    ];

    const randomMessage =
      mockResponses[Math.floor(Math.random() * mockResponses.length)];

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      ticketId,
      content: randomMessage,
      createdAt: new Date().toISOString(),
      sender: mockUsers[1],
      attachments: [],
    };

    store.dispatch(addMessage(newMessage));

    store.dispatch(
      addNotification({
        message: `New message on ticket #${ticketId}`,
        type: 'info',
      })
    );
  }

  private simulateTicketUpdate(ticketId: string) {
    const state = store.getState();
    const ticket = state.tickets.tickets.find((t) => t.id === ticketId);

    if (!ticket) return;

    const statusValues = Object.values(TicketStatus);
    const currentStatusIndex = statusValues.indexOf(ticket.status);
    let newStatusIndex = currentStatusIndex;

    if (Math.random() < 0.7 && currentStatusIndex < statusValues.length - 1) {
      newStatusIndex = currentStatusIndex + 1;
    } else if (currentStatusIndex > 0) {
      newStatusIndex = currentStatusIndex - 1;
    }

    const updatedTicket: Ticket = {
      ...ticket,
      status: statusValues[newStatusIndex],
      updatedAt: new Date().toISOString(),
    };

    store.dispatch(updateTicket(updatedTicket));

    store.dispatch(
      addNotification({
        message: `Ticket #${ticketId} status updated to ${updatedTicket.status}`,
        type: 'info',
      })
    );
  }

  private simulateNotification() {
    const notifications = [
      { message: 'Scheduled maintenance tonight at 10 PM', type: 'warning' },
      { message: 'New knowledge base article available', type: 'info' },
      { message: 'System update completed successfully', type: 'success' },
      { message: 'Your weekly report is ready', type: 'info' },
      { message: 'New announcement from support team', type: 'info' },
    ];

    const randomNotification =
      notifications[Math.floor(Math.random() * notifications.length)];

    store.dispatch(
      addNotification({
        message: randomNotification.message,
        type: randomNotification.type as
          | 'info'
          | 'success'
          | 'warning'
          | 'error',
      })
    );
  }
}

export const websocketService = new MockWebSocketService();
export default websocketService;
