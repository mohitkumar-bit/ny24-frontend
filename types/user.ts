/**
 * Shared user and auth types
 */

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  isWorker?: boolean;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  name: string;
  phone?: string;
  email: string;
  password: string;
};


