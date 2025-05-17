"use client";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Grid,
} from "@mui/material";

export default function Home() {
  return (
    <Box sx={{ background: "background.default", minHeight: "100vh", py: 8 }}>
      <Container maxWidth="md">
        <Typography
          variant="h3"
          align="center"
          color="primary"
          fontWeight={700}
          gutterBottom
        >
          Carnet d'Entraînement
        </Typography>
        <Typography align="center" color="text.secondary" sx={{ mb: 6 }}>
          Gérez vos séances de sport avec une interface moderne et sombre.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" color="primary" fontWeight={600}>
                  📈 Suivi intelligent
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  Visualisez vos progrès et adaptez vos programmes en toute
                  simplicité.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, borderRadius: 3 }}
                  fullWidth
                >
                  Voir mes programmes
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" color="secondary" fontWeight={600}>
                  🏋️‍♂️ Exos personnalisés
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  Créez et partagez vos exercices avec un look dark élégant.
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ mt: 3, borderRadius: 3 }}
                  fullWidth
                >
                  Créer un exercice
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
