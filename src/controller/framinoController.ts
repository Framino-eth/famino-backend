import {
    Body,
    Controller,
    Get,
    Post,
    Route,
    Tags,
} from "tsoa";
import { FraminoService } from "../service/framinoService";
import { DonateRequest, GetContractInfoResponseModel, NftRedeemRequest } from "../model/framinoModel";
import { NftMintRequest } from "../model/framinoModel";

@Tags("Framino")
@Route("framino")
export class UserController extends Controller {    

    private framinoService = new FraminoService()

    @Post("donate")
    public async donateUSDC(
        @Body() requestBody: DonateRequest
        ): Promise<{ txHash: string }> {
        const result = await this.framinoService.donateUSDCService(requestBody);
        return result;
    }

    @Get("contract")
    public async getContractInfo(): Promise<GetContractInfoResponseModel> {
        const result = await this.framinoService.getContractInfoService();
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
