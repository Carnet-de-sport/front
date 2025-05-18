import { useQuery, useMutation, gql } from "@apollo/client";

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

const DELETE_PROGRAM = gql`
  mutation DeleteProgram($id: ID!, $userId: ID!) {
    deleteProgram(id: $id, userId: $userId) {
      id
    }
  }
`;

export function usePrograms(userId) {
  const { data, loading, error, refetch } = useQuery(GET_PROGRAMS, {
    skip: !userId,
    variables: { userId },
  });

  const [addProgram] = useMutation(ADD_PROGRAM);
  const [deleteProgram] = useMutation(DELETE_PROGRAM);

  return {
    programs: data?.myPrograms || [],
    loading,
    error,
    refetch,
    addProgram,
    deleteProgram,
  };
}
