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
  MenuItem,
} from "@mui/material";

export default function ItemListWithModal({
  items,
  title,
  addLabel,
  onAdd,
  renderItem,
  fields = [],
}) {
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormState({});
  };

  const handleChange = (e) => {
    const { name, value, multiple, options } = e.target;
    // Gère les selects multiples (muscles)
    if (multiple) {
      const values = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setFormState({ ...formState, [name]: values });
    } else {
      setFormState({ ...formState, [name]: value });
    }
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
          {fields.map((field) =>
            field.type === "select" ? (
              <TextField
                key={field.name}
                margin="dense"
                select
                name={field.name}
                label={field.label}
                fullWidth
                variant="standard"
                onChange={handleChange}
                SelectProps={{
                  multiple: field.multiple || false,
                }}
                value={formState[field.name] || (field.multiple ? [] : "")}
              >
                {field.options.map((option, idx) => (
                  <MenuItem
                    key={field.optionValues ? field.optionValues[idx] : option}
                    value={
                      field.optionValues ? field.optionValues[idx] : option
                    }
                  >
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                key={field.name}
                margin="dense"
                name={field.name}
                label={field.label}
                type={field.type || "text"}
                fullWidth
                variant="standard"
                onChange={handleChange}
                value={formState[field.name] || ""}
              />
            )
          )}
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
