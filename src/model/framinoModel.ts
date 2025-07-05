// models/Nft.ts

export interface NftMetadata {
  [key: string]: any;
}

export class Nft {
  contractAddress: string;
  tokenId: string;
  owner: string;
  amount: string;
  metadata: NftMetadata;

  constructor(params: {
    contractAddress: string;
    tokenId: string;
    owner: string;
    amount: string;
    metadata: NftMetadata;
  }) {
    this.contractAddress = params.contractAddress;
    this.tokenId = params.tokenId;
    this.owner = params.owner;
    this.amount = params.amount;
    this.metadata = params.metadata;
  }
}

export interface DonateRequest {
    amount: string; // USDC amount as string
}

export interface NftMintRequest {
  account: string; // recipient address
  id: number;      // tokenId 0-3 uncompleted: Spring, Summer, Autumn, Winter; 4-7 completed: Spring, Summer, Autumn, Winter
  value: number;   // initial balance
  uri: string;     // metadata URI
}
