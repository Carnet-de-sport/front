"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Navbar() {
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => setIsAuth(!!localStorage.getItem("token"));
    checkAuth();

    window.addEventListener("storage", checkAuth);
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    window.dispatchEvent(new Event("authChange"));
    toast.success("Déconnecté !");
    router.push("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Carnet d'Entraînement
        </Typography>
        <Box>
          <Button color="inherit" component={Link} href="/">
            Accueil
          </Button>
          <Button color="inherit" component={Link} href="/programs">
            Programmes
          </Button>
          <Button color="inherit" component={Link} href="/exercises">
            Exercices
          </Button>

          {!isAuth ? (
            <Button color="inherit" component={Link} href="/auth/login">
              Login
            </Button>
          ) : (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
