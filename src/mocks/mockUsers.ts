import type { User } from '../models/types.ts'

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Jordan Blake',
    email: 'user@example.com',
    password: 'password123',
    role: 'USER',
  },
  {
    id: 'user-2',
    name: 'Ava Morgan',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'ADMIN',
  },
]
