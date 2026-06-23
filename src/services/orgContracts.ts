import apiClient from "./apiClient";

export async function getOrgContracts(orgId: number) {
  const response = await apiClient.get(
    `/protected/organization/${orgId}/contracts`,
  );
  return response.data;
}

export async function getOrgContract(orgId: number, contractId: string) {
  const response = await apiClient.get(
    `/protected/organization/${orgId}/contracts/${contractId}`,
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

export async function completeContract(
  orgId: number,
  contractId: string,
  action: "VERIFY" | "CANCEL",
) {
  const response = await apiClient.put(
    `/protected/organization/${orgId}/contracts/${contractId}/complete`,
    { action },
  );
  return response.data;
}
