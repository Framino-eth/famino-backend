import { Nft } from "../model/framinoModel";

export class FraminoService {
  public async getNft(): Promise<Nft[]> {
    // mock data
    return [
      new Nft({
        contractAddress: "0x1234567890abcdef",
        tokenId: "1",
        owner: "0xabcdef1234567890",
        amount: "1",
        metadata: { name: "NFT #1", description: "A sample NFT" }
      })
    ];
  }
}