import { CanVoteParams, Context, ContextPlugin, TokenVotingClient, VoteValues } from "@aragon/sdk-client";

export const checkVotingRights = async (context: Context, proposalId: string, voter: string) => {
  // Instantiate a plugin context from the Aragon OSx SDK context.
  const contextPlugin: ContextPlugin = ContextPlugin.fromContext(context);

  // Create an TokenVoting client.
  const tokenVotingClient: TokenVotingClient = new TokenVotingClient(contextPlugin);
  console.log("Proposal ID:", proposalId);
  console.log("voter:", voter);

  const canVoteParams: CanVoteParams = {
    proposalId: proposalId,
    voterAddressOrEns: voter, // your-plugin.plugin.dao.eth
    vote: VoteValues.YES, // alternatively, could be  NO or ABSTAIN.
  };

  // Returns true or false depending on whether the address can vote in the specific proposal.
  const canVote: boolean = await tokenVotingClient.methods.canVote(canVoteParams);
  console.log("Can vote? : ", canVote);

  return canVote;
};
