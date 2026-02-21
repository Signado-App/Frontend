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
      }}
    >
      {children}
    </Paper>
  );
}

export default FloatingContainer;
