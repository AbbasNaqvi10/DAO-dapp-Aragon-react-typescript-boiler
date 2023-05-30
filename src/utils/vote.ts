import {
  ContextPlugin,
  VoteProposalParams,
  TokenVotingClient,
  VoteProposalStep,
  VoteValues,
  Context,
} from "@aragon/sdk-client";
import { checkExecution } from "./checkExecution";

export const vote = async (context: Context, proposalId: string) => {
  // Instantiate a plugin context from the Aragon OSx SDK context.
  const contextPlugin: ContextPlugin = ContextPlugin.fromContext(context);

  // Create a TokenVoting client.
  const tokenVotingClient: TokenVotingClient = new TokenVotingClient(contextPlugin);

  const voteParams: VoteProposalParams = {
    proposalId: proposalId,
    vote: VoteValues.YES, // alternatively NO, or ABSTAIN
  };

  // Creates a vote on a given proposal created by the token voting governance mechanism.
  const steps = tokenVotingClient.methods.voteProposal(voteParams);
  let voted = false;

  for await (const step of steps) {
    try {
      switch (step.key) {
        case VoteProposalStep.VOTING:
          console.log({ txHash: step.txHash });
          break;
        case VoteProposalStep.DONE:
          voted = true;
          console.log("Voted");
          checkExecution(context, proposalId);
          break;
      }
    } catch (err) {
      console.error(err);
    }
  }
  return voted;
};
