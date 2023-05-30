import {
  DaoMetadata,
  CreateDaoParams,
  DaoCreationSteps,
  GasFeeEstimation,
  MultisigClient,
  MultisigPluginInstallParams,
  Client,
  TokenVotingClient,
  TokenVotingPluginInstall,
  VotingMode,
} from "@aragon/sdk-client";
import axios from "axios";

export const createDAO = async (client: Client) => {
  // Addresses which will be allowed to vote in the Multisig plugin.
  const members: string[] = [
    "0xe3be75e256a92725Ae82E8FB72AE7794382f4F11",
    "0x4BB89b62F7171d172D61AE01311633A5C7848F28",
    "0x34D2e950a33dbCB4D8FbcfcA51811FFB34BeC66F",
    "0x436E0304EF6152CcD93D16e43acBe097ed9c4B37",
    "0x6c844CAdCd636130397f3d44796045d8BB4A70Dc",
  ];

  const multisigPluginIntallParams: MultisigPluginInstallParams = {
    votingSettings: {
      minApprovals: 1,
      onlyListed: false,
    },
    members,
  };

  // Encodes the parameters of the Multisig plugin. These will get used in the installation plugin for the DAO.
  const multisigPluginInstallItem = MultisigClient.encoding.getPluginInstallItem(multisigPluginIntallParams, 80001);

  // You can do different types of installations, depending on your needs.
  // For ex, these would be the plugin params if you want to use an already-existing ERC20 token.
  // const tokenVotingPluginInstallParams1: TokenVotingPluginInstall = {
  //   votingSettings: {
  //     minDuration: 60 * 60 * 24 * 2, // seconds (minimum amount is 3600)
  //     minParticipation: 0.25, // 25%
  //     supportThreshold: 0.5, // 50%
  //     minProposerVotingPower: BigInt("5000"), // default 0
  //     votingMode: VotingMode.STANDARD, // default standard, other options: EARLY_EXECUTION, VOTE_REPLACEMENT
  //   },
  //   useToken: {
  //     tokenAddress: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889", // contract address of the token to use as the voting token
  //     wrappedToken: {
  //       name: "Wrapper Matic", // the name of your token
  //       symbol: "WMATIC", // the symbol for your token. shouldn't be more than 5 letters
  //     },
  //   },
  // };

  // // These would be the plugin params if you need to mint a new token for the DAO to enable TokenVoting.
  const tokenVotingPluginInstallParams2: TokenVotingPluginInstall = {
    votingSettings: {
      minDuration: 60 * 60 * 24 * 2, // seconds (minimum amount is 3600)
      minParticipation: 0.25, // 25%
      supportThreshold: 0.5, // 50%
      // minProposerVotingPower: BigInt("5000"), // default 0
      votingMode: VotingMode.EARLY_EXECUTION, // default is STANDARD. other options: EARLY_EXECUTION, VOTE_REPLACEMENT
    },
    newToken: {
      name: "Wrapped newToken", // the name of your token
      symbol: "WNTK", // the symbol for your token. shouldn't be more than 5 letters
      decimals: 18, // the number of decimals your token uses
      minter: "0x6c844CAdCd636130397f3d44796045d8BB4A70Dc", // optional. if you don't define any, we'll use the standard OZ ERC20 contract. Otherwise, you can define your own token minter contract address.
      balances: [
        {
          // Defines the initial balances of the new token
          address: "0x6c844CAdCd636130397f3d44796045d8BB4A70Dc", // address of the account to receive the newly minted tokens
          balance: BigInt(200), // amount of tokens that address should receive
        },
        {
          address: "0x436E0304EF6152CcD93D16e43acBe097ed9c4B37",
          balance: BigInt(300),
        },
        {
          address: "0xe3be75e256a92725Ae82E8FB72AE7794382f4F11",
          balance: BigInt(10),
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

  const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
    headers: {
      "Content-Type": `application/json`,
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1YjU1ODg4OC1iNWY5LTQzNzUtYmFkMC0yN2JiZmM2ODBjNmIiLCJlbWFpbCI6ImFiYmFzbmFxdmlAZGVjaGFpbnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImIxOGMxYTg1ZmJjMzljNzU4NzgyIiwic2NvcGVkS2V5U2VjcmV0IjoiMzgxMjI0ZDY0MjljNmIyNDljNDdlN2M3NTA4YjFmZTE2NjhhNjNjZGM3ZDU0MmQ5ZmY2Mjk4YWU1MmJlNDA1YyIsImlhdCI6MTY4NDMyNTI1NH0.0DiBxrBDhVnwcuO5iWIZWS-8infoHaw-s1nLdFt_ul8",
    },
  });
  console.log(res.data);

  const metadataUri = res.data.IpfsHash;
  // const metadataUri: string = await client.methods.pinMetadata({
  //   name: "Dechains DAO",
  //   description: "This is a description",
  //   avatar: "", // image url
  //   links: [
  //     {
  //       name: "Web site",
  //       url: "https://www.dechains.com",
  //     },
  //   ],
  // });

  const createParams: CreateDaoParams = {
    metadataUri,
    ensSubdomain: "votingdao" + Math.floor(Math.random() * 42069), // my-org.dao.eth
    plugins: [multisigPluginInstallItem, tokenVotingPluginInstallItem2],
  };

  console.log("before estimation", createParams);

  try {
    // Estimate gas for the transaction.
    const estimatedGas: GasFeeEstimation = await client.estimation.createDao(createParams);
    console.log({ avg: estimatedGas.average, max: estimatedGas.max });
  } catch (ex: any) {
    console.log("Error: ", ex);
    console.log("ENS Subdomain Already exist");
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
          console.log({
            daoAddress: step.address,
            pluginAddresses: step.pluginAddresses,
          });
          break;
      }
    } catch (err) {
      console.error(err);
    }
  }

  return { daoAddress: daoAddress, pluginAddresses: pluginAddresses };
};
