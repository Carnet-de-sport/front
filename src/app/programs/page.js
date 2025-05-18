"use client";
import { useQuery, useMutation, gql } from "@apollo/client";
import {
  Container,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import ItemListWithModal from "@/components/ItemListWithModal";
import { getUserId } from "@/utils/auth";

const GET_PROGRAMS = gql`
  query GetPrograms($userId: ID!) {
    myPrograms(userId: $userId) {
      id
      name
      description
    }
  }
`;

const ADD_PROGRAM = gql`
  mutation AddProgram($userId: ID!, $name: String!, $description: String) {
    addProgram(userId: $userId, name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

export default function ProgramsPage() {
  const userId = typeof window !== "undefined" ? getUserId() : null;

  const { data, loading, error, refetch } = useQuery(GET_PROGRAMS, {
    skip: !userId,
    variables: { userId },
  });
  const [addProgram] = useMutation(ADD_PROGRAM);

  if (!userId)
    return <Typography>Connecte-toi pour voir tes programmes.</Typography>;
  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error.message}</Typography>;

  const handleAddProgram = async (values) => {
    await addProgram({ variables: { ...values, userId } });
    refetch();
  };

  return (
    <Container sx={{ mt: 5 }}>
      <ItemListWithModal
        items={data?.myPrograms || []}
        title="Mes Programmes"
        addLabel="Ajouter un programme"
        onAdd={handleAddProgram}
        renderItem={(program) => (
          <Card>
            <CardContent>
              <Typography variant="h6">{program.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {program.description}
              </Typography>
            </CardContent>
          </Card>
        )}
      />
    </Container>
  );
}
