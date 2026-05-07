// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/// @title AuralisGenesis
/// @notice ERC-721 collection for prompt-shaped Auralis artifacts on Celo.
contract AuralisGenesis is ERC721URIStorage, Ownable {
    uint256 public mintFeeWei;
    uint256 public totalMinted;
    address payable public treasury;

    mapping(uint256 tokenId => bytes32 promptHash) public tokenPromptHash;

    event AuralisMinted(
        address indexed minter,
        uint256 indexed tokenId,
        bytes32 indexed promptHash,
        string tokenURI
    );
    event MintFeeUpdated(uint256 oldMintFeeWei, uint256 newMintFeeWei);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);

    constructor(
        string memory name_,
        string memory symbol_,
        address initialOwner_,
        address payable treasury_,
        uint256 mintFeeWei_
    ) ERC721(name_, symbol_) Ownable(initialOwner_) {
        require(initialOwner_ != address(0), "OWNER_ZERO");

        treasury = treasury_ == address(0) ? payable(initialOwner_) : treasury_;
        mintFeeWei = mintFeeWei_;
    }

    function mint(
        string calldata tokenURI_,
        bytes32 promptHash
    ) external payable returns (uint256 tokenId) {
        require(bytes(tokenURI_).length > 0, "TOKEN_URI_EMPTY");
        require(promptHash != bytes32(0), "PROMPT_HASH_EMPTY");
        require(msg.value >= mintFeeWei, "MINT_FEE_LOW");

        tokenId = ++totalMinted;
        tokenPromptHash[tokenId] = promptHash;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        emit AuralisMinted(msg.sender, tokenId, promptHash, tokenURI_);
    }

    function ownerMint(
        address to,
        string calldata tokenURI_,
        bytes32 promptHash
    ) external onlyOwner returns (uint256 tokenId) {
        require(to != address(0), "TO_ZERO");
        require(bytes(tokenURI_).length > 0, "TOKEN_URI_EMPTY");
        require(promptHash != bytes32(0), "PROMPT_HASH_EMPTY");

        tokenId = ++totalMinted;
        tokenPromptHash[tokenId] = promptHash;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        emit AuralisMinted(to, tokenId, promptHash, tokenURI_);
    }

    function setMintFee(uint256 newMintFeeWei) external onlyOwner {
        uint256 oldMintFeeWei = mintFeeWei;
        mintFeeWei = newMintFeeWei;

        emit MintFeeUpdated(oldMintFeeWei, newMintFeeWei);
    }

    function setTreasury(address payable newTreasury) external onlyOwner {
        require(newTreasury != address(0), "TREASURY_ZERO");

        address oldTreasury = treasury;
        treasury = newTreasury;

        emit TreasuryUpdated(oldTreasury, newTreasury);
    }

    function withdraw() external {
        require(msg.sender == treasury || msg.sender == owner(), "NOT_AUTHORIZED");

        uint256 amount = address(this).balance;
        require(amount > 0, "NO_BALANCE");

        (bool ok, ) = treasury.call{value: amount}("");
        require(ok, "WITHDRAW_FAILED");
    }

    receive() external payable {}
}
