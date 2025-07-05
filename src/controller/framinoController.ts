import {
    Body,
    Controller,
    Post,
    Route,
    Tags,
} from "tsoa";
import { FraminoService } from "../service/framinoService";
import { DonateRequest } from "../model/framinoModel";
import { NftMintRequest } from "../model/framinoModel";

@Tags("Framino")
@Route("framino")
export class UserController extends Controller {    
    // @Get("")
    // public async getNft(): Promise<Nft[]> {
    //     const result = await framinoService.getNft();
    //     return result;
    // }

    private framinoService = new FraminoService()

    @Post("donate")
    public async donateUSDC(
        @Body() requestBody: DonateRequest
        ): Promise<{ txHash: string }> {
        const result = await this.framinoService.donateUSDCService(requestBody);
        return result;
    }

    @Post("mint")
    public async mintNft(
        @Body() requestBody: NftMintRequest
    ): Promise<{ txHash: string }> {
        const result = await this.framinoService.mintNftService(requestBody);
        return result;
    }
}
