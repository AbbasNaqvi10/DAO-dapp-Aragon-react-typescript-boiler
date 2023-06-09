import { Context, ContextPlugin, ExecuteProposalStep, TokenVotingClient } from "@aragon/sdk-client";

export const executeProposal = async (context: Context, proposalId: string) => {
  // Insantiate a plugin context from the Aragon OSx SDK context.
  const contextPlugin: ContextPlugin = ContextPlugin.fromContext(context);
  // Insantiate a TokenVoting client.
  const tokenVotingClient = new TokenVotingClient(contextPlugin);

  // Executes the actions of a TokenVoting proposal.
  const steps = tokenVotingClient.methods.executeProposal(proposalId);

  for await (const step of steps) {
    try {
      switch (step.key) {
        case ExecuteProposalStep.EXECUTING:
          console.log({ txHash: step.txHash });
          break;
        case ExecuteProposalStep.DONE:
          console.log("Executed ", proposalId);
          break;
      }
    } catch (err) {
      console.error(err);
    }
  }
};
