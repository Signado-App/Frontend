import { isApiError } from "./apiClient";

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export class EmailAlreadyExistsError extends ApiError {
  constructor() {
    super("Email already exists");
    this.name = "EmailAlreadyExistsError";
  }
}

export class InvalidCredentialsError extends ApiError {
  constructor() {
    super("Invalid email or password");
    this.name = "InvalidCredentialsError";
  }
}

export class ValidationError extends ApiError {
  constructor(public fields: Record<string, string>) {
    super("Validation failed");
    this.name = "ValidationError";
  }
}

export class AccountNotActiveError extends ApiError {
  constructor() {
    super("Account is not active.");
    this.name = "AccountNotActiveError";
  }
}

export class NetworkError extends ApiError {
  constructor() {
    super("Network error");
    this.name = "NetworkError";
  }
}

export class ServerError extends ApiError {
  constructor(public status: number) {
    super(`Server error (${status})`);
    this.name = "ServerError";
  }
}

export function isValidationErrorData(
  data: unknown,
): data is { fields: Record<string, string> } {
  return (
    typeof data === "object" &&
    data !== null &&
    "fields" in data &&
    typeof (data as { fields: unknown }).fields === "object" &&
    (data as { fields: unknown }).fields !== null
  );
}

export function mapCommonApiErrors(err: unknown): void {
  if (!isApiError(err)) return;
  if (err.type === "NETWORK_ERROR") throw new NetworkError();
  if (err.type === "SERVER_ERROR") throw new ServerError(err.status ?? 500);
}