"use client";

import { Box, Button } from "@mui/material";
import Headline from "@/components/Headline";
import AddIcon from "@mui/icons-material/Add";
import StatusTabs from "@/components/StatusTabs";
import { useEffect, useState } from "react";
import Searchbar from "@/components/Searchbar/Searchbar";
import { Select, MenuItem } from "@mui/material";
import AppTable from "@/components/Table/AppTable";
import { ColumnDef } from "@/components/Table/AppTable";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { getUsers } from "@/services/users";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { User } from "@/types/types";

function UsersPage() {
  const [currentTab, setCurrentTab] = useState("Active");
  const [data, setData] = useState<User[]>([]);

  useEffect(() => {
    getUsers().then(setData);
  }, []);

  const columns: ColumnDef<User>[] = [
    {
      id: "name",
      header: "User Name",
      cell: (row) => (
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {row.firstName} {row.lastName}
        </Typography>
      ),
    },
    {
      id: "email",
      header: "Email",
      cell: (row) => (
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {row.email}
        </Typography>
      ),
    },
    {
      id: "phone",
      header: "Phone Number",
      cell: (row) => (
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {row.phone}
        </Typography>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => {
        const colors = {
          Active: { bg: "#dcfce7", text: "#22c55e" },
          Disabled: { bg: "#f3f4f6", text: "#64748b" },
          Invited: { bg: "#fef9c3", text: "#eab308" },
        };
        const style = colors[row.status];

        return (
          <Chip
            label={row.status}
            size="small"
            sx={{
              bgcolor: style.bg,
              color: style.text,
              fontWeight: 600,
              borderRadius: "6px",
              height: "24px",
              fontSize: "0.75rem",
            }}
          />
        );
      },
    },

    {
      id: "actions",
      header: "Actions",
      align: "left",
      cell: (row) => (
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteOutlineIcon />}
          onClick={() => {
            console.log("Remove user", row.id);
          }}
        >
          Remove
        </Button>
      ),
    },
  ];
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
        <Headline
          title="Users"
          description="Manage clients of your organization."
        />
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
          Invite User
        </Button>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
        <StatusTabs
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          Tabs={["Active", "Inactive"]}
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Searchbar placeholder="Search by client name" sx={{ width: 320 }} />
          <Select value="main" size="small" sx={{}}>
            <MenuItem value="main">Name A-Z</MenuItem>
            <MenuItem value="second">Highest value</MenuItem>
          </Select>
        </Box>
      </Box>
      <Box>
        <AppTable<User> data={data} columns={columns} />
      </Box>
    </Box>
  );
}

export default UsersPage;
