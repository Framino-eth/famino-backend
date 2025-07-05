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

    @Post("donate-USDC-with-paymaster")
    public async donateUSDCWithPaymaster(
        @Body() requestBody: DonateRequest
        ): Promise<{ txHash: string }> {
        const result = await this.framinoService.donateUSDCWithPaymasterService(requestBody);
        return result;
    }

    @Post("mint-with-paymaster")
    public async mintNftByWithPaymaster(
        @Body() requestBody: NftMintRequest
    ): Promise<{ txHash: string }> {
        const result = await this.framinoService.mintNftWithPaymasterService(requestBody);
        return result;
    }

    @Get("contract")
    public async getContractInfo(): Promise<GetContractInfoResponseModel> {
        const result = await this.framinoService.getContractInfoService();
        return result;
    }
}
