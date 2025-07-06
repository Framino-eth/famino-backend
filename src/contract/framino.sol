// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract FraminoNFT is ERC1155, Ownable {
    address public cathedral;

    // (user, tokenId) => custom URI
    mapping(address => mapping(uint256 => string)) public customURIs;

    // (user, tokenId) => redeemable balance
    mapping(address => mapping(uint256 => uint256)) public balances;

    // (user, tokenId) => completion status
    mapping(address => mapping(uint256 => bool)) public completed;

    event Minted(address indexed to, uint256 indexed tokenId, uint256 value, string uri);
    event Redeemed(address indexed user, uint256 indexed tokenId, uint256 amount);
    event Completed(address indexed user, uint256 indexed tokenId, string newUri);

    modifier onlyCathedral() {
        require(msg.sender == cathedral, "Not cathedral");
        _;
    }

    constructor(address initialOwner, address _cathedral) ERC1155("") Ownable(initialOwner) {
        cathedral = _cathedral;
    }

    function setCathedral(address _cathedral) external onlyOwner {
        cathedral = _cathedral;
    }

    // Mint NFT after donation
    function mint(
        address account,
        uint256 id,
        uint256 value,
        string memory uri,
        bytes memory data
    ) public onlyOwner {
        require(value > 0, "Value must be positive");
        _mint(account, id, 1, data);
        customURIs[account][id] = uri;
        balances[account][id] = value;
        completed[account][id] = false;
        emit Minted(account, id, value, uri);
    }

    // Redeem goods, decrease balance
    function redeem(uint256 id, uint256 amount) external {
        require(balanceOf(msg.sender, id) > 0, "No NFT owned");
        require(balances[msg.sender][id] >= amount, "Insufficient balance");
        balances[msg.sender][id] -= amount;
        emit Redeemed(msg.sender, id, amount);
    }

    // Cathedral verifies completion and updates URI
    function markCompleted(address user, uint256 id, string memory newUri) external onlyCathedral {
        require(balanceOf(user, id) > 0, "User has no NFT");
        require(!completed[user][id], "Already completed");
        completed[user][id] = true;
        customURIs[user][id] = newUri;
        emit Completed(user, id, newUri);
    }

    // Get the custom URI for a user's NFT
    function getUserTokenURI(address user, uint256 id) public view returns (string memory) {
        return customURIs[user][id];
    }

    // Get the balance for a user's NFT
    function getBalance(address user, uint256 id) external view returns (uint256) {
        return balances[user][id];
    }

    // Get completion status
    function isCompleted(address user, uint256 id) external view returns (bool) {
        return completed[user][id];
    }
}
