import apiClient from "./apiClient";

export async function getSigningContract() {
  const response = await apiClient.get("/contract/get");
  return response.data;
}

export async function signContract(contractId: string, data: FormData) {
  const response = await apiClient.post(
    `/contract/${contractId}/sign`,
    data,
    {},
  );
  return response.data;
}
