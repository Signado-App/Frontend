import apiClient from "./apiClient";

export async function getSigningContract() {
  const response = await apiClient.get("/contract/get");
  return response.data;
}

export type SignedFileMeta = {
  name: string;
  size: number;
  type: string;
  hash: string;
};

export type UploadSignedPayload = {
  signed_file?: SignedFileMeta;
  signed_pdf_base64?: string;
};

export type UploadSignedResponse = {
  status: string;
  file_id?: string;
  file_name?: string;
  upload_url?: string;
  download_url?: string;
};

export type SignContractPayload = {
  signature_svg: object;
  document_hash: string;
  device?: string;
  location?: string;
  signed_file?: SignedFileMeta;
  signed_pdf_base64?: string;
};

export async function uploadSignedContract(
  contractId: string,
  payload: UploadSignedPayload,
): Promise<UploadSignedResponse> {
  const response = await apiClient.post(
    `/contract/${contractId}/upload-signed`,
    payload,
  );
  return response.data;
}

export async function uploadFileToPresignedUrl(
  uploadUrl: string,
  fileBlob: Blob,
  fileHash?: string,
) {
  const headers: Record<string, string> = {
    "Content-Type": fileBlob.type || "application/pdf",
  };

  if (uploadUrl.includes("x-amz-checksum-sha256") && fileHash) {
    headers["x-amz-checksum-sha256"] = fileHash;
  }
  if (uploadUrl.includes("x-amz-sdk-checksum-algorithm")) {
    headers["x-amz-sdk-checksum-algorithm"] = "SHA256";
  }

  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    body: fileBlob,
    headers,
  });

  if (!uploadRes.ok) {
    throw new Error(`S3 upload failed with status ${uploadRes.status}`);
  }

  return uploadRes;
}

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

export async function rejectContract(contractId: string, reason?: string) {
  const response = await apiClient.post(`/contract/${contractId}/reject`, {
    reason,
  });
  return response.data;
}

export async function sendSigningCode(contractId: string) {
  const response = await apiClient.post(`/contract/${contractId}/send-code`);
  return response.data;
}
