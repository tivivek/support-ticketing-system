import type { Message, Attachment } from '../types';
import { mockUsers } from './users';

export const mockMessages: Record<string, Message[]> = {
  ticket1: [
    {
      id: 'msg1-1',
      ticketId: 'ticket1',
      content:
        "I am unable to access the dashboard. When I click on the dashboard link, I get an error message saying 'Access Denied'.",
      createdAt: new Date(Date.now() - 3500000).toISOString(),
      sender: mockUsers[0],
      attachments: [],
    },
    {
      id: 'msg1-2',
      ticketId: 'ticket1',
      content:
        'Thank you for reporting this issue. I am investigating the problem and will get back to you shortly.',
      createdAt: new Date(Date.now() - 3400000).toISOString(),
      sender: mockUsers[1],
      attachments: [],
    },
    {
      id: 'msg1-3',
      ticketId: 'ticket1',
      content:
        "I found the issue. Your account permissions were incorrectly configured. I have fixed the permissions and you should be able to access the dashboard now. Please try again and let me know if you're still experiencing issues.",
      createdAt: new Date(Date.now() - 3300000).toISOString(),
      sender: mockUsers[1],
      attachments: [],
    },
  ],
  ticket2: [
    {
      id: 'msg2-1',
      ticketId: 'ticket2',
      content:
        'I would like to request a dark mode feature for the application. It would be much easier on the eyes when working late at night.',
      createdAt: new Date(Date.now() - 86000000).toISOString(),
      sender: mockUsers[0],
      attachments: [],
    },
    {
      id: 'msg2-2',
      ticketId: 'ticket2',
      content:
        "Thanks for the suggestion! We've been considering adding a dark mode. I'll add your request to our feature backlog and discuss it with the development team.",
      createdAt: new Date(Date.now() - 85000000).toISOString(),
      sender: mockUsers[1],
      attachments: [],
    },
    {
      id: 'msg2-3',
      ticketId: 'ticket2',
      content:
        "Great news! We've decided to prioritize the dark mode feature. Development will begin next sprint. Thanks for your suggestion!",
      createdAt: new Date(Date.now() - 40000000).toISOString(),
      sender: mockUsers[1],
      attachments: [],
    },
  ],
};
