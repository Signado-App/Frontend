"use client";
import Headline from "@/components/Headline";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
  return (
    <>
      <Headline title="Register" description="Welcome to Signado. Please fill in the details below to create an account. <br/>Love you! <3"/>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
        <Box sx={{display: "flex", flexDirection: "row", gap: 1}}>
            <TextField label="First Name" variant="outlined" sx={{flex: 1}}/>
            <TextField label="Last Name" variant="outlined" sx={{flex: 1}}/>
        </Box>
        <TextField label="E-mail" variant="outlined" />
        <TextField label="Password" type="password" variant="outlined" />
      </Box>
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1}}>
        <Button variant="contained" color="primary" size="large" sx={{width: "100%"}} onClick={() => {router.push('/app/dashboard')}}>
          Register
        </Button>
        <Typography variant="body1" sx={{textAlign: 'center'}}>
          By registering, you agree to our <Link href="/terms-of-service">Terms of Service</Link> and <Link href="/privacy-policy">Privacy Policy</Link>.
        </Typography>
        <Typography variant="body1" sx={{textAlign: 'center'}}>
          Do you already have an account? <Link href="/auth/login">Login here</Link>.
        </Typography>
      </Box>
    </>
  );
}