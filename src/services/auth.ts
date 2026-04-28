import {
  LoginCredentials,
  LoginResponse,
  RegisterData,
  RegisterResponse,
  User,
} from "@/types/types";
import apiClient, { isApiError } from "./apiClient";
import {
  AccountNotActiveError,
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  isValidationErrorData,
  mapCommonApiErrors,
  ValidationError,
} from "./errors";

export async function registerUser(
  data: RegisterData,
): Promise<RegisterResponse> {
  try {
    const response = await apiClient.post("/public/auth/register", data);
    return response.data;
  } catch (err) {
    mapCommonApiErrors(err);
    if (isApiError(err)) {
      if (err.status === 409) throw new EmailAlreadyExistsError();
      if (err.status === 400 && isValidationErrorData(err.data)) {
        throw new ValidationError(err.data.fields);
      }
    }

    throw err;
  }
}

export async function loginUser(
  data: LoginCredentials,
): Promise<LoginResponse> {
  try {
    const response = await apiClient.post("/public/auth/login", data);
    return response.data;
  } catch (err) {
    mapCommonApiErrors(err);
    if (isApiError(err)) {
      if (err.status === 401) throw new InvalidCredentialsError();
      if (err.status === 403) throw new AccountNotActiveError();
    }
    throw err;
  }
}

export async function getLoggedInUser(): Promise<User> {
  try {
    const response = await apiClient.get("/auth/me");
    return response.data;
  } catch (err) {
    mapCommonApiErrors(err);
    throw err;
  }
}

export async function verifyUser(token: string): Promise<void> {
  await apiClient.post(`/public/auth/registration/${token}`);
}

export async function requestPasswordReset(email: string): Promise<void> {
  await apiClient.get(`/public/auth/password_reset/${email}`);
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await apiClient.post(`/public/auth/password_reset/${token}`, { password });
}
