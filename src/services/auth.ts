import { LoginResponse, RegisterResponse } from "@/types/types";
import apiClient from "./apiClient";

export async function registerUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> {
  const response = await apiClient.post("/public/auth/register", {
    name: data.firstName,
    surname: data.lastName,
    email: data.email,
    password: data.password,
  });
  return response.data;
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  const response = await apiClient.post("/public/auth/login", data);
  return response.data;
}
