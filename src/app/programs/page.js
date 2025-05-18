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
import { getUserId } from "@/utils/auth";
import { usePrograms } from "@/hooks/usePrograms";
import { useExercises } from "@/hooks/useExercises";

export default function ProgramsPage() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setUserId(getUserId());
  }, []);

  const { programs, loading, error, refetch, addProgram, deleteProgram } =
    usePrograms(userId);

  const {
    exercises,
    loading: loadingEx,
    error: errorEx,
  } = useExercises(userId);

  if (userId === null) return <CircularProgress />;
  if (!userId)
    return <Typography>Connecte-toi pour voir tes programmes.</Typography>;
  if (loading || loadingEx) return <CircularProgress />;
  if (error) return <Typography color="error">{error.message}</Typography>;
  if (errorEx) return <Typography color="error">{errorEx.message}</Typography>;

  const handleAddProgram = async (values) => {
    const exercises = (values.exercises || []).map((id) => ({
      exerciseId: id,
      reps: null,
      sets: null,
      weight: null,
    }));
    await addProgram({
      variables: {
        userId,
        name: values.name,
        description: values.description,
        exercises,
      },
    });
    refetch();
  };

  const handleDeleteProgram = async (id) => {
    await deleteProgram({ variables: { id, userId } });
    refetch();
  };

  const exerciseOptions = Array.isArray(exercises)
    ? exercises.map((ex) => ({ value: ex.id, label: ex.name }))
    : [];

  return (
    <Container sx={{ mt: 5 }}>
      <ItemListWithModal
        items={programs}
        title="Mes Programmes"
        addLabel="Ajouter un programme"
        onAdd={handleAddProgram}
        onDelete={handleDeleteProgram}
        fields={[
          { name: "name", label: "Nom" },
          { name: "description", label: "Description" },
          {
            name: "exercises",
            label: "Exercices inclus",
            type: "select",
            options: exerciseOptions,
            multiple: true,
          },
        ]}
        renderItem={(program) => (
          <Card>
            <CardContent>
              <Typography variant="h6">{program.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {program.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Exercices :
                {program.exercises && program.exercises.length > 0
                  ? program.exercises.map((ex, i) => (
                      <span key={i}>
                        {exerciseOptions.find(
                          (opt) => opt.value === ex.exerciseId
                        )?.label || ex.exerciseId}
                        {i < program.exercises.length - 1 ? ", " : ""}
                      </span>
                    ))
                  : " Aucun"}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                size="small"
                sx={{ mt: 1 }}
                onClick={() => handleDeleteProgram(program.id)}
              >
                Supprimer
              </Button>
            </CardContent>
          </Card>
        )}
      />
    </Container>
  );
}
