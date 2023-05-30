import { Context, ContextPlugin, TokenVotingClient, TokenVotingProposal } from "@aragon/sdk-client";

export const getProposal = async (context: Context, proposalId: string) => {
  // Instantiate a plugin context from an Aragon OSx SDK context.
  const contextPlugin: ContextPlugin = ContextPlugin.fromContext(context);
  // Create a TokenVoting client.
  const tokenVotingClient: TokenVotingClient = new TokenVotingClient(contextPlugin);

  // The address of the proposal you want to retrieve.

  // Get a specific proposal created using the TokenVoting plugin.
  const tokenVotingProposal: TokenVotingProposal | null = await tokenVotingClient.methods.getProposal(proposalId);
  console.log(tokenVotingProposal);
};
