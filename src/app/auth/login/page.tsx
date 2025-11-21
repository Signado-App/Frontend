"use client";
import Headline from "@/components/Headline";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const router = useRouter();
  return (
    <main>
      <Headline title="Login Page"/>
      <Typography variant="body1" gutterBottom>
        Welcome to the login page. Please click the button below to log in.
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2, maxWidth: 300 }}>
        <TextField label="E-mail" variant="outlined" />
        <TextField label="Password" type="password" variant="outlined" />
      </Box>
      <Button variant="contained" color="primary" onClick={() => {router.push('/app/dashboard')}}>
        Login
      </Button>
      <Typography variant="body1" sx={{mt: 1}}>
        Don't have an account? <Link href="/auth/register">Register here</Link>.
      </Typography>
    </main>
  );
}
