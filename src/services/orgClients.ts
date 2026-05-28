import apiClient from "./apiClient";

export async function getOrgClients(orgId: number) {
  const response = await apiClient.get(
    `/protected/organization/${orgId}/clients`,
  );
  return response.data;
}
