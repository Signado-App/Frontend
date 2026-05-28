import apiClient from "./apiClient";

export async function getOrgContracts(orgId: number) {
  const response = await apiClient.get(
    `/protected/organization/${orgId}/contracts`,
  );
  return response.data;
}
