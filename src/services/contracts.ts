import { Contract } from "@/types/types";

import apiClient from "./apiClient";

export async function getContracts() {
  const response = await apiClient.get("/protecter/user/contract");
  return response.data;
}
