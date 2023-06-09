import {
  DaoMetadata,
  CreateDaoParams,
  DaoCreationSteps,
  GasFeeEstimation,
  Client,
  TokenVotingClient,
  TokenVotingPluginInstall,
  VotingMode,
} from "@aragon/sdk-client";

export const createDAO = async (client: Client) => {
  // These would be the plugin params if you need to mint a new token for the DAO to enable TokenVoting.
  const tokenVotingPluginInstallParams2: TokenVotingPluginInstall = {
    votingSettings: {
      minDuration: 60 * 60 * 24 * 2, // seconds (minimum amount is 3600)
      minParticipation: 0.25, // 25%
      supportThreshold: 0.5, // 50%
      // minProposerVotingPower: BigInt("5000"), // default 0
      votingMode: VotingMode.EARLY_EXECUTION, // default is STANDARD. other options: EARLY_EXECUTION, VOTE_REPLACEMENT
    },
    newToken: {
      name: "WWrapped newToken", // the name of your token
      symbol: "WWWWNTK", // the symbol for your token. shouldn't be more than 5 letters
      decimals: 18, // the number of decimals your token uses
      minter: "0x6bd965c02a598ABEc0E9441F05224021464063Ce", // optional. if you don't define any, we'll use the standard OZ ERC20 contract. Otherwise, you can define your own token minter contract address.
      balances: [
        {
          // Defines the initial balances of the new token
          address: "0x6bd965c02a598ABEc0E9441F05224021464063Ce", // address of the account to receive the newly minted tokens
          balance: BigInt(300), // amount of tokens that address should receive
        },
        {
          address: "0x8be54244f479A99758e88fb29B0955CD083a8a38",
          balance: BigInt(200),
        },
        {
          address: "0x15Fa09fe20a3d37A45f871c13aD3e5Ba854cE0Ee",
          balance: BigInt(200),
        },
        {
          address: "0x8142292f1E899499a4A09a29aa0fFd827a43edF0",
          balance: BigInt(200),
        },
      ],
    },
  };

  // Creates a TokenVoting plugin client with the parameteres defined above (with an existing token).
  // const tokenVotingPluginInstallItem1 = TokenVotingClient.encoding.getPluginInstallItem(
  //   tokenVotingPluginInstallParams1,
  //   80001
  // );
  // // Creates a TokenVoting plugin client with the parameteres defined above (with newly minted tokens).
  const tokenVotingPluginInstallItem2 = TokenVotingClient.encoding.getPluginInstallItem(
    tokenVotingPluginInstallParams2,
    80001
  );

  // Pin metadata to IPFS, returns IPFS CID string.
  const metadata: DaoMetadata = {
    name: "dechainsss DAO" + Math.floor(Math.random() * 42069),
    description: "This is a description",
    avatar: "image-url",
    links: [
      {
        name: "Web site",
        url: "https://google.com",
      },
    ],
  };

  const formData = new FormData();

  formData.append("pinataMetadata", JSON.stringify(metadata));

  // Through pinning the metadata in IPFS, we can get the IPFS URI. You can read more about it here: https://docs.ipfs.tech/how-to/pin-files/

  // const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
  //   headers: {
  //     "Content-Type": `application/json`,
  //     Authorization:
  //       "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1YjU1ODg4OC1iNWY5LTQzNzUtYmFkMC0yN2JiZmM2ODBjNmIiLCJlbWFpbCI6ImFiYmFzbmFxdmlAZGVjaGFpbnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImIxOGMxYTg1ZmJjMzljNzU4NzgyIiwic2NvcGVkS2V5U2VjcmV0IjoiMzgxMjI0ZDY0MjljNmIyNDljNDdlN2M3NTA4YjFmZTE2NjhhNjNjZGM3ZDU0MmQ5ZmY2Mjk4YWU1MmJlNDA1YyIsImlhdCI6MTY4NDMyNTI1NH0.0DiBxrBDhVnwcuO5iWIZWS-8infoHaw-s1nLdFt_ul8",
  //   },
  // });
  // console.log(res.data);

  // const metadataUri = res.data.IpfsHash;

  const metadataUri: string = await client.methods.pinMetadata({
    name: "Dechains DAO" + Math.floor(Math.random() * 42069),
    description: "This is a description",
    avatar: "", // image url
    links: [
      {
        name: "Web site",
        url: "https://www.dechains.com",
      },
    ],
  });

  const createParams: CreateDaoParams = {
    metadataUri,
    ensSubdomain: "votingdao" + Math.floor(Math.random() * 42069), // my-org.dao.eth
    plugins: [tokenVotingPluginInstallItem2],
  };

  console.log("before estimation", createParams);

  try {
    // Estimate gas for the transaction.
    const estimatedGas: GasFeeEstimation = await client.estimation.createDao(createParams);
    console.log({ avg: estimatedGas.average, max: estimatedGas.max });
  } catch (ex: any) {
    console.error(ex);
  }

  let daoAddress: string | undefined;
  let pluginAddresses: Array<string> | undefined;

  // Creates a DAO with a Multisig plugin installed.
  const steps = client.methods.createDao(createParams);
  for await (const step of steps) {
    try {
      switch (step.key) {
        case DaoCreationSteps.CREATING:
          console.log({ txHash: step.txHash });
          break;
        case DaoCreationSteps.DONE:
          daoAddress = step.address;
          pluginAddresses = step.pluginAddresses;
          console.log(step);
          break;
      }
    } catch (err) {
      console.error(err);
    }
  }

  return { daoAddress: daoAddress, pluginAddresses: pluginAddresses };
};
