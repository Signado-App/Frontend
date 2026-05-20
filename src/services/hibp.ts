import apiClient from "./apiClient";

export async function checkPwnedPassword(password: string): Promise<boolean> {
  const response = await apiClient.post(
    "/public/security/password_verification",
    { password: password },
  );
  console.log("[Security] Response:", response.data);

  return response.data;
}
