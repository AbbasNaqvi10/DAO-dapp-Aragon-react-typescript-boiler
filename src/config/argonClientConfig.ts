import { Wallet } from "@ethersproject/wallet";
import { Context, ContextParams } from "@aragon/sdk-client";
// import { getWalletClient } from "wagmi/actions";

// Set up your IPFS API key. You can get one either by running a local node or by using a service like Infura or Alechmy.
// Make sure to always keep these private in a file that is not committed to your public repository.
export const IPFS_API_KEY: string = "ipfs-api-key";

export const contextParams: ContextParams = {
  // Choose the network you want to use. You can use "goerli" or "mumbai" for testing, "mainnet" for Ethereum.
  network: "goerli",

  // Depending on how you're configuring your wallet, you may want to pass in a `signer` object here.
  // signer: new Wallet(signer? signer : undefined),
  // Optional on "rinkeby", "arbitrum-rinkeby" or "mumbai"
  // Pass the address of the  `DaoFactory` contract you want to use. You can find it here based on your chain of choice: https://github.com/aragon/core/blob/develop/active_contracts.json
  daoFactoryAddress: "0x16B6c6674fEf5d29C9a49EA68A19944f5a8471D3",
  // Choose your Web3 provider: Cloudfare, Infura, Alchemy, etc.
  web3Providers: ["https://rpc.ankr.com/eth_goerli"],
  ipfsNodes: [
    {
      url: "https://api.pinata.cloud/",
      // headers: { "X-API-KEY": IPFS_API_KEY || "" }
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1YjU1ODg4OC1iNWY5LTQzNzUtYmFkMC0yN2JiZmM2ODBjNmIiLCJlbWFpbCI6ImFiYmFzbmFxdmlAZGVjaGFpbnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImIxOGMxYTg1ZmJjMzljNzU4NzgyIiwic2NvcGVkS2V5U2VjcmV0IjoiMzgxMjI0ZDY0MjljNmIyNDljNDdlN2M3NTA4YjFmZTE2NjhhNjNjZGM3ZDU0MmQ5ZmY2Mjk4YWU1MmJlNDA1YyIsImlhdCI6MTY4NDMyNTI1NH0.0DiBxrBDhVnwcuO5iWIZWS-8infoHaw-s1nLdFt_ul8" ||
          "",
      },
    },
  ],
  // Don't change this line. This is how we connect your app to the Aragon subgraph.
  graphqlNodes: [
    {
      url: "https://subgraph.satsuma-prod.com/aragon/core-goerli/api",
    },
  ],
};

// Bare minimoum context that will use de default values
const minimalContextParams: ContextParams = {
  network: "mainnet",
  web3Providers: "https://eth.llamarpc.com",
};

// Instantiate the Aragon SDK context
export const context: Context = new Context({ ...contextParams });
// Instantiate the Aragon SDK context
export const minimalContext: Context = new Context(minimalContextParams);
