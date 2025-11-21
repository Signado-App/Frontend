"use client";
import Headline from "@/components/Headline";
import { Button, Typography } from "@mui/material";

export default function LoginPage() {
  return (
    <main>
      <Headline
        title="Headline test 1"
        description="Headline bez dětí"
      ></Headline>
      <Headline title="Headline test 2" description="Headline s dětmi">
        <Button variant="contained" color="primary" size="large">
          Contained button LARGE
        </Button>
        <Button variant="contained" color="primary" size="medium">
          Contained button MEDIUM
        </Button>
        <Button variant="contained" color="primary" size="small">
          Contained button SMALL
        </Button>
      </Headline>
      <Headline title="Headline test 3">
        <Button variant="text">Text button</Button>
        <Button variant="outlined" color="secondary">
          Outlined button
        </Button>
        <Typography variant="body2" color="textSecondary">
          Nějaký doplňující text vedle tlačítka
        </Typography>
      </Headline>
    </main>
  );
}
