import apiClient from "./apiClient";

export async function getOrgGroups(orgId: number) {
  const response = await apiClient.get(
    `/protected/organization/${orgId}/group`,
  );
  return response.data;
}

export async function createOrgGroup(
  orgId: number,
  data: { name: string; description: string },
) {
  const response = await apiClient.post(
    `/protected/organization/${orgId}/group/add`,
    data,
  );
  return response.data;
}

export async function getOrgGroup(orgId: number, groupId: number) {
  const response = await apiClient.get(
    `/protected/organization/${orgId}/group/${groupId}`,
  );
  return response.data;
}

export async function updateGroupPrivileges(
  orgId: number,
  groupId: number,
  privilegeIds: string[],
) {
  const response = await apiClient.put(
    `/protected/organization/${orgId}/group/${groupId}/update/privileges`,
    { privilege_ids: privilegeIds },
  );
  return response.data;
}

export async function addGroupMember(
  orgId: number,
  groupId: number,
  memberId: number,
) {
  const response = await apiClient.post(
    `/protected/organization/${orgId}/group/${groupId}/update/user/add`,
    { organization_member_id: memberId },
  );
  return response.data;
}

export async function removeGroupMember(
  orgId: number,
  groupId: number,
  memberId: number,
) {
  const response = await apiClient.delete(
    `/protected/organization/${orgId}/group/${groupId}/update/user/delete`,
    { data: { organization_member_id: memberId } },
  );
  return response.data;
}
