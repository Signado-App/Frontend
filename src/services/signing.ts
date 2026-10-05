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
  const resData = response.data;
  if (
    resData?.specification === "already_signed" ||
    resData?.status === "FORBIDDEN" ||
    (resData?.status &&
      resData?.status !== "SUCCESS" &&
      resData?.status !== "OK" &&
      !resData?.data)
  ) {
    const error: any = new Error(
      resData?.specification === "already_signed"
        ? "This contract has already been signed."
        : resData?.message || "Signing forbidden",
    );
    error.data = resData;
    error.status = resData?.status === "FORBIDDEN" ? 403 : 400;
    throw error;
  }
  return resData;
}
