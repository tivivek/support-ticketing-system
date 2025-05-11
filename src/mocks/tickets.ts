import { type Ticket, TicketStatus, TicketPriority } from '../types';
import { mockUsers } from './users';

export const mockTickets: Ticket[] = [
  {
    id: 'ticket1',
    title: 'Cannot access dashboard',
    description:
      "I'm getting an 'Access Denied' error when trying to view my dashboard. I've tried clearing my browser cache and using different browsers, but the issue persists.",
    status: TicketStatus.OPEN,
    priority: TicketPriority.HIGH,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    createdBy: mockUsers[0],
    tags: ['Dashboard', 'Access'],
  },
  {
    id: 'ticket2',
    title: 'Feature request: Dark mode',
    description:
      'Could you add a dark mode to the application? It would be easier on the eyes when working at night.',
    status: TicketStatus.IN_PROGRESS,
    priority: TicketPriority.MEDIUM,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
    createdBy: mockUsers[0],
    assignedTo: mockUsers[1],
    tags: ['Feature Request', 'UI'],
  },
  {
    id: 'ticket3',
    title: 'Billing issue on subscription',
    description:
      'I was charged twice for my monthly subscription. Please check and refund the extra charge.',
    status: TicketStatus.PENDING,
    priority: TicketPriority.HIGH,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: mockUsers[0],
    assignedTo: mockUsers[2],
    tags: ['Billing', 'Payment'],
  },
  {
    id: 'ticket4',
    title: 'App crashes on startup',
    description:
      'After the latest update, the mobile app crashes immediately after the splash screen.',
    status: TicketStatus.IN_PROGRESS,
    priority: TicketPriority.CRITICAL,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    createdBy: mockUsers[0],
    assignedTo: mockUsers[1],
    tags: ['Mobile App', 'Crash', 'Bug'],
  },
  {
    id: 'ticket5',
    title: 'Need help with integration',
    description:
      "I'm trying to integrate your API with my system but getting authentication errors.",
    status: TicketStatus.RESOLVED,
    priority: TicketPriority.MEDIUM,
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
    createdBy: mockUsers[0],
    assignedTo: mockUsers[1],
    tags: ['API', 'Integration'],
  },
];
