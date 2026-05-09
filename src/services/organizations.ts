import apiClient from "./apiClient";



export async function getUserOrganizations() {
  const response = await apiClient.get("/protected/user/organization");
  return response.data;
}

export async function createOrganization(data: { name: string }) {
  const response = await apiClient.post(
    "/protected/user/organization/new",
    data,
  );
  return response.data;
}

export async function getOrganizationInfo(orgId: number) {
  const response = await apiClient.get(
    `/protected/user/organization/${orgId}/info`,
  );
  return response.data;
}
