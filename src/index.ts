import {
  getAddress,
  isAddress,
  keccak256,
  stringToHex,
  type Address,
  type Hex,
  type WalletClient,
} from "viem";

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

export const AURALIS_NFT_ABI = [
  {
    type: "constructor",
    inputs: [
      { name: "name_", type: "string", internalType: "string" },
      { name: "symbol_", type: "string", internalType: "string" },
      { name: "initialOwner_", type: "address", internalType: "address" },
      { name: "treasury_", type: "address", internalType: "address payable" },
      { name: "mintFeeWei_", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "mint",
    inputs: [
      { name: "tokenURI", type: "string", internalType: "string" },
      { name: "promptHash", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "ownerMint",
    inputs: [
      { name: "to", type: "address", internalType: "address" },
      { name: "tokenURI", type: "string", internalType: "string" },
      { name: "promptHash", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "mintFeeWei",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setMintFee",
    inputs: [{ name: "newMintFeeWei", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setTreasury",
    inputs: [{ name: "newTreasury", type: "address", internalType: "address payable" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "tokenPromptHash",
    inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalMinted",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "tokenURI",
    inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "AuralisMinted",
    inputs: [
      { name: "minter", type: "address", indexed: true, internalType: "address" },
      { name: "tokenId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "promptHash", type: "bytes32", indexed: true, internalType: "bytes32" },
      { name: "tokenURI", type: "string", indexed: false, internalType: "string" },
    ],
    anonymous: false,
  },
] as const;

export type AuralisNetwork = keyof typeof AURALIS_CHAIN;

export interface AuralisMetadataOptions {
  creator?: Address;
  agentName?: string;
  externalUrl?: string;
  appName?: string;
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
  attributes: Array<{ trait_type: string; value: string }>;
}

export interface MintAuralisNftParams {
  walletClient: WalletClient;
  contractAddress: Address;
  tokenUri: string;
  promptHash: Hex;
  value?: bigint;
}

const PALETTES = [
  ["#08111f", "#00b894", "#ffbe55", "#f85f73", "#eef7f2"],
  ["#101316", "#8fe388", "#f7cf5f", "#e85d75", "#f6f4ef"],
  ["#15100f", "#35d0ba", "#f4a261", "#e76f51", "#fbfbf3"],
  ["#111827", "#3ddc97", "#ffb703", "#fb7185", "#f7fee7"],
  ["#0d1b1e", "#1dd3b0", "#ffd166", "#ef476f", "#f4f1de"],
  ["#171219", "#4ecdc4", "#ffe66d", "#ff6b6b", "#f7fff7"],
] as const;

const PREFIXES = [
  "Mira",
  "Vanta",
  "Eko",
  "Solin",
  "Nava",
  "Kairo",
  "Saffra",
  "Luma",
  "Oro",
] as const;

const FORMS = [
  "Sigil",
  "Bloom",
  "Cipher",
  "Relic",
  "Halo",
  "Lens",
  "Vessel",
  "Pulse",
  "Glyph",
] as const;

const MOODS = [
  "Lucid",
  "Warm",
  "Electric",
  "Quiet",
  "Radiant",
  "Bold",
  "Tender",
  "Kinetic",
] as const;

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

export async function mintAuralisNft({
  walletClient,
  contractAddress,
  tokenUri,
  promptHash,
  value = 0n,
}: MintAuralisNftParams): Promise<Hex> {
  const [account] = await walletClient.getAddresses();

  if (!account) {
    throw new Error("No wallet account is connected");
  }

  return walletClient.writeContract({
    account,
    chain: walletClient.chain,
    address: getAddress(contractAddress),
    abi: AURALIS_NFT_ABI,
    functionName: "mint",
    args: [tokenUri, promptHash],
    value,
  });
}

export function createAuralisDraft(
  prompt: string,
  options: AuralisMetadataOptions = {},
): AuralisDraft {
  const normalized = normalizePrompt(prompt);
  const promptHash = hashPrompt(normalized);
  const bytes = hashBytes(promptHash);
  const palette = PALETTES[bytes[0] % PALETTES.length];
  const mood = pick(MOODS, bytes[1]);
  const form = pick(FORMS, bytes[2]);
  const prefix = pick(PREFIXES, bytes[3]);
  const edition = promptHash.slice(2, 8).toUpperCase();
  const name = `${prefix} ${form} #${edition}`;
  const description = `${name} is an Auralis artifact shaped from a natural-language seed and minted on Celo.`;
  const attributes = [
    { trait_type: "Mood", value: mood },
    { trait_type: "Form", value: form },
    { trait_type: "Palette", value: palette.slice(1, 4).join(" / ") },
    { trait_type: "Prompt Hash", value: promptHash },
    { trait_type: "Agent", value: options.agentName ?? "Auralis Agent" },
  ];
  const svg = createAuralisSvg({
    prompt: normalized,
    promptHash,
    name,
    mood,
    form,
    palette,
  });
  const image = svgToDataUri(svg);
  const metadata = {
    name,
    description,
    image,
    external_url: options.externalUrl ?? "https://auralis.app",
    attributes,
    properties: {
      app: options.appName ?? "Auralis",
      prompt: normalized,
      promptHash,
      creator: options.creator ?? null,
      generatedBy: options.agentName ?? "Auralis Agent",
      chain: "celo",
    },
  };

  return {
    prompt: normalized,
    promptHash,
    name,
    description,
    image,
    svg,
    tokenUri: jsonToDataUri(metadata),
    metadata,
    attributes,
  };
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

function createAuralisSvg(input: {
  prompt: string;
  promptHash: Hex;
  name: string;
  mood: string;
  form: string;
  palette: readonly string[];
}): string {
  const bytes = hashBytes(input.promptHash);
  const [ink, teal, amber, coral, paper] = input.palette;
  const r1 = 150 + (bytes[4] % 100);
  const r2 = 90 + (bytes[5] % 90);
  const drift = bytes[6] % 48;
  const spin = bytes[7] % 360;
  const glyph = input.form.slice(0, 1).toUpperCase();
  const safePrompt = escapeSvg(input.prompt);
  const safeName = escapeSvg(input.name);

  const points = Array.from({ length: 10 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 10 + spin / 180;
    const radius = index % 2 === 0 ? r1 : r2;
    const x = 500 + Math.cos(angle) * radius;
    const y = 450 + Math.sin(angle) * radius;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000" role="img" aria-label="${safeName}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${paper}"/>
      <stop offset="0.52" stop-color="${teal}" stop-opacity="0.28"/>
      <stop offset="1" stop-color="${coral}" stop-opacity="0.42"/>
    </linearGradient>
    <radialGradient id="core" cx="50%" cy="48%" r="60%">
      <stop offset="0" stop-color="${amber}"/>
      <stop offset="0.48" stop-color="${teal}"/>
      <stop offset="1" stop-color="${ink}"/>
    </radialGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="32" stdDeviation="24" flood-color="${ink}" flood-opacity="0.22"/>
    </filter>
  </defs>
  <rect width="1000" height="1000" fill="url(#sky)"/>
  <path d="M0 715 C185 ${620 + drift} 318 ${800 - drift} 500 705 C711 ${595 + drift} 836 ${768 - drift} 1000 642 L1000 1000 L0 1000 Z" fill="${ink}" opacity="0.92"/>
  <circle cx="212" cy="220" r="${70 + (bytes[8] % 70)}" fill="${amber}" opacity="0.62"/>
  <circle cx="796" cy="258" r="${42 + (bytes[9] % 62)}" fill="${coral}" opacity="0.56"/>
  <g transform="rotate(${spin} 500 450)" filter="url(#softShadow)">
    <polygon points="${points}" fill="url(#core)" stroke="${paper}" stroke-width="14" stroke-linejoin="round"/>
    <circle cx="500" cy="450" r="${88 + (bytes[10] % 42)}" fill="${paper}" opacity="0.94"/>
    <text x="500" y="486" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="108" font-weight="800" fill="${ink}">${glyph}</text>
  </g>
  <path d="M254 666 C354 590 443 696 523 632 C608 563 688 620 760 560" fill="none" stroke="${amber}" stroke-width="18" stroke-linecap="round" opacity="0.9"/>
  <text x="84" y="835" font-family="Inter, Arial, sans-serif" font-size="50" font-weight="800" fill="${paper}">${safeName}</text>
  <text x="84" y="893" font-family="Inter, Arial, sans-serif" font-size="27" font-weight="600" fill="${paper}" opacity="0.76">${escapeSvg(input.mood)} ${escapeSvg(input.form)} on Celo</text>
  <text x="84" y="935" font-family="Inter, Arial, sans-serif" font-size="20" fill="${paper}" opacity="0.58">${safePrompt.slice(0, 82)}</text>
</svg>`;
}

function hashBytes(hash: Hex): number[] {
  const pairs = hash.slice(2).match(/.{1,2}/g) ?? [];
  return pairs.map((pair) => Number.parseInt(pair, 16));
}

function pick<T>(items: readonly T[], seed: number): T {
  return items[seed % items.length];
}

function escapeSvg(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
