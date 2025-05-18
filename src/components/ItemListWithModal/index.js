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
    if (multiple) {
      const values = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setFormState({ ...formState, [name]: values });
    } else {
      setFormState({ ...formState, [name]: value });
    }
  };

  // Ajoute cette fonction !
  const handleExtraFieldChange = (exId, field, value) => {
    setFormState((prev) => ({
      ...prev,
      [`${field}_${exId}`]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      fields.some(
        (f) => f.name === "exercises" && f.type === "select" && f.multiple
      )
    ) {
      const exercisesArr = (formState.exercises || []).map((exId) => ({
        exerciseId: exId,
        sets: Number(formState[`sets_${exId}`]) || null,
        reps: Number(formState[`reps_${exId}`]) || null,
        weight: Number(formState[`weight_${exId}`]) || null,
      }));
      onAdd({ ...formState, exercises: exercisesArr });
    } else {
      onAdd(formState);
    }
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
            // Cas particulier : création de programme avec exercises multiples
            field.type === "select" &&
            field.multiple &&
            field.name === "exercises" ? (
              <div key={field.name}>
                <TextField
                  margin="dense"
                  select
                  name={field.name}
                  label={field.label}
                  fullWidth
                  variant="standard"
                  onChange={handleChange}
                  SelectProps={{
                    multiple: true,
                  }}
                  value={formState[field.name] || []}
                >
                  {field.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                {/* Ajout champs sets/reps/weight pour chaque exo sélectionné */}
                {(formState[field.name] || []).map((exId) => (
                  <div
                    key={exId}
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <Typography variant="body2" sx={{ minWidth: 100 }}>
                      {field.options.find((o) => o.value === exId)?.label ||
                        exId}
                    </Typography>
                    <TextField
                      label="Séries"
                      type="number"
                      size="small"
                      variant="standard"
                      style={{ width: 70 }}
                      value={formState[`sets_${exId}`] || ""}
                      onChange={(e) =>
                        handleExtraFieldChange(exId, "sets", e.target.value)
                      }
                    />
                    <TextField
                      label="Reps"
                      type="number"
                      size="small"
                      variant="standard"
                      style={{ width: 70 }}
                      value={formState[`reps_${exId}`] || ""}
                      onChange={(e) =>
                        handleExtraFieldChange(exId, "reps", e.target.value)
                      }
                    />
                    <TextField
                      label="Poids"
                      type="number"
                      size="small"
                      variant="standard"
                      style={{ width: 70 }}
                      value={formState[`weight_${exId}`] || ""}
                      onChange={(e) =>
                        handleExtraFieldChange(exId, "weight", e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            ) : field.type === "select" ? (
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
                {field.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
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
