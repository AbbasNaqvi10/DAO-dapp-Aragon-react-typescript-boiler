import { activeContractsList } from "@aragon/osx-ethers";
import { Client, Context, ContextParams, ContextPlugin, TokenVotingClient } from "@aragon/sdk-client";
import { createContext, useContext, useEffect, useState } from "react";
import useWallet from "src/hooks/useWallet";
import { useNetwork } from "wagmi";

export interface AragonSDKContextValue {
  context?: Context;
  baseClient?: Client;
  tokenVotingClient?: TokenVotingClient;
}

const AragonSDKContext = createContext<AragonSDKContextValue>({});

/**
 * AragonSDKWrapper is a context provider component that wraps the application to provide access
 * to the Aragon SDK.
 */
export function AragonSDKWrapper({ children, ipfsNodes }: any): JSX.Element {
  const { signer } = useWallet();
  const { chain: CHAIN } = useNetwork();
  const chain = CHAIN?.id ?? 1;

  // const { signer, chain } = useConnectedWallet();
  const [context, setContext] = useState<Context | undefined>(undefined);
  const [baseClient, setBaseClient] = useState<Client | undefined>(undefined);
  const [tokenVotingClient, setTokenVotingClient] = useState<TokenVotingClient | undefined>(undefined);

  useEffect(() => {
    if (!signer || !chain) return;

    const aragonSDKContextParams: ContextParams = {
      network: chain || 5,
      signer,
      ...settings(chain as SupportedChainIds, ipfsNodes),
    };
    const contextInstance = new Context(aragonSDKContextParams);
    const contextPlugin = ContextPlugin.fromContext(contextInstance);
    setContext(contextInstance);
    setBaseClient(new Client(contextInstance));
    setTokenVotingClient(new TokenVotingClient(contextPlugin));
  }, [signer, chain, ipfsNodes]);

  return (
    <AragonSDKContext.Provider
      value={{
        context,
        baseClient,
        tokenVotingClient,
      }}
    >
      {children}
    </AragonSDKContext.Provider>
  );
}

/**
 * useAragon is a custom hook to access the AragonSDKContext.
 * @throws {Error} if used outside of AragonSDKWrapper
 */
export function useAragon(): AragonSDKContextValue {
  const context = useContext(AragonSDKContext);
  if (!context) throw new Error("useAragon hooks must be used within an AragonSDKWrapper");
  return context;
}

export const CHAINS = {
  mainnet: 1,
  goerli: 5,
  polygon: 137,
  mumbai: 80001,
} as const;

export type SupportedNetworks = keyof typeof CHAINS;
export type SupportedChainIds = (typeof CHAINS)[SupportedNetworks];

export const SUBGRAPH_API_URL: { [key: number]: string } = {
  1: "https://subgraph.satsuma-prod.com/qHR2wGfc5RLi6/aragon/osx-mainnet/api",
  5: "https://subgraph.satsuma-prod.com/qHR2wGfc5RLi6/aragon/osx-goerli/version/v1.0.0/api",
  137: "https://subgraph.satsuma-prod.com/qHR2wGfc5RLi6/aragon/osx-polygon/api",
  80001: "https://subgraph.satsuma-prod.com/qHR2wGfc5RLi6/aragon/osx-mumbai/api",
};

export const WEB3_PROVIDER_URL: { [key: number]: string } = {
  1: "https://rpc.ankr.com/eth",
  5: "https://rpc.ankr.com/eth_goerli",
  137: "https://rpc.ankr.com/polygon",
  80001: "https://rpc.ankr.com/polygon_mumbai",
};

export const IPFS_NODES = [
  {
    url: "https://testing-ipfs-0.aragon.network/api/v0",
    headers: {
      "X-API-KEY": "b477RhECf8s8sdM7XrkLBs2wHc4kCMwpbcFC55Kt",
    },
  },
];

export function settings(network: SupportedChainIds, nodes?: any) {
  const ipfsNodes = nodes || IPFS_NODES;
  switch (network) {
    case 1:
      return {
        graphqlNodes: [{ url: SUBGRAPH_API_URL[network] }],
        web3Providers: WEB3_PROVIDER_URL[network],
        daoFactoryAddress: activeContractsList["mainnet"].DAOFactory,
        ipfsNodes,
      };
    case 5:
      return {
        graphqlNodes: [{ url: SUBGRAPH_API_URL[network] }],
        web3Providers: WEB3_PROVIDER_URL[network],
        daoFactoryAddress: activeContractsList["goerli"].DAOFactory,
        ipfsNodes,
      };
    case 137:
      return {
        graphqlNodes: [{ url: SUBGRAPH_API_URL[network] }],
        web3Providers: WEB3_PROVIDER_URL[network],
        daoFactoryAddress: activeContractsList["polygon"].DAOFactory,
        ipfsNodes,
      };
    case 80001:
      return {
        graphqlNodes: [{ url: SUBGRAPH_API_URL[network] }],
        web3Providers: WEB3_PROVIDER_URL[network],
        daoFactoryAddress: activeContractsList["mumbai"].DAOFactory,
        ipfsNodes,
      };
    default:
      throw new Error(`Unsupported network ID: ${network}`);
  }
}

