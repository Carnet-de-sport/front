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
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ShareItem from "@/components/ShareItem";

export default function ProgramsPage() {
  const [userId, setUserId] = useState(undefined);
  const router = useRouter();

  const [shareOpen, setShareOpen] = useState(false);
  const [shareItemId, setShareItemId] = useState(null);

  const {
    programs,
    loading: loadingPrograms,
    error: errorPrograms,
    refetch,
    addProgram,
    deleteProgram,
  } = usePrograms();

  const {
    exercises,
    loading: loadingExercises,
    error: errorExercises,
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

  const handleAddProgram = async (values) => {
    await addProgram({
      variables: {
        name: values.name,
        description: values.description,
        exercises: values.exercises,
      },
    });
    refetch();
  };

  const handleDeleteProgram = async (id) => {
    await deleteProgram({ variables: { id } });
    refetch();
  };

  const exerciseOptions = Array.isArray(exercises)
    ? exercises.map((ex) => ({ value: ex.id, label: ex.name }))
    : [];

  return (
    <>
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
                <div style={{ marginBottom: 8 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Exercices :
                  </Typography>
                  {program.exercises && program.exercises.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {program.exercises.map((ex, i) => {
                        const exo = exerciseOptions.find(
                          (opt) => opt.value === ex.exerciseId
                        );
                        return (
                          <li key={i} style={{ marginBottom: 4 }}>
                            <b>{exo?.label || ex.exerciseId}</b>
                            {typeof ex.sets !== "undefined" && (
                              <>
                                {" — "}
                                <span>
                                  Séries : {ex.sets ?? "-"}, Reps :{" "}
                                  {ex.reps ?? "-"}, Poids : {ex.weight ?? "-"}
                                </span>
                              </>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Aucun
                    </Typography>
                  )}
                </div>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setShareOpen(true);
                    setShareItemId(program.id);
                  }}
                >
                  Partager
                </Button>
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
      <ShareItem
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        itemId={shareItemId}
        type="program"
      />
    </>
  );
}
