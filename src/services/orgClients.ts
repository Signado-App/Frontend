import apiClient from "./apiClient";

export async function getOrgClients(orgId: number) {
  const response = await apiClient.get(
    `/protected/organization/${orgId}/clients`,
  );
  return response.data;
}

export async function getOrgClient(orgId: number, clientId: number) {
  const response = await apiClient.get(
    `/protected/organization/${orgId}/clients/${clientId}`,
  );
  return response.data;
}

export async function addOrgClient(
  orgId: number,
  data: {
    client_name: string;
    email: string;
    client_metadata?: Record<string, unknown>;
  },
) {
  const response = await apiClient.post(
    `/protected/organization/${orgId}/clients/add`,
    data,
  );
  return response.data;
}

export async function updateOrgClient(
  orgId: number,
  clientId: number,
  data: {
    client_name?: string;
    status?: string;
    email?: string;
    client_metadata?: Record<string, unknown>;
  },
) {
  try {
    const response = await apiClient.put(
      `/protected/organization/${orgId}/clients/${clientId}/update`,
      data,
    );
    return response.data;
  } catch (err: any) {
    if (err?.status === 405) {
      const response = await apiClient.post(
        `/protected/organization/${orgId}/clients/${clientId}/update`,
        data,
      );
      return response.data;
    }
    throw err;
  }
}

export async function deleteOrgClient(orgId: number, clientId: number) {
  const response = await apiClient.delete(
    `/protected/organization/${orgId}/clients/${clientId}/delete`,
  );
  return response.data;
}
