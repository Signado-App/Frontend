import apiClient from "./apiClient";

export async function getSigningContract() {
  const response = await apiClient.get("/contract/get");
  return response.data;
}

export async function signContract(
  contractId: string,
  data: {
    device: string;
    document_hash: string;
    location: string;
    signature_svg: object;
  },
) {
  const response = await apiClient.post(`/contract/${contractId}/sign`, data);
  return response.data;
}
