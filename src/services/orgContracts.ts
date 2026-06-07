import apiClient from "./apiClient";

export async function getOrgContracts(orgId: number) {
  const response = await apiClient.get(
    `/protected/organization/${orgId}/contracts`,
  );
  return response.data;
}

export async function createOrgContract(orgId: number, data: any) {
  console.log("sending to create org: ", data);
  const response = await apiClient.post(
    `/protected/organization/${orgId}/contracts/add`,
    data,
  );
  return response.data;
}
