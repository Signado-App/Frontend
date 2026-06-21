import apiClient from "./apiClient";

export async function getOrgClients(orgId: number) {
  const response = await apiClient.get(
    `/protected/organization/${orgId}/clients`,
  );
  return response.data;
}

export async function getOrgClient(orgId: number, clientId: number) {
  const response = await apiClient.get(
    `/protected/organization/${orgId}/clients/${clientId}`,
  );
  return response.data;
}

export async function addOrgClient(
  orgId: number,
  data: {
    client_name: string;
    email: string;
    client_metadata?: Record<string, unknown>;
  },
) {
  const response = await apiClient.post(
    `/protected/organization/${orgId}/clients/add`,
    data,
  );
  return response.data;
}
