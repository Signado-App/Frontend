import { Paper } from "@mui/material";

interface FloatingContainerProps {
  padding?: number;
  children: React.ReactNode;
}

function FloatingContainer({ children, padding = 25 }: FloatingContainerProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: `${padding}px`,
        // borderRadius: 2,
        // border: "1px solid #e5e7eb",
        // boxShadow: "0.5",
      }}
    >
      {children}
    </Paper>
  );
}

export default FloatingContainer;
