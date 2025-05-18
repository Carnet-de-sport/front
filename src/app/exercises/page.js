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

const GET_EXERCISES = gql`
  query GetExercises($userId: ID!) {
    myExercises(userId: $userId) {
      id
      name
      description
      muscles
      type
    }
  }
`;

const ADD_EXERCISE = gql`
  mutation AddExercise(
    $userId: ID!
    $name: String!
    $description: String
    $muscles: [String]
    $type: String
  ) {
    addExercise(
      userId: $userId
      name: $name
      description: $description
      muscles: $muscles
      type: $type
    ) {
      id
      name
      description
      muscles
      type
    }
  }
`;
const GET_OPTIONS = gql`
  query GetOptions {
    exerciseTypes
    muscleGroups
  }
`;

export default function ExercisesPage() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setUserId(getUserId());
  }, []);

  const { data, loading, error, refetch } = useQuery(GET_EXERCISES, {
    skip: !userId,
    variables: { userId },
  });

  const {
    data: optionsData,
    loading: optionsLoading,
    error: optionsError,
  } = useQuery(GET_OPTIONS);

  const [addExercise] = useMutation(ADD_EXERCISE);

  if (userId === null) return <CircularProgress />;
  if (!userId)
    return <Typography>Connecte-toi pour voir tes exercices.</Typography>;
  if (loading || optionsLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error.message}</Typography>;
  if (optionsError)
    return <Typography color="error">{optionsError.message}</Typography>;

  const exerciseTypes = optionsData.exerciseTypes;
  const muscleGroups = optionsData.muscleGroups;

  const handleAddExercise = async (values) => {
    await addExercise({
      variables: {
        ...values,
        userId,
      },
    });
    refetch();
  };

  return (
    <Container sx={{ mt: 5 }}>
      <ItemListWithModal
        items={data?.myExercises || []}
        title="Mes Exercices"
        addLabel="Ajouter un exercice"
        onAdd={handleAddExercise}
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
            </CardContent>
          </Card>
        )}
      />
    </Container>
  );
}
