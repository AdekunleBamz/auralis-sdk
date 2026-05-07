# Auralis SDK

Reusable TypeScript utilities for the Auralis MiniPay app.

Auralis turns a short text seed into NFT metadata, deterministic SVG artwork, a prompt hash, and a Celo mint transaction payload. The SDK is intentionally separate from the app so future Auralis products can reuse the same ABI, metadata, agent constants, and mint helpers.

GitHub: https://github.com/adekunlebamz/auralis-sdk

## Package Layout

This repo now contains five Auralis packages:

| Package | Purpose |
| --- | --- |
| `@bamzzstudio/auralis-core` | Celo constants, stablecoin constants, prompt hashing, address validation, shared types, data URI helpers |
| `@bamzzstudio/auralis-artifacts` | Deterministic SVG artwork and NFT metadata generation |
| `@bamzzstudio/auralis-contracts` | Auralis ERC-721 ABI and Remix deployment defaults |
| `@bamzzstudio/auralis-agent` | ERC-8004 registry constants, agent manifest helpers, compose receipts |
| `@bamzzstudio/auralis-sdk` | Umbrella package that re-exports the others and adds wallet mint helpers |

The app can keep importing from `@bamzzstudio/auralis-sdk`, while the SDK package itself is composed from the smaller Auralis packages.

## Install

```bash
npm install @bamzzstudio/auralis-sdk viem
```

For local development from the sibling app:

```bash
npm install ../auralis-sdk
```

## Build

```bash
npm install
npm run build
```

Useful package checks:

```bash
npm run typecheck
npm run clean
```

## Core Usage

```ts
import { createAuralisDraft, mintAuralisNft } from "@bamzzstudio/auralis-sdk";

const draft = createAuralisDraft("a ceremonial badge for community builders");

await mintAuralisNft({
  walletClient,
  contractAddress: "0xYourAuralisContract",
  tokenUri: draft.tokenUri,
  promptHash: draft.promptHash,
});
```

## Contract

The Remix-ready contract lives in [`contracts/AuralisGenesis.sol`](contracts/AuralisGenesis.sol).

Deployment guide: [`docs/remix-deployment.md`](docs/remix-deployment.md)
