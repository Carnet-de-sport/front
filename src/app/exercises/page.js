"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Container,
  Button,
} from "@mui/material";
import ItemListWithModal from "@/components/ItemListWithModal";
import { useExercises } from "@/hooks/useExercises";
import { getUserId } from "@/utils/auth";
import { useRouter } from "next/navigation";
import ShareItem from "@/components/ShareItem";

export default function ExercisesPage() {
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  const [shareOpen, setShareOpen] = useState(false);
  const [shareItemId, setShareItemId] = useState(null);

  const {
    exercises,
    loading,
    error,
    refetch,
    addExercise,
    deleteExercise,
    exerciseTypes,
    muscleGroups,
  } = useExercises(userId);

  useEffect(() => {
    setUserId(getUserId());
  }, []);

  useEffect(() => {
    // Ne redirige QUE si c'est vraiment "" ou false
    if (userId === "" || userId === false) {
      router.replace("/auth/login");
    }
  }, [userId, router]);

  if (userId === null) return <CircularProgress />;
  if (!userId)
    return <Typography>Connecte-toi pour voir tes programmes.</Typography>;

  const handleAddExercise = async (values) => {
    await addExercise({
      variables: {
        ...values,
      },
    });
    refetch();
  };

  const handleDeleteExercise = async (id) => {
    await deleteExercise({ variables: { id } });
    refetch();
  };

  return (
    <>
      <Container sx={{ mt: 5 }}>
        <ItemListWithModal
          items={exercises}
          title="Mes Exercices"
          addLabel="Ajouter un exercice"
          onAdd={handleAddExercise}
          onDelete={handleDeleteExercise}
          fields={[
            { name: "name", label: "Nom" },
            { name: "description", label: "Description" },
            {
              name: "muscles",
              label: "Muscles ciblés",
              type: "select",
              options: muscleGroups,
              multiple: true,
            },
            {
              name: "type",
              label: "Type d’exercice",
              type: "select",
              options: exerciseTypes,
            },
          ]}
          renderItem={(exercise) => (
            <Card>
              <CardContent>
                <Typography variant="h6">{exercise.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {exercise.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Muscles :{" "}
                  {Array.isArray(exercise.muscles)
                    ? exercise.muscles.join(", ")
                    : exercise.muscles}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Type : {exercise.type}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setShareOpen(true);
                    setShareItemId(exercise.id);
                  }}
                >
                  Partager
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => handleDeleteExercise(exercise.id)}
                >
                  Supprimer
                </Button>
              </CardContent>
            </Card>
          )}
        />
      </Container>
      <ShareItem
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        itemId={shareItemId}
        type="program"
      />
    </>
  );
}
