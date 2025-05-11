import { type User, UserRole } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'John Smith',
    email: 'customer@example.com',
    role: UserRole.CUSTOMER,
    avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=random',
  },
  {
    id: 'user2',
    name: 'Sarah Williams',
    email: 'agent@example.com',
    role: UserRole.AGENT,
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Williams&background=random',
  },
  {
    id: 'user3',
    name: 'Michael Brown',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    avatar: 'https://ui-avatars.com/api/?name=Michael+Brown&background=random',
  },
];
