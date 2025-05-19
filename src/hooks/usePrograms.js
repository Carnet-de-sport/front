import { useQuery, useMutation, gql } from "@apollo/client";

const GET_PROGRAMS = gql`
  query GetPrograms {
    myPrograms {
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
    $name: String!
    $description: String
    $exercises: [ProgramExerciseInput]
  ) {
    addProgram(name: $name, description: $description, exercises: $exercises) {
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
  mutation DeleteProgram($id: ID!) {
    deleteProgram(id: $id) {
      id
    }
  }
`;

export function usePrograms() {
  const { data, loading, error, refetch } = useQuery(GET_PROGRAMS);

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
