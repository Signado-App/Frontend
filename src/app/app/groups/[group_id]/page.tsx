import { Box } from "@mui/material";
import Headline from "@/components/Headline";
import GroupMembers from "@/components/Groups/GroupMembers";
import GroupPrivileges from "@/components/Groups/GroupPrivilieges";
import BackButton from "@/components/Clients/BackButton";

async function GroupPage({
  params,
}: {
  params: Promise<{ group_id: string }>;
}) {
  const { group_id } = await params;

  return (
    <Box>
      <BackButton href="/app/groups" label="Back to Groups" />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mt: 4 }}>
        <Headline title="Admins" description="Organization administrators" />
        <GroupMembers groupId={group_id} />
        <GroupPrivileges groupId={group_id} />
      </Box>
    </Box>
  );
}

export default GroupPage;
