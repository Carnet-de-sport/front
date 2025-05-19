"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { useShareItem } from "@/hooks/useShareItem";

export default function ShareDialog({
  open,
  onClose,
  itemId,
  type = "program",
}) {
  const [userIdToShare, setUserIdToShare] = useState("");
  const { shareItem, loading, error } = useShareItem(type);

  const handleShare = async () => {
    if (!userIdToShare) return;
    try {
      await shareItem({ variables: { id: itemId, userIdToShare } });
      toast.success(
        type === "program" ? "Programme partagé !" : "Exercice partagé !"
      );
      setUserIdToShare("");
      onClose();
    } catch (e) {
      toast.error("Erreur lors du partage");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Partager {type === "program" ? "le programme" : "l'exercice"}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" mb={2}>
          Saisis l’ID de l’utilisateur avec qui partager&nbsp;:
        </Typography>
        <TextField
          autoFocus
          label="ID utilisateur"
          value={userIdToShare}
          onChange={(e) => setUserIdToShare(e.target.value)}
          fullWidth
          disabled={loading}
        />
        {error && (
          <Typography color="error" variant="body2" mt={1}>
            {error.message}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          onClick={handleShare}
          variant="contained"
          disabled={loading || !userIdToShare}
        >
          Partager
        </Button>
      </DialogActions>
    </Dialog>
  );
}
