export const AURALIS_CONTRACT_NAME = "Auralis";
export const AURALIS_CONTRACT_SYMBOL = "AURA";

export const AURALIS_DEPLOYMENT_DEFAULTS = {
  name: AURALIS_CONTRACT_NAME,
  symbol: AURALIS_CONTRACT_SYMBOL,
  mintFeeWei: "2000000000000000",
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
    name: "treasury",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address payable" }],
    stateMutability: "view",
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
    type: "function",
    name: "withdraw",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
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

export type AuralisNftAbi = typeof AURALIS_NFT_ABI;

export const AURALIS_STABLE_NFT_ABI = [
  {
    type: "constructor",
    inputs: [
      { name: "name_", type: "string", internalType: "string" },
      { name: "symbol_", type: "string", internalType: "string" },
      { name: "initialOwner_", type: "address", internalType: "address" },
      { name: "treasury_", type: "address", internalType: "address payable" },
      { name: "nativeMintFeeWei_", type: "uint256", internalType: "uint256" },
      { name: "stableFeeToken_", type: "address", internalType: "address" },
      { name: "stableMintFee_", type: "uint256", internalType: "uint256" },
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
    name: "mintWithStable",
    inputs: [
      { name: "tokenURI", type: "string", internalType: "string" },
      { name: "promptHash", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "ownerMint",
    inputs: [
      { name: "to", type: "address", internalType: "address" },
      { name: "tokenURI_", type: "string", internalType: "string" },
      { name: "promptHash", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "nativeMintFeeWei",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "stableMintFee",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "stableFeeToken",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract IERC20" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setNativeMintFee",
    inputs: [{ name: "newMintFeeWei", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setStableMintFee",
    inputs: [
      { name: "newToken", type: "address", internalType: "address" },
      { name: "newFee", type: "uint256", internalType: "uint256" },
    ],
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
    name: "tokenURI",
    inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "string", internalType: "string" }],
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
    name: "treasury",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address payable" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "withdrawNative",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdrawStable",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "AuralisMinted",
    inputs: [
      { name: "minter", type: "address", indexed: true, internalType: "address" },
      { name: "tokenId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "promptHash", type: "bytes32", indexed: true, internalType: "bytes32" },
      { name: "tokenURI", type: "string", indexed: false, internalType: "string" },
      { name: "feeToken", type: "address", indexed: false, internalType: "address" },
      { name: "feeAmount", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
] as const;

export type AuralisStableNftAbi = typeof AURALIS_STABLE_NFT_ABI;
