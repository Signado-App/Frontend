import { Contract } from "@/types/types";

import apiClient from "./apiClient";

export async function getContracts() {
  const response = await apiClient.get("/protected/user/contract");
  return response.data;
}

export async function createOrgContract(orgId: number, data: any) {
  const response = await apiClient.post(
    `/protected/organization/${orgId}/contracts/add`,
    data,
  );
  return response.data;
}
