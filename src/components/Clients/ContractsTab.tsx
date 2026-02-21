import Headline from "@/components/Headline";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function ContractsTab() {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
      <Headline
        title="Contracts"
        description="Manage client contracts and agreements"
      />
      <Button variant="contained" color="primary" startIcon={<AddIcon />}>
        Add New Contract
      </Button>
      <Box></Box>
    </Box>
  );
}
