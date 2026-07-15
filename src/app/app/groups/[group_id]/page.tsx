"use client";

import { use, useEffect, useState } from "react";
import { Box } from "@mui/material";
import Headline from "@/components/Headline";
import GroupMembers from "@/components/Groups/GroupMembers";
import GroupPrivileges from "@/components/Groups/GroupPrivilieges";
import BackButton from "@/components/Clients/BackButton";
import { useUserContext } from "@/context/UserContext";
import { getOrgGroup, removeGroupMember } from "@/services/orgGroups";
import { useSnackbar } from "@/context/SnackbarContext";
import AddGroupMemberModal from "@/components/Groups/AddGroupMemberModal";
import EditGroupPrivilegesModal from "@/components/Groups/EditGroupPrivilegesModal";

export default function GroupPage({
  params,
}: {
  params: Promise<{ group_id: string }>;
}) {
  const { group_id } = use(params);
  const { selectedOrgId } = useUserContext();
  const [group, setGroup] = useState<any>(null);
  const { showSnackbar } = useSnackbar();
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editPrivilegesOpen, setEditPrivilegesOpen] = useState(false);

  useEffect(() => {
    if (!selectedOrgId) return;
    getOrgGroup(selectedOrgId, Number(group_id)).then((response) => {
      setGroup(response.group);
    });
  }, [selectedOrgId, group_id]);

  if (!group) return null;

  const handleAddMember = () => {
    setAddMemberOpen(true);
  };

  const handleEditPrivileges = () => {
    setEditPrivilegesOpen(true);
  };

  const refreshGroup = () => {
    if (!selectedOrgId) return;
    getOrgGroup(selectedOrgId, Number(group_id)).then((response) => {
      setGroup(response.group);
    });
  };

  const handleRemoveMember = async (memberId: number) => {
    if (!selectedOrgId) return;
    try {
      await removeGroupMember(selectedOrgId, Number(group_id), memberId);
      showSnackbar("Member removed successfully", "success");
      refreshGroup();
    } catch {
      showSnackbar("Failed to remove member.", "error");
    }
  };

  return (
    <Box>
      <BackButton href="/app/groups" label="Back to Groups" />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mt: 4 }}>
        <Headline title={group.name} description={group.description} />
        <GroupMembers
          groupId={group_id}
          members={group.members}
          onAdd={handleAddMember}
          onRemove={handleRemoveMember}
        />
        <GroupPrivileges
          groupId={group_id}
          privileges={group.privileges}
          onEdit={handleEditPrivileges}
        />
      </Box>
      <AddGroupMemberModal
        open={addMemberOpen}
        groupId={Number(group_id)}
        existingMemberIds={
          group.members?.map((m: any) => m.organization_member_id) ?? []
        }
        onClose={() => setAddMemberOpen(false)}
        onSuccess={refreshGroup}
      />

      <EditGroupPrivilegesModal
        open={editPrivilegesOpen}
        groupId={Number(group_id)}
        currentPrivilegeIds={
          group.privileges?.map((p: any) => Number(p.id)) ?? []
        }
        onClose={() => setEditPrivilegesOpen(false)}
        onSuccess={refreshGroup}
      />
    </Box>
  );
}
