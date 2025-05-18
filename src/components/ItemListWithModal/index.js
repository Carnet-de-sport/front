"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

export default function ItemListWithModal({
  items,
  title,
  addLabel,
  onAdd,
  renderItem,
}) {
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormState({});
  };

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onAdd(formState);
    handleClose();
  };

  return (
    <>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4" color="primary">
          {title}
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleOpen}>
          {addLabel}
        </Button>
      </Grid>
      <Grid container spacing={3}>
        {items.length === 0 && (
          <Typography variant="body2" sx={{ ml: 2 }}>
            Aucun élément pour l’instant.
          </Typography>
        )}
        {items.map((item) => (
          <Grid item xs={12} md={6} key={item.id}>
            {renderItem(item)}
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{addLabel}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Nom"
            fullWidth
            variant="standard"
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            variant="standard"
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
