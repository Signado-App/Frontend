import apiClient from "./apiClient";

export async function getUser() {
  const response = await apiClient.get("/protected/user");
  console.log(response);
  return response.data;
}

export async function updateUser(data: {
  firstName: string;
  lastName: string;
  phone: string;
}) {
  const response = await apiClient.put("/protected/user", {
    first_name: data.firstName,
    last_name: data.lastName,
    phone: data.phone,
  });
  return response.data;
}

export async function deleteUser() {
  const response = await apiClient.delete("/protected/user/security/delete");
  return response.data;
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  const response = await apiClient.post(
    "/protected/user/security/change-password",
    {
      current_password: data.currentPassword,
      new_password: data.newPassword,
    },
  );
  return response.data;
}

export async function getSecurityStatus() {
  const response = await apiClient.get("/protected/user/security/status");
  return response.data;
}
