import {
  type PaginatedResponse,
  type Ticket,
  type Message,
  TicketStatus,
  TicketPriority,
} from '../types';
import { mockUsers } from '../mocks/users';
import { mockTickets } from '../mocks/tickets';
import { mockMessages } from './messages';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authAPI = {
  login: async (email: string, password: string) => {
    await delay(800);

    const user = mockUsers.find((u) => u.email === email);
    if (!user || password !== 'password123') {
      throw new Error('Invalid credentials');
    }

    return {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyZWZyZXNoIiwiaWF0IjoxNTE2MjM5MDIyfQ.DoYnrL6fg-WTgIEJzKLm-VfRR3dGYk5SIOtJnJQFl5s',
      user,
    };
  },

  logout: async () => {
    await delay(500);
    return { success: true };
  },

  getCurrentUser: async () => {
    await delay(600);
    return mockUsers.find((u) => u.role === 'AGENT') || mockUsers[0];
  },
};

export const ticketsAPI = {
  getTickets: async (params: {
    page?: number;
    pageSize?: number;
    status?: string;
    priority?: string;
    assignedTo?: string;
    tags?: string[];
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    await delay(800);

    let filteredTickets = [...mockTickets];

    if (params.status) {
      filteredTickets = filteredTickets.filter(
        (t) => t.status === params.status
      );
    }

    if (params.priority) {
      filteredTickets = filteredTickets.filter(
        (t) => t.priority === params.priority
      );
    }

    if (params.assignedTo) {
      filteredTickets = filteredTickets.filter(
        (t) => t.assignedTo?.id === params.assignedTo
      );
    }

    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredTickets = filteredTickets.filter(
        (t) =>
          t.title.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower)
      );
    }

    if (params.tags && params.tags.length > 0) {
      filteredTickets = filteredTickets.filter((t) =>
        params.tags!.some((tag) => t.tags.includes(tag))
      );
    }

    if (params.sortBy) {
      filteredTickets.sort((a: any, b: any) => {
        let aValue = a[params.sortBy!];
        let bValue = b[params.sortBy!];

        if (params.sortBy === 'assignedTo') {
          aValue = a.assignedTo?.name || '';
          bValue = b.assignedTo?.name || '';
        }

        const sortOrder = params.sortOrder === 'desc' ? -1 : 1;
        return aValue > bValue ? sortOrder : -sortOrder;
      });
    }

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedTickets = filteredTickets.slice(start, end);

    return {
      data: paginatedTickets,
      total: filteredTickets.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredTickets.length / pageSize),
    } as PaginatedResponse<Ticket>;
  },

  getTicketById: async (id: string) => {
    await delay(600);
    const ticket = mockTickets.find((t) => t.id === id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    return ticket;
  },

  createTicket: async (ticket: Partial<Ticket>) => {
    await delay(1000);
    const newTicket = {
      id: `ticket${mockTickets.length + 1}`,
      title: ticket.title || '',
      description: ticket.description || '',
      status: ticket.status || TicketStatus.OPEN,
      priority: ticket.priority || TicketPriority.MEDIUM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: mockUsers[0],
      assignedTo: ticket.assignedTo,
      tags: ticket.tags || [],
    } as Ticket;

    mockTickets.push(newTicket);
    return newTicket;
  },

  updateTicket: async (id: string, ticketUpdate: Partial<Ticket>) => {
    await delay(800);
    const ticketIndex = mockTickets.findIndex((t) => t.id === id);
    if (ticketIndex === -1) {
      throw new Error('Ticket not found');
    }

    mockTickets[ticketIndex] = {
      ...mockTickets[ticketIndex],
      ...ticketUpdate,
      updatedAt: new Date().toISOString(),
    };

    return mockTickets[ticketIndex];
  },

  deleteTicket: async (id: string) => {
    await delay(700);
    const ticketIndex = mockTickets.findIndex((t) => t.id === id);
    if (ticketIndex === -1) {
      throw new Error('Ticket not found');
    }

    const deletedTicket = mockTickets.splice(ticketIndex, 1)[0];
    return { success: true, deletedTicket };
  },
};

export const messagesAPI = {
  getMessages: async (ticketId: string) => {
    await delay(700);
    return mockMessages[ticketId] || [];
  },

  createMessage: async (
    ticketId: string,
    content: string,
    attachments?: File[]
  ) => {
    await delay(800);

    const newMessage = {
      id: `msg-${Date.now()}`,
      ticketId,
      content,
      createdAt: new Date().toISOString(),
      sender: mockUsers[1],
      attachments: attachments
        ? attachments.map((file, index) => ({
            id: `attachment-${Date.now()}-${index}`,
            filename: file.name,
            url: URL.createObjectURL(file),
            size: file.size,
            contentType: file.type,
          }))
        : [],
    } as Message;

    if (!mockMessages[ticketId]) {
      mockMessages[ticketId] = [];
    }

    mockMessages[ticketId].push(newMessage);
    return newMessage;
  },
};

export const usersAPI = {
  getUsers: async () => {
    await delay(600);
    return mockUsers;
  },

  getUserById: async (id: string) => {
    await delay(400);
    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },
};

const mockApi = {
  get: async (url: string, config?: any) => {
    console.log(`Mock API GET: ${url}`, config);
    return { data: {} };
  },
  post: async (url: string, data?: any, config?: any) => {
    console.log(`Mock API POST: ${url}`, data, config);
    return { data: {} };
  },
  put: async (url: string, data?: any, config?: any) => {
    console.log(`Mock API PUT: ${url}`, data, config);
    return { data: {} };
  },
  delete: async (url: string, config?: any) => {
    console.log(`Mock API DELETE: ${url}`, config);
    return { data: {} };
  },
};

export default mockApi;
