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

export async function removeOrgUser(
  orgId: number,
  memberId: number,
  userId?: number,
) {
  const primaryId = memberId > 0 ? memberId : (userId ?? 0);
  const secondaryId = primaryId === memberId ? (userId ?? 0) : memberId;

  try {
    const response = await apiClient.delete(
      `/protected/organization/${orgId}/users/delete`,
      {
        params: { member_id: primaryId },
      },
    );
    return response.data;
  } catch (err: any) {
    const spec =
      err?.data?.specification ||
      err?.response?.data?.specification ||
      err?.specification;
    if (spec === "member_id" && secondaryId > 0 && secondaryId !== primaryId) {
      const retryRes = await apiClient.delete(
        `/protected/organization/${orgId}/users/delete`,
        {
          params: { member_id: secondaryId },
        },
      );
      return retryRes.data;
    }
    throw err;
  }
}

export async function inviteOrgUser(
  orgId: number,
  data: { email: string; groups: number[] },
) {
  const response = await apiClient.post(
    `/protected/organization/${orgId}/users/add`,
    data,
  );
  return response.data;
}

export async function getAvailableUserPrivileges(orgId: number) {
  const response = await apiClient.get(
    `/protected/organization/${orgId}/users/available-privileges`,
  );
  return response.data;
}

export async function updateUserMemberships(
  orgId: number,
  memberId: number,
  privilegeIds: number[],
  userId?: number,
) {
  const tryPost = async (id: number) => {
    return await apiClient.post(
      `/protected/organization/${orgId}/users/update/memberships`,
      {
        user_id: Number(id),
        member_id: Number(id),
        privileges: privilegeIds.map(Number),
      },
    );
  };

  try {
    const response = await tryPost(memberId);
    return response.data;
  } catch (err: any) {
    const spec =
      err?.data?.specification ||
      err?.response?.data?.specification ||
      err?.specification;
    if (spec === "member_id" && userId && userId !== memberId) {
      const retryRes = await tryPost(userId);
      return retryRes.data;
    }
    throw err;
  }
}

export async function getOrgUser(
  orgId: number,
  memberId: number,
  userId?: number,
) {
  const primaryId = memberId > 0 ? memberId : (userId ?? 0);
  const secondaryId = primaryId === memberId ? (userId ?? 0) : memberId;

  try {
    const response = await apiClient.get(
      `/protected/organization/${orgId}/users/${primaryId}`,
    );
    return response.data;
  } catch (err: any) {
    if (secondaryId > 0 && secondaryId !== primaryId) {
      const retryRes = await apiClient.get(
        `/protected/organization/${orgId}/users/${secondaryId}`,
      );
      return retryRes.data;
    }
    throw err;
  }
}

export async function updateOrgUserStatus(
  orgId: number,
  memberId: number,
  status: string,
) {
  const response = await apiClient.put(
    `/protected/organization/${orgId}/users/update`,
    {
      member_id: memberId,
      status,
    },
  );
  return response.data;
}

