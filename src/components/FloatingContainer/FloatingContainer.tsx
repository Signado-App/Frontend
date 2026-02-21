import { Paper } from "@mui/material";

interface FloatingContainerProps {
  padding?: number;
  children: React.ReactNode;
}

function FloatingContainer({ children, padding = 30 }: FloatingContainerProps) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: `${padding}px`, borderRadius: 2, borderWidth: 0.8 }}
    >
      {children}
    </Paper>
  );
}

export default FloatingContainer;
