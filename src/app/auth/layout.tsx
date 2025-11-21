import { Box, Card } from "@mui/material";

function LayoutAuth({ children }: { children: React.ReactNode }) {
    return (
    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'background.secondary', py: 2}}>
        <Card sx={{ maxWidth: 800, margin: 'auto', py: '4rem',  px: '6rem' }} elevation={1}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {children}
            </Box>
        </Card>
    </Box>);
}

export default LayoutAuth;