"use client";
import Link from "next/link";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Carnet d'Entraînement
        </Typography>
        <Box>
          <Button color="inherit" component={Link} href="/">
            Accueil
          </Button>
          <Button color="inherit" component={Link} href="/auth/login">
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
