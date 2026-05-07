import { getAddress, type Address, type Hex, type WalletClient } from "viem";
import { AURALIS_NFT_ABI } from "@auralis/contracts";

export * from "@auralis/agent";
export * from "@auralis/artifacts";
export * from "@auralis/contracts";
export * from "@auralis/core";

export interface MintAuralisNftParams {
  walletClient: WalletClient;
  contractAddress: Address;
  tokenUri: string;
  promptHash: Hex;
  value?: bigint;
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
