import {
  OrganizationInfo,
  OrganizationListItem,
  Privilege,
} from "@/types/types";
import apiClient from "./apiClient";

export function mergePrivileges(data: any): Privilege[] {
  const direct = (data?.privileges ?? []).map(
    (p: any) => parseInt(p.id) as Privilege,
  );
  const fromGroups = (data?.groups ?? []).flatMap((g: any) =>
    (g?.privileges ?? []).map((p: any) => parseInt(p.id) as Privilege),
  );
  return [...new Set([...direct, ...fromGroups])];
}

export async function getUserOrganizations(): Promise<{
  data: OrganizationListItem[];
}> {
  const response = await apiClient.get("/protected/user/organization");
  return response.data;
}

export async function createOrganization(data: { name: string }) {
  const response = await apiClient.post(
    "/protected/user/organization/new",
    data,
  );
  return response.data;
}

export async function getOrganizationInfo(
  orgId: number,
): Promise<{ data: OrganizationInfo }> {
  const response = await apiClient.get(
    `/protected/user/organization/${orgId}/info`,
  );
  return response.data;
}

export async function getOrganizationDashboard(
  orgId: number,
  days: number = 30,
) {
  const response = await apiClient.get(`/protected/organization/${orgId}`, {
    params: { days },
  });
  return response.data;
}

export async function updateOrganization(
  orgId: number,
  data: { name: string },
) {
  const response = await apiClient.put(
    `/protected/organization/${orgId}/update`,
    {
      name: data.name,
    },
  );
  return response.data;
}

export async function deleteOrganization(orgId: number) {
  const response = await apiClient.delete(
    `/protected/organization/${orgId}/delete`,
  );
  return response.data;
}

export async function joinOrganization(orgId: number) {
  const response = await apiClient.put(
    `/protected/user/organization/${orgId}/join`,
  );
  return response.data;
}
