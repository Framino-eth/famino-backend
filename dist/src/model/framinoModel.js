"use strict";
// models/Nft.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nft = void 0;
class Nft {
    constructor(params) {
        this.contractAddress = params.contractAddress;
        this.tokenId = params.tokenId;
        this.owner = params.owner;
        this.amount = params.amount;
        this.metadata = params.metadata;
    }
}
exports.Nft = Nft;
