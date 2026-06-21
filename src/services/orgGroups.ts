import apiClient from "./apiClient";

export async function getOrgGroups(orgId: number) {
  const response = await apiClient.get(
    `/protected/organization/${orgId}/group`,
  );
  return response.data;
}

export async function createOrgGroup(orgId: number, data: { name: string; description: string }) {
  const response = await apiClient.post(`/protected/organization/${orgId}/group/add`, data);
  return response.data;
}

export async function getOrgGroup(orgId: number, groupId: number) {
  const response = await apiClient.get(`/protected/organization/${orgId}/group/${groupId}`);
  return response.data;
}