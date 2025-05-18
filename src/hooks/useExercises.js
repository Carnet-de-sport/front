import { useQuery, useMutation, gql } from "@apollo/client";

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

const DELETE_EXERCISE = gql`
  mutation DeleteExercise($id: ID!, $userId: ID!) {
    deleteExercise(id: $id, userId: $userId) {
      id
    }
  }
`;

const GET_OPTIONS = gql`
  query GetOptions {
    exerciseTypes
    muscleGroups
  }
`;

export function useExercises(userId) {
  const { data, loading, error, refetch } = useQuery(GET_EXERCISES, {
    skip: !userId,
    variables: { userId },
  });

  const [addExercise] = useMutation(ADD_EXERCISE);
  const [deleteExercise] = useMutation(DELETE_EXERCISE);

  const {
    data: optionsData,
    loading: optionsLoading,
    error: optionsError,
  } = useQuery(GET_OPTIONS);

  const exerciseTypes =
    optionsData?.exerciseTypes?.map((t) => ({ value: t, label: t })) || [];
  const muscleGroups =
    optionsData?.muscleGroups?.map((m) => ({ value: m, label: m })) || [];

  return {
    exercises: data?.myExercises || [],
    loading: loading || optionsLoading,
    error: error || optionsError,
    refetch,
    addExercise,
    deleteExercise,
    exerciseTypes,
    muscleGroups,
  };
}
