import { Box, Card } from "@mui/material";

function LayoutAuth({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "background.secondary",
        py: 2,
      }}
    >
      <Card sx={{ width: 500, py: "4rem", px: "3rem" }} elevation={1}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {children}
        </Box>
      </Card>
    </Box>
  );
}

export default LayoutAuth;
