import {
  DaoMetadata,
  CreateDaoParams,
  DaoCreationSteps,
  GasFeeEstimation,
  MultisigClient,
  MultisigPluginInstallParams,
} from "@aragon/sdk-client";
import { client } from "./client";
import axios from "axios";
import { JsonRpcSigner } from "ethers";

export const createDAO = async (signer: JsonRpcSigner | undefined) => {
  // Addresses which will be allowed to vote in the Multisig plugin.
  const members: string[] = [
    "0xe3be75e256a92725Ae82E8FB72AE7794382f4F11",
    "0x4BB89b62F7171d172D61AE01311633A5C7848F28",
    "0x34D2e950a33dbCB4D8FbcfcA51811FFB34BeC66F",
    "0x283070d8D9ff69fCC9f84afE7013C1C32Fd5A19F",
  ];

  const multisigPluginIntallParams: MultisigPluginInstallParams = {
    votingSettings: {
      minApprovals: 1,
      onlyListed: true,
    },
    members,
  };

  // Encodes the parameters of the Multisig plugin. These will get used in the installation plugin for the DAO.
  const multisigPluginInstallItem = MultisigClient.encoding.getPluginInstallItem(multisigPluginIntallParams);

  // Pin metadata to IPFS, returns IPFS CID string.
  const metadata: DaoMetadata = {
    name: "dddddd DAO",
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
    ensSubdomain: "dsjfkbjksjf", // my-org.dao.eth
    plugins: [multisigPluginInstallItem],
  };

  // Estimate gas for the transaction.
  const estimatedGas: GasFeeEstimation = await client.estimation.createDao(createParams);
  console.log({ avg: estimatedGas.average, max: estimatedGas.max });

  // Creates a DAO with a Multisig plugin installed.
  const steps = client.methods.createDao(createParams);
  for await (const step of steps) {
    try {
      switch (step.key) {
        case DaoCreationSteps.CREATING:
          console.log({ txHash: step.txHash });
          break;
        case DaoCreationSteps.DONE:
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
};
