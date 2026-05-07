# Remix Deployment Guide

This guide is for deploying the Auralis contracts manually from Remix.

## 1. Open Remix

Go to https://remix.ethereum.org and create a new file for the contract being deployed:

```text
contracts/AuralisGenesis.sol
contracts/AuralisGenesisStable.sol
```

Paste the full contents from the matching file in this repo's `contracts/` directory.

## 2. Compiler

Use:

```text
Compiler: 0.8.24 or newer 0.8.x
Enable optimization: yes
Optimizer runs: 200
EVM version: default
```

Remix will resolve OpenZeppelin imports automatically. If Remix asks to install or fetch OpenZeppelin contracts, accept it.

## 3. Network

In the Deploy tab:

```text
Environment: Injected Provider
Network: Celo Mainnet
Chain ID: 42220
```

Use a dedicated deployment wallet with only the funds needed for deployment and testing.

## 4. Constructor Arguments

Deploy `AuralisGenesis` for native CELO minting:

```text
name_: Auralis
symbol_: AURA
initialOwner_: <owner wallet address>
treasury_: <treasury wallet address>
mintFeeWei_: 2000000000000000
```

If the native contract was deployed with a zero mint fee, update it from Remix:

```text
setMintFee(2000000000000000)
```

Deploy `AuralisGenesisStable` for MiniPay USDm minting:

```text
name_: Auralis
symbol_: AURA
initialOwner_: <owner wallet address>
treasury_: <treasury wallet address>
nativeMintFeeWei_: 2000000000000000
stableFeeToken_: 0x765DE816845861e75A25fCA122bb6898B8B1282a
stableMintFee_: 200000000000000
```

Fee reference:

```text
0.002 CELO = 2000000000000000
0.0002 USDm = 200000000000000
```

## 5. Contract Linking

No manual contract linking is required. OpenZeppelin dependencies are compiled into the final bytecode by Remix.

## 6. App Configuration

Copy the deployed contract addresses into the app `.env.local`:

```bash
NEXT_PUBLIC_AURALIS_NFT_ADDRESS=0xYourDeployedContract
NEXT_PUBLIC_CELO_CHAIN_ID=42220
NEXT_PUBLIC_AURALIS_MINT_FEE_WEI=2000000000000000
NEXT_PUBLIC_AURALIS_STABLE_NFT_ADDRESS=0xYourStableDeployedContract
NEXT_PUBLIC_AURALIS_STABLE_FEE_TOKEN=0x765DE816845861e75A25fCA122bb6898B8B1282a
NEXT_PUBLIC_AURALIS_STABLE_FEE_AMOUNT=200000000000000
NEXT_PUBLIC_AURALIS_STABLE_FEE_SYMBOL=USDm
```

Restart the app after changing `.env.local`.

## 7. Verify on Celoscan

On https://celoscan.io:

```text
Compiler: v0.8.24 or the exact compiler Remix used
Optimization: enabled
Runs: 200
License: MIT
Contract name: AuralisGenesis or AuralisGenesisStable
Constructor args: use the values from the Constructor Arguments section.
```

Verification matters for public trust and ecosystem programs, so keep the compiler settings aligned with Remix.

## 8. Optional Agent Registration

For the AI Agents prize path, host the app publicly and register the agent using the ERC-8004 Identity Registry on Celo:

```text
Identity Registry: 0x8004A169FB4a3325136EB29fA0ceB6D2e539a432
Reputation Registry: 0x8004BAa17C55a88189AE136b182e5fdA19dE9b63
Agent URI: https://your-domain/.well-known/agent.json
```

The app includes a starter agent file at:

```text
public/.well-known/agent.json
```

## 9. MiniPay Stable Fees

`AuralisGenesis` accepts CELO fees only. MiniPay USDm payments use:

```text
contracts/AuralisGenesisStable.sol
```

Stable fee notes are in:

```text
docs/stable-fees.md
```
