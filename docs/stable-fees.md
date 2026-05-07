# Auralis Stable Fee Contract

Your deployed `AuralisGenesis` contract accepts native CELO mint fees only. It already holds those fees in the contract and lets the owner or treasury call `withdraw()`.

For MiniPay users who should pay the equivalent fee in USDm, deploy `AuralisGenesisStable.sol` instead. It keeps the same native `mint(...)` path and adds `mintWithStable(...)` for ERC-20 stablecoin fees.

## Contract

```text
/Users/apple/auralis-sdk/contracts/AuralisGenesisStable.sol
```

## Recommended Constructor Values

```text
name_: Auralis
symbol_: AURA
initialOwner_: your deployer wallet address
treasury_: your payout wallet address
nativeMintFeeWei_: 2000000000000000
stableFeeToken_: 0x765DE816845861e75A25fCA122bb6898B8B1282a
stableMintFee_: 200000000000000
```

Notes:

```text
nativeMintFeeWei_ = 0.002 CELO
stableFeeToken_   = USDm on Celo
stableMintFee_    = 0.0002 USDm, using 18 decimals
```

The stable fee is a fixed onchain amount. If you want it to track CELO/USD exactly, update it manually with `setStableMintFee(token, newFee)` when you choose a new reference price.

## Fee Claims

The same contract holds both fee types.

```text
withdrawNative()  claims CELO fees to treasury
withdrawStable()  claims USDm fees to treasury
```

Only the owner or treasury can withdraw.

## MiniPay Flow

MiniPay users need two wallet confirmations:

```text
1. approve USDm spend
2. mintWithStable(...)
```

The app supports this once you set:

```bash
NEXT_PUBLIC_AURALIS_STABLE_NFT_ADDRESS=0xYourStableContract
NEXT_PUBLIC_AURALIS_STABLE_FEE_TOKEN=0x765DE816845861e75A25fCA122bb6898B8B1282a
NEXT_PUBLIC_AURALIS_STABLE_FEE_AMOUNT=200000000000000
NEXT_PUBLIC_AURALIS_STABLE_FEE_SYMBOL=USDm
```
