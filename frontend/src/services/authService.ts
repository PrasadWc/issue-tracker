import apiClient from "./apiClient";
import { type User } from "./userService";

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginData {
  email: string;
  password?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
}

const authService = {
  login: async (data: LoginData) => {
    const response = await apiClient.post<AuthResponse>("/users/login", data);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await apiClient.post<AuthResponse>("/users", data);
    return response.data;
  },
};

export default authService;
