# Auralis SDK

Reusable TypeScript utilities for the Auralis MiniPay app.

Auralis turns a short text seed into NFT metadata, deterministic SVG artwork, a prompt hash, and a Celo mint transaction payload. The SDK is intentionally separate from the app so future Auralis products can reuse the same ABI, metadata, agent constants, and mint helpers.

GitHub: https://github.com/adekunlebamz/auralis-sdk

## Install

```bash
npm install @auralis/sdk viem
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

## Core Usage

```ts
import { createAuralisDraft, mintAuralisNft } from "@auralis/sdk";

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
