// In a real application, this data would be stored in a database.
// For this example, we'll use an in-memory array.

export type User = {
  id: string;
  email: string;
  password?: string; // Should be hashed in a real app
  role: 'user' | 'admin';
  iframeUrl: string | null;
};

export const users: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin',
    iframeUrl:
      'https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752141381%2C0.004017949104309083%2C51.478569861898604&layer=mapnik',
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'password',
    role: 'user',
    iframeUrl: 'https://example.com',
  },
  {
    id: '3',
    email: 'no-iframe@example.com',
    password: 'password',
    role: 'user',
    iframeUrl: null,
  },
];
