"use client";
import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Link as MuiLink,
} from "@mui/material";
import Link from "next/link";

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

export default function LoginForm() {
  const [inputs, setInputs] = useState({ username: "", password: "" });
  const [login, { loading, error, data }] = useMutation(LOGIN_MUTATION);
  const router = useRouter();

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login({ variables: inputs });
    const token = result.data?.login?.token;
    if (token) {
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("authChange"));
      toast.success("Connecté");
      router.push("/"); // "/programs"
    } else {
      toast.error("Erreur de connexion");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 12 }}>
      <Card
        sx={{
          p: 2,
          borderRadius: 4,
          background: "#292e3c",
          boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">
            Connexion
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              name="username"
              label="Nom d'utilisateur"
              value={inputs.username}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              value={inputs.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              Se connecter
            </Button>
            {error && (
              <Typography color="error" variant="body2">
                {error.message}
              </Typography>
            )}
            {data && (
              <Typography color="primary" variant="body2">
                Connexion réussie !
              </Typography>
            )}
          </Box>
          <Box mt={2} textAlign="center">
            <MuiLink component={Link} href="/auth/register" color="secondary">
              Pas de compte ? Inscris-toi
            </MuiLink>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
