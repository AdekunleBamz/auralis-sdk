// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/// @title AuralisGenesisStable
/// @notice ERC-721 collection for Auralis artifacts with native CELO and ERC-20 stablecoin mint fees.
contract AuralisGenesisStable is ERC721URIStorage, Ownable {
    using SafeERC20 for IERC20;

    uint256 public nativeMintFeeWei;
    uint256 public stableMintFee;
    uint256 public totalMinted;
    address payable public treasury;
    IERC20 public stableFeeToken;

    mapping(uint256 tokenId => bytes32 promptHash) public tokenPromptHash;

    event AuralisMinted(
        address indexed minter,
        uint256 indexed tokenId,
        bytes32 indexed promptHash,
        string tokenURI,
        address feeToken,
        uint256 feeAmount
    );
    event NativeMintFeeUpdated(uint256 oldMintFeeWei, uint256 newMintFeeWei);
    event StableMintFeeUpdated(address indexed token, uint256 oldFee, uint256 newFee);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);

    constructor(
        string memory name_,
        string memory symbol_,
        address initialOwner_,
        address payable treasury_,
        uint256 nativeMintFeeWei_,
        address stableFeeToken_,
        uint256 stableMintFee_
    ) ERC721(name_, symbol_) Ownable(initialOwner_) {
        require(initialOwner_ != address(0), "OWNER_ZERO");
        require(stableFeeToken_ != address(0), "STABLE_TOKEN_ZERO");

        treasury = treasury_ == address(0) ? payable(initialOwner_) : treasury_;
        nativeMintFeeWei = nativeMintFeeWei_;
        stableFeeToken = IERC20(stableFeeToken_);
        stableMintFee = stableMintFee_;
    }

    function mint(
        string calldata tokenURI_,
        bytes32 promptHash
    ) external payable returns (uint256 tokenId) {
        require(msg.value >= nativeMintFeeWei, "MINT_FEE_LOW");

        tokenId = _mintArtifact(msg.sender, tokenURI_, promptHash);

        emit AuralisMinted(
            msg.sender,
            tokenId,
            promptHash,
            tokenURI_,
            address(0),
            msg.value
        );
    }

    function mintWithStable(
        string calldata tokenURI_,
        bytes32 promptHash
    ) external returns (uint256 tokenId) {
        stableFeeToken.safeTransferFrom(msg.sender, address(this), stableMintFee);

        tokenId = _mintArtifact(msg.sender, tokenURI_, promptHash);

        emit AuralisMinted(
            msg.sender,
            tokenId,
            promptHash,
            tokenURI_,
            address(stableFeeToken),
            stableMintFee
        );
    }

    function ownerMint(
        address to,
        string calldata tokenURI_,
        bytes32 promptHash
    ) external onlyOwner returns (uint256 tokenId) {
        tokenId = _mintArtifact(to, tokenURI_, promptHash);

        emit AuralisMinted(to, tokenId, promptHash, tokenURI_, address(0), 0);
    }

    function setNativeMintFee(uint256 newMintFeeWei) external onlyOwner {
        uint256 oldMintFeeWei = nativeMintFeeWei;
        nativeMintFeeWei = newMintFeeWei;

        emit NativeMintFeeUpdated(oldMintFeeWei, newMintFeeWei);
    }

    function setStableMintFee(address newToken, uint256 newFee) external onlyOwner {
        require(newToken != address(0), "STABLE_TOKEN_ZERO");

        uint256 oldFee = stableMintFee;
        stableFeeToken = IERC20(newToken);
        stableMintFee = newFee;

        emit StableMintFeeUpdated(newToken, oldFee, newFee);
    }

    function setTreasury(address payable newTreasury) external onlyOwner {
        require(newTreasury != address(0), "TREASURY_ZERO");

        address oldTreasury = treasury;
        treasury = newTreasury;

        emit TreasuryUpdated(oldTreasury, newTreasury);
    }

    function withdrawNative() external {
        require(msg.sender == treasury || msg.sender == owner(), "NOT_AUTHORIZED");

        uint256 amount = address(this).balance;
        require(amount > 0, "NO_BALANCE");

        (bool ok, ) = treasury.call{value: amount}("");
        require(ok, "WITHDRAW_FAILED");
    }

    function withdrawStable() external {
        require(msg.sender == treasury || msg.sender == owner(), "NOT_AUTHORIZED");

        uint256 amount = stableFeeToken.balanceOf(address(this));
        require(amount > 0, "NO_BALANCE");

        stableFeeToken.safeTransfer(treasury, amount);
    }

    function _mintArtifact(
        address to,
        string calldata tokenURI_,
        bytes32 promptHash
    ) internal returns (uint256 tokenId) {
        require(to != address(0), "TO_ZERO");
        require(bytes(tokenURI_).length > 0, "TOKEN_URI_EMPTY");
        require(promptHash != bytes32(0), "PROMPT_HASH_EMPTY");

        tokenId = ++totalMinted;
        tokenPromptHash[tokenId] = promptHash;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);
    }

    receive() external payable {}
}
