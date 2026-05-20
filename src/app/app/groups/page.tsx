"use client";

import { Box, Button } from "@mui/material";
import Headline from "@/components/Headline";
import AddIcon from "@mui/icons-material/Add";
import AppTable, { ColumnDef } from "@/components/Table/AppTable";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import Searchbar from "@/components/Searchbar/Searchbar";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useRouter } from "next/navigation";

type Group = {
  id: string;
  name: string;
  description: string;
  membersCount: number;
};

const mockGroups: Group[] = [
  {
    id: "1",
    name: "Admins",
    description: "Organization administrators",
    membersCount: 3,
  },
  {
    id: "2",
    name: "Sales",
    description: "Sales team members",
    membersCount: 7,
  },
  {
    id: "3",
    name: "Support",
    description: "Customer support team",
    membersCount: 5,
  },
  {
    id: "4",
    name: "Finance",
    description: "Finance and billing team",
    membersCount: 2,
  },
];

function GroupsPage() {
  const [data, setData] = useState<Group[]>(mockGroups);
  const router = useRouter();


  const columns: ColumnDef<Group>[] = [
    {
      id: "name",
      header: "Group Name",
      cell: (row) => (
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {row.name}
        </Typography>
      ),
    },
    {
      id: "description",
      header: "Description",
      cell: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.description}
        </Typography>
      ),
    },
    {
      id: "membersCount",
      header: "Members",
      cell: (row) => (
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {row.membersCount}
        </Typography>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <Button
          variant="outlined"
          startIcon={<VisibilityOutlinedIcon />}
          onClick={() => router.push(`/app/groups/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
        <Headline
          title="Groups"
          description="Manage groups within your organization."
        />
        <Button variant="contained" startIcon={<AddIcon />}>
          Create Group
        </Button>
      </Box>
      <Searchbar placeholder="Search by group name" sx={{ width: 320 }} />
      <Box>
        <AppTable<Group> data={data} columns={columns} />
      </Box>
    </Box>
  );
}

export default GroupsPage;
