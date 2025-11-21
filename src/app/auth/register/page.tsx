"use client";
import Headline from "@/components/Headline";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
  return (
    <main>
      <Headline title="Register Page"/>
      <Typography variant="body1" gutterBottom>
        Welcome to the register page. Please fill in the details below to create an account.
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2, maxWidth: 500 }}>
        <Box sx={{display: "flex", flexDirection: "row", gap: 2}}>
            <TextField label="First Name" variant="outlined" sx={{flex: 1}}/>
            <TextField label="Last Name" variant="outlined" sx={{flex: 1}}/>
        </Box>
        <TextField label="E-mail" variant="outlined" />
        <TextField label="Password" type="password" variant="outlined" />
      </Box>
      <Button variant="contained" color="primary" onClick={() => {router.push('/app/dashboard')}}>
        Register
      </Button>
      <Typography variant="body1" sx={{mt: 2}}>
        By registering, you agree to our <Link href="/terms-of-service">Terms of Service</Link> and <Link href="/privacy-policy">Privacy Policy</Link>.
      </Typography>
      <Typography variant="body1" sx={{mt: 1}}>
        Do you already have an account? <Link href="/auth/login">Login here</Link>.
      </Typography>
    </main>
  );
}