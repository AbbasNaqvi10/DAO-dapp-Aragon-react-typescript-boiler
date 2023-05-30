import { Context, ContextPlugin, TokenVotingClient } from "@aragon/sdk-client";

export const checkExecution = async (context: Context, proposalId: string) => {
  // Instantiate a plugin context from the Aragon OSx SDK context.
  const contextPlugin: ContextPlugin = ContextPlugin.fromContext(context);
  // Instantiate a TokenVoting client.
  const tokenVotingClient: TokenVotingClient = new TokenVotingClient(contextPlugin);

  // Checks whether the signer of the transaction can execute a given proposal.
  const canExecute = await tokenVotingClient.methods.canExecute(proposalId);
  console.log("can execute? ", canExecute);
};
