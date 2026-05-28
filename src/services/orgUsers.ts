import apiClient from "./apiClient";

export type OrgUsersParams = {
  search?: string;
  state?: "ACTIVE" | "INVITED";
  sort_by?: "name" | "email" | "status";
  sort_dir?: "asc" | "desc";
};

export async function getOrgUsers(orgId: number, params?: OrgUsersParams) {
  const response = await apiClient.get(
    `/protected/organization/${orgId}/users`,
    {
      params,
    },
  );
  return response.data;
}

export async function removeOrgUser(orgId: number, memberId: number) {
  const response = await apiClient.delete(
    `/protected/organization/${orgId}/users/delete`,
    {
      params: { member_id: memberId },
    },
  );
  return response.data;
}

export async function inviteOrgUser(orgId: number, data: { email: string; groups: number[] }) {
  const response = await apiClient.post(`/protected/organization/${orgId}/users/add`, data);
  return response.data;
}
