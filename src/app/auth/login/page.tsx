"use client";
import Headline from "@/components/Headline";
import { Button, Typography } from "@mui/material";
import SignadoButton from "@/components/Button";
import { Sign } from "crypto";

export default function LoginPage() {
  return (
    <main>
      <Headline
        title="Headline test 1"
        description="Headline bez dětí"
      ></Headline>
      <Headline title="Headline test 2" description="Headline s dětmi">
        <Button variant="contained" color="primary">
          Normal MUI Button
        </Button>
        <SignadoButton variant="contained" color="primary">
          Signado Button
        </SignadoButton>
        <Button variant="outlined" color="secondary">
          Zaregistrovat se
        </Button>
      </Headline>
      <Headline title="Headline test 3">
        <Button variant="contained" color="primary">
          Přidat klienta
        </Button>
        <Typography variant="body2" color="textSecondary">
          Nějaký doplňující text vedle tlačítka
        </Typography>
      </Headline>
    </main>
  );
}
