import apiClient from "./apiClient";

export type Organization = {
  id: number;
  name: string;
  status: string;
  created_at: string;
};

export async function getUserOrganizations() {
  const response = await apiClient.get("/protecter/user/organization");
  return response.data;
}

export async function createOrganization(data: { name: string }) {
  const response = await apiClient.post(
    "/protecter/user/organization/new",
    data,
  );
  return response.data;
}
