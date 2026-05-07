import {
  getAddress,
  isAddress,
  keccak256,
  stringToHex,
  type Address,
  type Hex,
} from "viem";

export type { Address, Hex } from "viem";

export const AURALIS_CHAIN = {
  mainnet: {
    id: 42220,
    name: "Celo",
    rpcUrl: "https://forno.celo.org",
    explorerUrl: "https://celoscan.io",
  },
  sepolia: {
    id: 11142220,
    name: "Celo Sepolia",
    rpcUrl: "https://forno.celo-sepolia.celo-testnet.org",
    explorerUrl: "https://sepolia.celoscan.io",
  },
} as const;

export const CELO_STABLECOINS = {
  USDC: {
    address: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
    decimals: 6,
  },
  USDT: {
    address: "0x48065fBBe25f71C9282dDfbF5e1CD6d6A887483d5e",
    decimals: 6,
  },
  USDm: {
    address: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
    decimals: 18,
  },
} as const;

export type AuralisNetwork = keyof typeof AURALIS_CHAIN;

export interface AuralisMetadataOptions {
  creator?: Address;
  agentName?: string;
  externalUrl?: string;
  appName?: string;
}

export interface AuralisAttribute {
  trait_type: string;
  value: string;
}

export interface AuralisDraft {
  prompt: string;
  promptHash: Hex;
  name: string;
  description: string;
  image: string;
  svg: string;
  tokenUri: string;
  metadata: Record<string, unknown>;
  attributes: AuralisAttribute[];
}

export function normalizePrompt(prompt: string): string {
  return prompt.replace(/\s+/g, " ").trim().slice(0, 420);
}

export function hashPrompt(prompt: string): Hex {
  const normalized = normalizePrompt(prompt);
  if (!normalized) {
    throw new Error("Prompt is required");
  }

  return keccak256(stringToHex(normalized));
}

export function assertAddress(value: string, label = "address"): Address {
  if (!isAddress(value)) {
    throw new Error(`Invalid ${label}: ${value}`);
  }

  return getAddress(value);
}

export function jsonToDataUri(value: unknown): string {
  return `data:application/json;base64,${encodeBase64(JSON.stringify(value))}`;
}

export function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;base64,${encodeBase64(svg)}`;
}

export function encodeBase64(value: string): string {
  const maybeBuffer = (globalThis as typeof globalThis & { Buffer?: typeof Buffer }).Buffer;

  if (maybeBuffer) {
    return maybeBuffer.from(value, "utf8").toString("base64");
  }

  if (typeof btoa === "function") {
    return btoa(unescape(encodeURIComponent(value)));
  }

  throw new Error("No base64 encoder is available in this runtime");
}

export function hashBytes(hash: Hex): number[] {
  const pairs = hash.slice(2).match(/.{1,2}/g) ?? [];
  return pairs.map((pair) => Number.parseInt(pair, 16));
}

export function pick<T>(items: readonly T[], seed: number): T {
  return items[seed % items.length];
}

export function escapeSvg(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
