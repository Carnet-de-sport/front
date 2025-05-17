"use client";
import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
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

const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      id
      username
      email
    }
  }
`;

export default function RegisterForm() {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [register, { loading, error, data }] = useMutation(REGISTER_MUTATION);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register({ variables: inputs });
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
            Créer un compte
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
              name="email"
              label="Email"
              type="email"
              value={inputs.email}
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
              S'inscrire
            </Button>
            {error && (
              <Typography color="error" variant="body2">
                {error.message}
              </Typography>
            )}
            {data && (
              <Typography color="primary" variant="body2">
                Inscription réussie !
              </Typography>
            )}
          </Box>
          <Box mt={2} textAlign="center">
            <MuiLink component={Link} href="/auth/login" color="secondary">
              Déjà un compte ? Connecte-toi
            </MuiLink>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
