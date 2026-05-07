import { AURALIS_CHAIN, type Hex } from "@auralis/core";

export const AURALIS_AGENT_NAME = "Auralis Agent";

export const ERC8004_CELO = {
  mainnet: {
    identityRegistry: "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432",
    reputationRegistry: "0x8004BAa17C55a88189AE136b182e5fdA19dE9b63",
  },
  sepolia: {
    identityRegistry: "0x8004A818BFB912233c491871b3d84c89A494BD9e",
    reputationRegistry: "0x8004B663056A597Dffe9eCcC1965A193B7388713",
  },
} as const;

export interface AuralisAgentEndpoint {
  type: "https" | "wallet" | "mcp" | "a2a";
  url?: string;
  address?: string;
  chainId?: number;
}

export interface AuralisAgentManifest {
  type: "Agent";
  name: string;
  description: string;
  image: string;
  endpoints: AuralisAgentEndpoint[];
  supportedTrust: string[];
  chains: Array<{ name: string; chainId: number }>;
  protocols: string[];
}

export interface AuralisComposeAgentReceipt {
  name: string;
  action: "compose-nft-metadata";
  promptHash: Hex;
  erc8004: typeof ERC8004_CELO.mainnet;
}

export function createAuralisAgentManifest(input: {
  appUrl: string;
  agentWallet?: string;
  imageUrl?: string;
}): AuralisAgentManifest {
  const appUrl = input.appUrl.replace(/\/$/, "");

  return {
    type: "Agent",
    name: AURALIS_AGENT_NAME,
    description:
      "Composes prompt-shaped NFT metadata and artwork for MiniPay users minting Auralis artifacts on Celo.",
    image: input.imageUrl ?? `${appUrl}/auralis-logo.svg`,
    endpoints: [
      {
        type: "https",
        url: `${appUrl}/api/agent/compose`,
      },
      {
        type: "wallet",
        address: input.agentWallet ?? "0x0000000000000000000000000000000000000000",
        chainId: AURALIS_CHAIN.mainnet.id,
      },
    ],
    supportedTrust: ["reputation", "validation"],
    chains: [
      {
        name: AURALIS_CHAIN.mainnet.name,
        chainId: AURALIS_CHAIN.mainnet.id,
      },
    ],
    protocols: ["ERC-8004"],
  };
}

export function createAuralisComposeReceipt(promptHash: Hex): AuralisComposeAgentReceipt {
  return {
    name: AURALIS_AGENT_NAME,
    action: "compose-nft-metadata",
    promptHash,
    erc8004: ERC8004_CELO.mainnet,
  };
}
