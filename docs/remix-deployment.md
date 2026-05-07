# Remix Deployment Guide

This guide is for deploying `AuralisGenesis.sol` manually from Remix.

## 1. Open Remix

Go to https://remix.ethereum.org and create a new file:

```text
contracts/AuralisGenesis.sol
```

Paste the full contents of:

```text
auralis-sdk/contracts/AuralisGenesis.sol
```

## 2. Compiler

Use:

```text
Compiler: 0.8.24 or newer 0.8.x
Enable optimization: yes
Optimizer runs: 200
EVM version: default
```

Remix will resolve these OpenZeppelin imports automatically:

```solidity
@openzeppelin/contracts/access/Ownable.sol
@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol
```

If Remix asks to install or fetch OpenZeppelin contracts, accept it.

## 3. Network

In the Deploy tab:

```text
Environment: Injected Provider
Network: Celo Mainnet
Chain ID: 42220
```

Use a dedicated deployer wallet. Do not use a wallet holding important personal funds for development or testing.

## 4. Constructor Arguments

Deploy `AuralisGenesis` with:

```text
name_: Auralis
symbol_: AURA
initialOwner_: your deployer wallet address
treasury_: your payout wallet address
mintFeeWei_: 2000000000000000
```

Current deployed contract:

```text
0x3CB6e2fC05B6ab2A9BA2093418Befb0Ed2FE394F
```

The deployed contract can also be updated from Remix by calling:

```text
setMintFee(2000000000000000)
```

Optional paid mint examples:

```text
0.001 CELO = 1000000000000000
0.002 CELO = 2000000000000000
0.01 CELO  = 10000000000000000
```

## 5. Contract Linking

No manual contract linking is required. OpenZeppelin dependencies are compiled into the final bytecode by Remix.

## 6. After Deployment

Copy the deployed contract address into the Auralis app `.env.local`:

```bash
NEXT_PUBLIC_AURALIS_NFT_ADDRESS=0xYourDeployedContract
NEXT_PUBLIC_CELO_CHAIN_ID=42220
NEXT_PUBLIC_AURALIS_MINT_FEE_WEI=2000000000000000
```

Restart the app after changing `.env.local`.

## 7. Verify on Celoscan

On https://celoscan.io:

```text
Compiler: v0.8.24 or the exact compiler Remix used
Optimization: enabled
Runs: 200
License: MIT
Contract name: AuralisGenesis
Constructor args:
  "Auralis",
  "AURA",
  initialOwner_,
  treasury_,
  mintFeeWei_
```

Verification matters for Proof of Ship eligibility, so keep the compiler settings exactly aligned with Remix.

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

The deployed `AuralisGenesis` contract accepts CELO fees only. To enforce USDm payments for MiniPay, deploy:

```text
contracts/AuralisGenesisStable.sol
```

Guide:

```text
docs/stable-fees.md
```
