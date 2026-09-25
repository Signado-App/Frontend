import apiClient from "./apiClient";

export async function getSigningContract() {
  const response = await apiClient.get("/contract/get");
  return response.data;
}

export type SignContractPayload = {
  signature_svg: object;
  document_hash: string;
  device?: string;
  location?: string;
};

export async function signContract(
  contractId: string,
  data: SignContractPayload,
) {
  const response = await apiClient.post(`/contract/${contractId}/sign`, data);
  return response.data;
}
