import { erc20Abi, getAddress, type Address, type Hex, type WalletClient } from "viem";
import { AURALIS_NFT_ABI, AURALIS_STABLE_NFT_ABI } from "@bamzzstudio/auralis-contracts";

export * from "@bamzzstudio/auralis-agent";
export * from "@bamzzstudio/auralis-artifacts";
export * from "@bamzzstudio/auralis-contracts";
export * from "@bamzzstudio/auralis-core";

export interface MintAuralisNftParams {
  walletClient: WalletClient;
  contractAddress: Address;
  tokenUri: string;
  promptHash: Hex;
  value?: bigint;
}

export interface ApproveAuralisStableFeeParams {
  walletClient: WalletClient;
  tokenAddress: Address;
  spenderAddress: Address;
  amount: bigint;
}

export interface MintAuralisNftWithStableParams {
  walletClient: WalletClient;
  contractAddress: Address;
  tokenUri: string;
  promptHash: Hex;
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

export async function approveAuralisStableFee({
  walletClient,
  tokenAddress,
  spenderAddress,
  amount,
}: ApproveAuralisStableFeeParams): Promise<Hex> {
  const [account] = await walletClient.getAddresses();

  if (!account) {
    throw new Error("No wallet account is connected");
  }

  return walletClient.writeContract({
    account,
    chain: walletClient.chain,
    address: getAddress(tokenAddress),
    abi: erc20Abi,
    functionName: "approve",
    args: [getAddress(spenderAddress), amount],
  });
}

export async function mintAuralisNftWithStable({
  walletClient,
  contractAddress,
  tokenUri,
  promptHash,
}: MintAuralisNftWithStableParams): Promise<Hex> {
  const [account] = await walletClient.getAddresses();

  if (!account) {
    throw new Error("No wallet account is connected");
  }

  return walletClient.writeContract({
    account,
    chain: walletClient.chain,
    address: getAddress(contractAddress),
    abi: AURALIS_STABLE_NFT_ABI,
    functionName: "mintWithStable",
    args: [tokenUri, promptHash],
  });
}
