"use client";

import { use, useEffect, useState } from "react";
import { Box } from "@mui/material";
import Headline from "@/components/Headline";
import GroupMembers from "@/components/Groups/GroupMembers";
import GroupPrivileges from "@/components/Groups/GroupPrivilieges";
import BackButton from "@/components/Clients/BackButton";
import { useUserContext } from "@/context/UserContext";
import { getOrgGroup } from "@/services/orgGroups";

export default function GroupPage({
  params,
}: {
  params: Promise<{ group_id: string }>;
}) {
  const { group_id } = use(params);
  const { selectedOrgId } = useUserContext();
  const [group, setGroup] = useState<any>(null);

  useEffect(() => {
    if (!selectedOrgId) return;
    getOrgGroup(selectedOrgId, Number(group_id)).then((response) => {
      setGroup(response.group);
    });
  }, [selectedOrgId, group_id]);

  const handleAddMember = () => {
    // TODO: otevřít modal pro přidání člena
  };

  const handleRemoveMember = async (userId: number) => {
    // TODO: zavolat API pro odebrání člena ze skupiny
  };
  if (!group) return null;

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
        <GroupPrivileges groupId={group_id} privileges={group.privileges} />
      </Box>
    </Box>
  );
}
