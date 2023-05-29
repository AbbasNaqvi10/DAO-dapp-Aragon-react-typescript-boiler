import {
  ContextPlugin,
  CreateMajorityVotingProposalParams,
  DaoAction,
  ProposalCreationSteps,
  TokenVotingClient,
  VoteValues,
  VotingMode,
  VotingSettings,
  Context,
} from "@aragon/sdk-client";
import axios from "axios";

// Instantiate a plugin context from the Aragon OSx SDK context.

export const createProposalWithAction = async (context: Context, pluginAddresses: Array<string>) => {
  const contextPlugin: ContextPlugin = ContextPlugin.fromContext(context);

  // Create a TokenVoting client.
  const tokenVotingClient: TokenVotingClient = new TokenVotingClient(contextPlugin);

  // The contract address of the token voting plugin you have installed in your DAO
  const pluginAddress: string = pluginAddresses[1];

  // Update
  // [Optional] In case you wanted to pass an action to the proposal, you can configure it here and pass it immediately. An action is the encoded transaction which will get executed when a proposal passes.
  // In this example, we are creating an action to change the settings of a governance plugin to demonstrate how to set it up.
  const configActionParams: VotingSettings = {
    minDuration: 60 * 60 * 24 * 2, // seconds
    minParticipation: 0.25, // 25%
    supportThreshold: 0.5, // 50%
    minProposerVotingPower: BigInt("0"), // default 0
    votingMode: VotingMode.STANDARD, // default STANDARD, other options: EARLY_EXECUTION, VOTE_REPLACEMENT
  };
  // We need to encode the action so it can executed once the proposal passes.
  const updatePluginSettingsAction: DaoAction = tokenVotingClient.encoding.updatePluginSettingsAction(
    pluginAddress,
    configActionParams
  );

  console.log("before metadatauri");

  const metadataUri: string = await tokenVotingClient.methods.pinMetadata({
    title: "Test proposal",
    summary: "This is a test proposal",
    description: "This is the description of a long test proposal",
    resources: [
      {
        url: "https://thforumurl.com",
        name: "Forum",
      },
    ],
    media: {
      header: "https://fileserver.com/header.png",
      logo: "https://fileserver.com/logo.png",
    },
  });

  console.log("after metadatauri");
  console.log("metadata Uri: ", metadataUri);
  // const formData = new FormData();
  // const metadata = {
  //   title: "Test proposal",
  //   summary: "This is a test proposal",
  //   description: "This is the description of a long test proposal",
  //   resources: [
  //     {
  //       url: "https://thforumurl.com",
  //       name: "Forum",
  //     },
  //   ],
  //   media: {
  //     header: "https://fileserver.com/header.png",
  //     logo: "https://fileserver.com/logo.png",
  //   },
  // };

  // formData.append("pinataMetadata", JSON.stringify(metadata));

  // // Through pinning the metadata in IPFS, we can get the IPFS URI. You can read more about it here: https://docs.ipfs.tech/how-to/pin-files/

  // const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
  //   headers: {
  //     "Content-Type": `application/json`,
  //     Authorization:
  //       "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1YjU1ODg4OC1iNWY5LTQzNzUtYmFkMC0yN2JiZmM2ODBjNmIiLCJlbWFpbCI6ImFiYmFzbmFxdmlAZGVjaGFpbnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImIxOGMxYTg1ZmJjMzljNzU4NzgyIiwic2NvcGVkS2V5U2VjcmV0IjoiMzgxMjI0ZDY0MjljNmIyNDljNDdlN2M3NTA4YjFmZTE2NjhhNjNjZGM3ZDU0MmQ5ZmY2Mjk4YWU1MmJlNDA1YyIsImlhdCI6MTY4NDMyNTI1NH0.0DiBxrBDhVnwcuO5iWIZWS-8infoHaw-s1nLdFt_ul8",
  //   },
  // });
  // console.log(res.data);

  // const metadataUri = res.data.IpfsHash;

  let endDate = new Date(new Date().getTime() + 60 * 60 * 60 * 24);
  const proposalParams: CreateMajorityVotingProposalParams = {
    pluginAddress: pluginAddresses[1], // the address of the TokenVoting plugin contract containing all plugin logic.
    metadataUri,
    actions: [updatePluginSettingsAction], // optional, if none, leave an empty array `[]`
    startDate: new Date(),
    endDate: endDate,
    executeOnPass: false,
    creatorVote: VoteValues.YES, // default NO, other options: ABSTAIN, YES
  };

  // Creates a proposal using the token voting governance mechanism, which executes with the parameters set in the configAction object.
  const steps = tokenVotingClient.methods.createProposal(proposalParams);
  let proposalId: string | undefined;

  for await (const step of steps) {
    try {
      switch (step.key) {
        case ProposalCreationSteps.CREATING:
          console.log(step.txHash);
          break;
        case ProposalCreationSteps.DONE:
          proposalId = step.proposalId;
          console.log(step.proposalId);
          break;
      }
    } catch (err) {
      console.error(err);
    }
  }
  return proposalId;
};
