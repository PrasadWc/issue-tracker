import apiClient from "./apiClient";

export const UserStatus = {
  Active: 1,
  Inactive: 2,
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const UserRole = {
  Admin: 1,
  User: 2,
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  _id: string;
  name: string;
  email: string;
  status: UserStatus;
  role: UserRole;
}

export interface CreateUserData {
  name: string;
  email: string;
  password?: string;
  status?: UserStatus;
  role?: UserRole;
}

export interface UpdateUserData extends Partial<
  Omit<CreateUserData, "password">
> {}

const userService = {
  getUsers: async () => {
    const response = await apiClient.get<User[]>("/users");
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: CreateUserData) => {
    const response = await apiClient.post<User>("/users", data);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserData) => {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  },

  softDeleteUser: async (id: string) => {
    const response = await apiClient.put(`/users/${id}/soft`);
    return response.data;
  },

  hardDeleteUser: async (id: string) => {
    const response = await apiClient.delete(`/users/${id}/hard`);
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get<User>("/users/me");
    return response.data;
  },
};

export default userService;
