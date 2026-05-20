import { Contract } from "@/types/types";

import apiClient from "./apiClient";

export async function getContracts() {
  const response = await apiClient.get("/protected/user/contract");
  return response.data;
}
