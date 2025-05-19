import { gql, useMutation } from "@apollo/client";

export function useShareItem(type = "program") {
  const mutation = gql`
      mutation ShareItem($id: ID!, $usernameToShare: String!) {
        ${type === "program" ? "shareProgram" : "shareExercise"}(
          ${type === "program" ? "programId" : "exerciseId"}: $id,
          usernameToShare: $usernameToShare
        ) {
          id
          sharedWith
        }
      }
    `;
  const [shareItem, { loading, error }] = useMutation(mutation);

  return { shareItem, loading, error };
}
