// contracts/ArtGallery.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ArtGallery {
    // ERC-721 Token
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;

    // Event emitted when a token is transferred
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    uint256 private _nextTokenId;
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    // ERC-721 Functions
    function balanceOf(address owner) external view returns (uint256) {
        return _balances[owner];
    }

    function ownerOf(uint256 tokenId) external view returns (address) {
        return _owners[tokenId];
    }

    function safeMint(address to) external {
        require(msg.sender == admin, "Only admin can mint");

        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        _owners[tokenId] = to;
        _balances[to]++;

        emit Transfer(address(0), to, tokenId);
    }
}
