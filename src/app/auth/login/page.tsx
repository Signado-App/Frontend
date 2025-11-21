"use client";
import Headline from "@/components/Headline";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const router = useRouter();
  return (
    <>
      <Headline title="Login Page" description="Welcome to the login page. Please click the button below to log in."/>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
        <TextField label="E-mail" variant="outlined" />
        <TextField label="Password" type="password" variant="outlined" />
      </Box>
      <Button variant="contained" color="primary" size="large" onClick={() => {router.push('/app/dashboard')}}>
        Login
      </Button>
      <Typography variant="body1" sx={{mt: 1, textAlign: 'center'}}>
        Don't have an account? <Link href="/auth/register">Register here</Link>.
      </Typography>
    </>
  );
}
