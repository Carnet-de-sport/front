"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Container,
} from "@mui/material";
import ItemListWithModal from "@/components/ItemListWithModal";
import { getUserId } from "@/utils/auth";

const GET_PROGRAMS = gql`
  query GetPrograms($userId: ID!) {
    myPrograms(userId: $userId) {
      id
      name
      description
      exercises {
        exerciseId
        reps
        sets
        weight
      }
    }
  }
`;

const GET_EXERCISES = gql`
  query GetExercises($userId: ID!) {
    myExercises(userId: $userId) {
      id
      name
    }
  }
`;

const ADD_PROGRAM = gql`
  mutation AddProgram(
    $userId: ID!
    $name: String!
    $description: String
    $exercises: [ProgramExerciseInput]
  ) {
    addProgram(
      userId: $userId
      name: $name
      description: $description
      exercises: $exercises
    ) {
      id
      name
      description
      exercises {
        exerciseId
        reps
        sets
        weight
      }
    }
  }
`;

export default function ProgramsPage() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setUserId(getUserId());
  }, []);

  // Query pour les programmes
  const { data, loading, error, refetch } = useQuery(GET_PROGRAMS, {
    skip: !userId,
    variables: { userId },
  });

  // Query pour les exercices disponibles
  const {
    data: exercisesData,
    loading: loadingEx,
    error: errorEx,
  } = useQuery(GET_EXERCISES, {
    skip: !userId,
    variables: { userId },
  });

  const [addProgram] = useMutation(ADD_PROGRAM);

  if (userId === null) return <CircularProgress />;
  if (!userId)
    return <Typography>Connecte-toi pour voir tes programmes.</Typography>;
  if (loading || loadingEx) return <CircularProgress />;
  if (error) return <Typography color="error">{error.message}</Typography>;
  if (errorEx) return <Typography color="error">{errorEx.message}</Typography>;

  const exerciseOptions =
    exercisesData?.myExercises?.map((ex) => ({
      value: ex.id,
      label: ex.name,
    })) || [];

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

  return (
    <Container sx={{ mt: 5 }}>
      <ItemListWithModal
        items={data?.myPrograms || []}
        title="Mes Programmes"
        addLabel="Ajouter un programme"
        onAdd={handleAddProgram}
        fields={[
          { name: "name", label: "Nom" },
          { name: "description", label: "Description" },
          {
            name: "exercises",
            label: "Exercices inclus",
            type: "select",
            options: exerciseOptions.map((opt) => opt.label),
            optionValues: exerciseOptions.map((opt) => opt.value),
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
            </CardContent>
          </Card>
        )}
      />
    </Container>
  );
}
